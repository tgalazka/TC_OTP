var global_error_background = '#ffaaee';

	function reloadForm() {
		if ((_gForm_Saved_BTR == 1) && (_gForm_Saved_TransferActivities == 1))
		{
			window.location.href = window.location.href + "&rID=" +	_gForm_ID;
		}
		if ((_gForm_Saved_BTR == 2) && (_gForm_Saved_TransferActivities == 2))
		{
			window.location.href = 'BTR.aspx';
		}
	}
	

	function DeleteTransferActivity(position,rowId) {
		
		//if this is not a new entry, set action field to delete  else delete the html element should use an operation inside the data grid 
		//check action field
		//fromTAItemAction
		var vPosition = position.toLowerCase();
		var action = $('#' + vPosition + 'TAItemAction' + rowId).val();
		var itemCount = 0;
		
		if (vPosition == 'from') {
			itemCount = _gRptSect_From.GetRowIds().length;
		}
		else {
			itemCount = _gRptSect_To.GetRowIds().length;
		}
		
		if (itemCount == 1)
		{
			alert('This row can not be delete.');
			return;
		}
		
		if (action.toUpperCase() == 'UPDATE') {
			//this already exist so hide the section and update the action
			
			$('#' + vPosition + 'TASection' + rowId).hide();
			$('#' + vPosition + 'TAItemAction' + rowId).val('delete');
			//need to zero out the amount field
			if (vPosition == 'from') 			{
				$('#fromTAAmountToTransfer' + rowId).val(0);
			}
			else {
				$('#toTAAmountToTransfer' + rowId).val(0);
			}
			
		}
		
		if (action.toUpperCase() == 'CREATE') {
			$('#' + vPosition + 'TASection' + rowId).remove();
			if (vPosition == 'from') {
				itemCount = _gRptSect_From.DeleteRow(rowId);
			}
			else {
				itemCount = _gRptSect_To.DeleteRow(rowId);
			}
		}
		//
		$('#totalFromValue').text('$'+Formula_CalcTotals('[rel="from.select.amounttotransfer"]'));
		$('#totalToValue').text('$'+Formula_CalcTotals('[rel="to.select.amounttorecieve"]'));

	}
	
	//function ShowPositions() {
	//	$('#popupPositions').popup('show');
	//}
	
	function GetAllAccountsAndBalances(aryValues,cbFunction)
	{
		var index_keys = aryValues.join(",");

		BTR.Account.GetAccountBalances(index_keys,
			function (data) {
				cbFunction(data)
			},
			function (data) {
				alert("Error(GetBTRItems): "+ data.Message);
			}
		);
	}
	
	function GetAccounts(controlId,index_key,selectedValue)
	{
		BTR.Account.GetAccountsByIndexKey(index_key,	
			function (data) {
				var _select = new Array();
				
				_select.push('<option value="-1">Select Account</option>');
				$.each(data, function(index,obj) {
				    _select.push('<option value="'+obj.account_key+'">'+obj.account_number_description+'</option>');
				});
				//if this is on the From side then clear balance
				
				//clear accounts and repopulate
				$(controlId).empty().append(_select.join());			
				if ((typeof selectedValue ) != 'undefined')
				{
					$(controlId).val(selectedValue);
				}
			  },
			function (data) {
				  alert("Error(GetBTRItems): "+ data.Message);
		 }
		);
	}

	function GetAccountBalance(controlId,account_key)
	{
		BTR.Account.GetAccountBalance(account_key,	
			function (dataArray) {
				var data = dataArray[0];
				$(controlId).text(data.account_balance);			
			},
			function (data) {
				alert("Error(GetBTRItems): "+ data.Message);
		 	}
		);
	}


	function GetIndicesOwned(cb)
	{
		var dept_key = null;
		
		if ((_gData_IndexDenorm == null) || ((typeof _gData_IndexDenorm) == 'undefined'))
		{
			if (_gForm_transfer_type == _gConstForm_transfer_type_IntraDept) {
				dept_key = BTR.User.dept_key;
			}
			
			BTR.Index.GetIndicesOwnedByDept(_gUser_User_uni_code,dept_key,
				function (data) {
					_gData_IndexDenorm = data; // clone the array
					cb(_gData_IndexDenorm);
				},
				function (data) {
				  alert("Error (GetIndicesOwned): "+ data.Message);
				}
			);
		}
		else {
			cb(_gData_IndexDenorm);
		}
	}

	function GetIndicesAll(cb)
	{
		var dept_key = null;

		if ((_gData_IndexTo == null) && ((typeof _gData_IndexTo) == 'undefined'))
		{
			if (_gForm_transfer_type == _gConstForm_transfer_type_IntraDept) {
				dept_key = BTR.User.dept_key;
			}
			
			//if dept_key is null it will return all indices
			BTR.Index.GetIndicesByDept(dept_key,
				function (data) {
					_gData_IndexTo = data; // clone the array
					cb(_gData_IndexTo);
				},
				function (data) {
				  alert("Error(GetIndicesAll): "+ data.Message);
				}
			);
		}
		else {
			cb(_gData_IndexTo.slice(0));
		}
	}

	
	var	DataGrid = function (rootNodeElement,vSection) {
		return {
			rootNode : rootNodeElement,
			gvRows : [],
			section: vSection,
			OnAddRow:  function(cbEvent) {
				this.addRowEvent = cbEvent;
			},
			GetFooter : function() {
				return $('#'+this.section+' div[datalabel="footer"]');
			},
			DeleteRow : function(rowId) {
				for(var i = this.gvRows.length - 1; i >= 0; i--) {
					if(this.gvRows[i] === rowId) {
						this.gvRows.splice(i, 1);
					}
				}
			},
			AddRow : function(objSettings) {
				var newId = '_F'+this.gvRows.length;
				var htmlString = this.rootNode.html().replace(/_FXXXXX/g,newId);
				var htmlString = htmlString.replace(/_isrequired/g,'required'); //take care of required fields
				$('#'+this.section+' div[datalabel="body"]').append(htmlString);
	
				if (this.gvRows.length==0) {
					var anchorId = this.section + newId;
					var addRowLink = this.GetFooter().find("a[datalabel='dlAddNewRow']");
					addRowLink.click(this.AddRow.bind(this));
				}
				this.gvRows.push(newId);
				//do databings
				//wire events
				if ((typeof this.addRowEvent) != 'undefined'){ 
					this.addRowEvent(this.addRowEvent.bind(this));
				}
				if ((objSettings != null) && ((typeof objSettings) != 'undefined')) 
				{
					for(var iCount = 0; iCount < objSettings.length; iCount++) {
						var obj = objSettings[iCount];
						console.log(obj);
						console.log(obj.name);
						console.log(obj.properties);
						var htmlElement = $('[rel="'+obj.name+'"]');
					}
				}
			},  //end of function
			Populate : function(elemName, GetDataFn, PopulateFn) {
				GetDataFn(PopulateFn); 
			},
			GetRowIds : function() {
				return this.gvRows;
			}, 
			GetElement : function(elemName) {
						$('[rel="'+elemName+'"]');
			} //end of function
		}; //end of return
	}; // end of variable
	
	function PopulateElement (GetDataFn, PopulateFn) {
		GetDataFn(PopulateFn); 
	}

	function SetFormStatus(status) {
		if (status != null) status = status.toLowerCase();
		_gForm_IsDirty = (status == 'clean');
	}
	
	function IsFormDirty() {
		return _gForm_IsDirty;
	}

	function CancelForm(warning) {
		if (warning && IsFormDirty())
		{
			var userSelection = confirm("Are you sure that you want to cancel your current changes?");
			if (!userSelection) 
			{
				return;
			}
		}
		window.location.href = "../";
	}
	
	function ErrorClear()
	{
		$("#divErrorPane").css('visibility','hidden');
		$("#divErrorBody").html("");
	}

	function ErrorDisplay()
	{
		$("#divErrorPane").css('visibility','visible');
	}
	
	function ErrorWrite(error)
	{
		$("#divErrorBody").append(error+"<p/>");
	}
	
	function IsFormDataValid() {
		var errorCount = 0;
		//Evaluate all Selectors
		ErrorClear();
		$("form *[required]").css("background-color","white");
		var elements = $("form *[required]");
		for(var index = 0; index < elements.length;  index++)
		{
			element = elements[index];
			if (element.id.indexOf('_FXXXXX') > 0) continue; //skip hidden repeating section

			if (element.localName == "select")
			{
				if(element.selectedIndex == "0")
				{
					element.style.backgroundColor = global_error_background;
					++errorCount;
					ErrorWrite(errorCount + ': ERR-C02 - ('+ element.name +') Value needs to be selected.');
				}
			}
			if (element.localName == "input")
			{
				if(element.value == "")
				{
					element.style.backgroundColor = global_error_background;
					++errorCount;
					ErrorWrite(errorCount + ': ERR-C02 - ('+ element.name +') Need an input.');

				}
			}
			
		}

		//Custom Rules
		//check if totalFromValue == totalToValue
		if($("#totalFromValue").text() != $("#totalToValue").text())
		{
			++errorCount;
			ErrorWrite(errorCount + ': ERR-C02 - <u>From</u> toal value and <u>To</u> total value must be equal.');
		}
		
		if (errorCount > 0)
		{
			ErrorDisplay();
		}
		return (errorCount == 0);
	}
	
	function CollectFormDataBTR() {
		var frmObj = BTR.BudgetTransfer.DataItem.Create();
		
		frmObj.btr_key = _gForm_ID;
		var budget_type = $('[rel-field="BTR.budgetType"]').val();
		frmObj.budget_type_key = BTR.LookupValues.GetKey(BTR.LookupValues.Budget_Types.values,budget_type);
		frmObj.budget_type = budget_type;
		
		var life_cycle = $('#txtBTR_life_cycle').val();
		frmObj.life_cycle = life_cycle; //Put the request into approval mode
		frmObj.life_cycle_key = BTR.LookupValues.GetKey(BTR.LookupValues.Life_Cycles.values,life_cycle); //Put the request into approval mode

		var transfer_type = $('#txtBTR_transfer_type').val();
		frmObj.transfer_type_key = BTR.LookupValues.GetKey(BTR.LookupValues.Transfer_Types.values,transfer_type);
		frmObj.transfer_type = transfer_type;

		frmObj.title = $('#txtBTR_title').val();
		frmObj.total_amount = Formula_CalcTotals('[rel="from.select.amounttotransfer"]');
		frmObj.requestor_uni_key = BTR.User.uni_key;
		frmObj.modified_by = BTR.User.uni_key; //this should equal the current user 
		frmObj.created_by = BTR.User.uni_key; 
		if (frmObj.explanation != null)
		{
			frmObj.explanation = $('#txtexplanation').val();
		}
		return frmObj;
	}
	
	function CollectTransferActivityItem(position,action,itemIndex,id,btrObj)
	{
		//Create the item object with the metadata item in it
		var item = BTR.TransferActivity.DataItem.Create();
		
		var elemIdIndex =  '#' + position + 'TAIndex'+id;
		var elemIdAccount =  '#' + position + 'TAAccount'+id;
		item.transfer_activity_key = $('#' + position + 'TAListItemId'+id).val();
		//Common fields
		item.row_id = $('#' + position + 'TAItemIndex' + id).val();
		item.row_guid = '';
		item.btr_guid = btrObj.btr_guid;
		item.row_id = itemIndex;
		item.btr_key = btrObj.btr_key;
		item.position_type = position.toUpperCase();
		item.position_type_key = BTR.LookupValues.GetKey(BTR.LookupValues.Position_Types.values,position);

		//Index data
		item.index_key = $(elemIdIndex).val();

		//Account Information
		item.account_key = $(elemIdAccount).val();
		
		//Amount
		item.amount = $('#'+position+'TAAmountToTransfer'+id).val();
		item.modified_by = BTR.User.uni_key; //this should equal the current user 

		if (action.toLowerCase() == "create")
		{
			item.created_by = BTR.User.uni_key; //this should only be set if this is a new record but the 
		}
		
		return item;			
	}
	
	function CollectFormDataTransferActivities(btrObj) {
		var TransferItems = new Array();
		var rowIdArray = _gRptSect_From.GetRowIds();
		
		for(var iCnt=0; iCnt < rowIdArray.length; iCnt++) 	{
			var oAction = {};
			oAction.action = $('#fromTAItemAction' + rowIdArray[iCnt]).val();
			oAction.transfer_activity= CollectTransferActivityItem('from',oAction.action,iCnt,rowIdArray[iCnt],btrObj);

			TransferItems.push(oAction);
		}
	
		rowIdArray = _gRptSect_To.GetRowIds();
		for(var iCnt=0; iCnt < rowIdArray.length; iCnt++) 	{
			var oAction= {};
			oAction.action = $('#toTAItemAction' + rowIdArray[iCnt]).val();
			oAction.transfer_activity= CollectTransferActivityItem('to',oAction.action,iCnt,rowIdArray[iCnt],btrObj);
			TransferItems.push(oAction);
		}
		return TransferItems;
	}
	
	function SaveTransferActivities(aryTransferActivityObjItems,scb,fcb) {
		BTR.TransferActivity.BatchSave(aryTransferActivityObjItems,scb, function(errObj)
		{
			console.log(errObj);
			alert('Error saving data'); 
		});
	}

	function FormSavedUpdates() 	{
		$("#divStatus"+ _gBtrObj.life_cycle).css('background-color','red').css('color','white');
		SetFormStatus('clean');
		$("#btnSubmit").css('display','inline');
		$("#modalStatustitle").text('Data saved');
		$('#loadingMessagePassed').toggle();
		$('#loadingIcon').toggle();
	}

	function FormSavedWithError(errorMessage) 	{
		$("#divStatus"+ _gBtrObj.life_cycle).css('background-color','red').css('color','white');
		SetFormStatus('dirty');
		$("#modalStatustitle").text('Error saving data');
		$('#loadingMessageFailed').toggle();
		$('#loadingMessageText').val('Error saving data:'+errorMessage);		
		
		$('#loadingIcon').toggle();
	}

	function SaveForm(saveMode) {
		var isDraftMode = (saveMode.toLowerCase() == 'draft');
		var saveTypeDraft = (saveMode.toLowerCase() == 'draft');
		var eTag = "*";
		var done = false;
		var aryTransferActivityObjItems;
		
		if (IsFormDataValid()) {
			_gForm_Saved_BTR = 0;
			_gForm_Saved_TransferActivities = 0;

			//TODO: Check if form has been submitted already
			if (saveMode.toLowerCase() == 'submit') {
				var userSelection = confirm("Are you sure that you want to submit your changes for approval?");
				if (!userSelection) 
				{
					return;
				}
			}

			$("#modalStatustitle").text('Saving data');
			
			if ($('#loadingIcon').css('display') != 'block')
			{
				$('#loadingMessage').toggle();
				$('#loadingIcon').toggle();
	
			}
			$('#modalStatus').modal();
			
			//Preprocessing before information is collected
			
			if (isDraftMode) {
		
				$('#txtBTR_life_cycle').val('Draft');
			}
			else
			{
				$('#txtBTR_life_cycle').val('Approval'); 
			}
			

			var formDataBTR = CollectFormDataBTR();
			if (_gForm_Mode == _gConst_Form_ModeNew) {
				BTR.BudgetTransfer.Create(formDataBTR,
				function(data) {
					//write the data back into its source
					_gForm_Mode = _gConst_Form_ModeEdit; //put the form into 
					_gForm_ID = data.btr_key;
					PopulateBTRObject(data);
					$(".statusDivText").css('background-color','white').css('color','black');
					$("#divStatus"+ _gBtrObj.life_cycle).css('background-color','red').css('color','white');
					aryTransferActivityObjItems = CollectFormDataTransferActivities(_gBtrObj);
					_gForm_Saved_BTR = (saveMode.toLowerCase() == 'draft') ? 1 : 2;
					SaveTransferActivities(aryTransferActivityObjItems, 
						function() {
							_gForm_Mode = _gConst_Form_ModeEdit; //put the form into edit mode
							FormSavedUpdates();
							_gForm_Saved_TransferActivities = (saveMode.toLowerCase() == 'draft') ? 1 : 2;
						},
						function (errData) {
							FormSavedWithError(errData.InnerError);
						}
					);
				},
				function(errData) {
					FormSavedWithError(errData.InnerError);
				});
			}
			else {
				BTR.BudgetTransfer.Update(_gBtrObj.btr_key,formDataBTR,eTag,
					function () {
							_gForm_Saved_BTR = (saveMode.toLowerCase() == 'draft') ? 1 : 2;
							aryTransferActivityObjItems = CollectFormDataTransferActivities(_gBtrObj);
					
							SaveTransferActivities(aryTransferActivityObjItems, 
								function() {
									_gForm_Saved_TransferActivities = (saveMode.toLowerCase() == 'draft') ? 1 : 2;
									FormSavedUpdates();
								},
								function(erroData) {
									//an error happened
									FormSavedWithError(errData.InnerError);
								}
							);
					},
					function(errData) {
						FormSavedWithError(errData.InnerError);
					}
				);
			}
		}
		else {
			$("#modalStatustitle").text('Saving data - Validation Error');
			$('#loadingMessage').toggle();
			$('#loadingIcon').toggle();
		}
	}

//---------------- Formula Functions	
	function Formula_CalcTotals(selector) {
		var elemArray = $(selector);
		var value=0;

		$.each(elemArray,function(index, val) {
		//add up the elements
			if (val.value.length != 0)
			{
				value += val.value * 1.00;
			}
		});
		return value;
	}

	function PopulateTransferActivities(transferActivities,accountCache)
	{
		for(var index=0; index < transferActivities.length; index++)
		{
			//populate rows
			var position = transferActivities[index].position_type.toLowerCase();
			
			if (position == "from")
			{
				_gRptSect_From.AddRow();
				var rowArray = _gRptSect_From.GetRowIds();
				var lastId = rowArray[rowArray.length-1];
				$('#fromTAIndex'+lastId).val(transferActivities[index].index_key);
				//fetch and populate data
				GetAccountAndBalanceFromCache(accountCache,'#fromTAAccount'+lastId,'#fromTABalance'+lastId,transferActivities[index].index_key,transferActivities[index].account_key);

				$('#fromTAItemIndex' + lastId).val(transferActivities[index]);
				$('#fromTAAmountToTransfer'+lastId).val(transferActivities[index].amount);
				$('#fromTAItemAction'+lastId).val('update');
				$('#fromTAListItemId'+lastId).val(transferActivities[index].transfer_activity_key);
				
			}
			else
			{
				_gRptSect_To.AddRow();
				var rowArray = _gRptSect_To.GetRowIds();
				var lastId = rowArray[rowArray.length-1];
				$('#toTAIndex'+lastId).val(transferActivities[index].index_key);
				GetAccountAndBalanceFromCache(accountCache,'#toTAAccount'+lastId,null,transferActivities[index].index_key,transferActivities[index].account_key);
				
				//fetch and populate data
				$('#toTAItemIndex' + lastId).val(transferActivities[index]);
				$('#toTAAmountToTransfer'+lastId).val(transferActivities[index].amount);
				$('#toTAItemAction'+lastId).val('update');
				$('#toTAListItemId'+lastId).val(transferActivities[index].transfer_activity_key);
			}
		} //end of for loop
	}

	//Populate the global BTR Object variable
	function PopulateBTRObject(oItem) {
		//console.log(oItem);
		_gBtrObj.btr_guid = oItem.btr_guid;
		_gBtrObj.approved_date = oItem.approvate_date;
		_gBtrObj.approval_status= oItem.approval_status;
		_gBtrObj.requestor_uni_code = oItem.requestor_uni_code;
		_gBtrObj.requestor_uni_key = oItem.requestor_uni_key;
		_gBtrObj.budget_type= oItem.budget_type;
		_gBtrObj.title = oItem.title;
		_gBtrObj.approval_status = oItem.approval_status;
		_gBtrObj.approved_date = oItem.approved_date;
		_gBtrObj.Attachments = 1;
		_gBtrObj.budget_type= oItem.budget_type;
		_gBtrObj.created= oItem.created;
		_gBtrObj.btr_key = oItem.btr_key;
		_gBtrObj.internal_state = oItem.internal_state;
		_gBtrObj.life_cycle = oItem.life_cycle;
		_gBtrObj.modified = oItem.modified;
		_gBtrObj.request_date = oItem.request_date;
		vexplanation = '';
		if (oItem.explanation != null)
		{
			var vMatch = oItem.explanation.match(/<div .*>(.*)<\/div>/i); //SharePoint returns with extra div wrapped around the text
			vexplanation = (vMatch != null ) ? vMatch[1] : oItem.explanation;
		}
		_gBtrObj.explanation = vexplanation.trim();
		_gBtrObj.transfer_type = oItem.transfer_type.toLowerCase();
		_gForm_transfer_type = oItem.transfer_type.toLowerCase();
	}
	//Populate BTR form elements
	function SetBTRForm(objBtr) {
		$('#txtBTR_Guid').val(objBtr.btr_guid);
		$('#txtBTR_ApprovedDate').val(objBtr.approved_date);
		$('#txtBTR_ApprovalStatus').val(objBtr.approval_status);
		$("#lblRequester").html(objBtr.requestor_uni_code);
		$("#txtBTR_Requestor").val(objBtr.requestor_uni_code);
		$('#budgetType').val(objBtr.budget_type);
		$('#txtBTR_title').val(objBtr.title);
		$("#divStatus"+ objBtr.life_cycle).css('background-color','red').css('color','white');
		$('#txtexplanation').val(objBtr.explanation);	
		
		$('#txtBTR_life_cycle').val(objBtr.life_cycle); //Put the request into the default starting state Draft
		$('#txtBTR_transfer_type').val(objBtr.transfer_type); //Put the request into the default starting state Draft
	}
	
	function GetAccountAndBalanceFromCache(acctData, acctField,balanceField,indexKey,acctKey) {
		var _select = new Array();
		_select.push('<option value="-1">Select Account</option>');

		for(var index =0; index < acctData.length; index++) {
			var obj = acctData[index];
			if (obj.index_key == indexKey)
			{
		    	_select.push('<option value="'+obj.account_key+'">'+obj.account_number_description+'</option>');
		    	if ((acctKey == obj.account_key) && (balanceField != null))
				{
					$(balanceField ).text(obj.account_balance);
				}
		    }
		
		}
		$(acctField).empty().append(_select.join());			
		$(acctField).val(acctKey);
	}



	function BuildForm(cbFunc,cbFuncFailed) {
		
		BTR.BudgetTransfer.SiteUrl(_gConstBTRServiceUrl);
		BTR.TransferActivity.SiteUrl(_gConstTransferActivityServiceUrl);
		if (_gForm_Mode == _gConst_Form_ModeNew)
		{
			//Treat as new form
			_gBtrObj.Requester = _gUser_User_uni_code;
			$("#lblRequester").html(_gUser_User_uni_code); 
			$("#txtBTR_Requestor").val(_gUser_User_uni_code);
			$('#txtBTR_life_cycle').val('Draft'); //Put the request into the default starting state Draft
			$('#txtBTR_transfer_type').val(_gForm_transfer_type); //Put the request into the default starting state Draft
			$('#divStatusNew').css('background-color','red').css('color','white');
			//Add rows to the screen
			_gRptSect_From.AddRow();
			_gRptSect_To.AddRow();

			//Set the Item Index to a default value
			$('#fromTAItemIndex'+_gRptSect_From.GetRowIds()[0]).val(1);
			$('#toTAItemIndex'+_gRptSect_To.GetRowIds()[0]).val(1);
			cbFunc(); //Need to fix because of async
		}
		else
		{
			//get the current BTR record
			
			BTR.BudgetTransfer.Item(_gForm_ID, 
				function(dataBtrObj) {
						
						PopulateBTRObject(dataBtrObj);
						SetBTRForm(_gBtrObj);
						var aryAccountIndexKeys= new Array();
						
						BTR.TransferActivity.GetBTRAssociatedTransferActivities(_gForm_ID, 
							function (dataArray) {
								//build an array of account keys
								for(var index=0; index < dataArray.length; index++) {
									aryAccountIndexKeys.push(dataArray[index].index_key);
								}
								//submit all of the account keys at one time
								
								GetAllAccountsAndBalances(aryAccountIndexKeys, 
									function(acctData) {
										PopulateTransferActivities(dataArray,acctData);
										$('#totalFromValue').text('$'+Formula_CalcTotals('[rel="from.select.amounttotransfer"]'));
										$('#totalToValue').text('$'+Formula_CalcTotals('[rel="to.select.amounttorecieve"]'));
										cbFunc();
									}
								);
							}
						); // end of Get All Accounts and Balances
				}, 
				function() {
					alert('Failed to get Budget Transfer Record');
				}
			); //end of BudgetTransfer Item function

		}	
	}
	
	function BuildForm_Populate_IndicesToSide(callback) {
		//Get the full index list
		PopulateElement(GetIndicesAll,function(data2) {
			var _select = new Array();
			$.each(data2, function(index,obj) {
			    _select.push('<option value="'+obj.index_key+'">'+obj.index_number_description+'</option>');
			});
		
			//$('#toTAIndex_FXXXXX').append(_select.join());	
			var htmlFragment = $($('#toTableTemplate').html()); //get the html fragment and turn it into a domelement
			htmlFragment.find('#toTAIndex_FXXXXX').append(_select.join())
			_gToTableTemplate = htmlFragment.html();
			
			callback();
		});
	}

	function BuildForm_Populate_IndicesFromSide(callback) {
		//Get the denormalized index list
		
			PopulateElement(GetIndicesOwned,function(data) {
				var _select = new Array();

				$.each(data, function(index,obj) {
					_select.push('<option value="'+obj.index_key+'">'+obj.index_number_description+'</option>');
				});
				
				
		//TODO: This can be better
		//debugger;
				var htmlFragment = $($('#fromTableTemplate').html()); //get the html fragment and turn it into a domelement
				htmlFragment.find('#fromTAIndex_FXXXXX').append(_select.join())
				_gFromTableTemplate = htmlFragment.html();
				callback();
			});
	}	
	var waitDialog  = null;
	function HideOverlay(){
		try {
		    waitDialog.close();
		    waitDialog = null;
		} 
		catch (ex) { }

	}
	function ShowWaitDialog(){
		try {
			      if (waitDialog == null) {
			         waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose('Processing...', 'Please wait while request is in progress...', 76, 330);
			      }
			   } 
			   catch (ex) { }

	}
	function ShowOverlay(toggle) {
		if (toggle)
		{
			/*var over = '<div id="overlay"><img id="loading" src="../SiteAssets/BTR/images/animated_wait.gif"></div>';
	        $(over).appendTo('body');*/
	        try {
			      if (waitDialog == null) {
			         waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose('Processing...', 'Please wait while request is in progress...', 76, 330);
			      }
			   } 
			   catch (ex) { }
		}
		else
		{
			/*$("#overlay").css("display","none");*/
			try {
			    waitDialog.close();
			    waitDialog = null;
			} 
			catch (ex) { }
		}
	}	


	function LoadForm() {

		BuildForm_Populate_IndicesFromSide(function () {
			BuildForm_Populate_IndicesToSide(function () {
				//everything should be populated by now
				//_gFromTableTemplate = $('#fromTableTemplate').html();
				//   _gToTableTemplate = $('#toTableTemplate').html();
				   debugger;
				   _gFromMakeRow = Handlebars.compile(_gFromTableTemplate);
				   _gToMakeRow = Handlebars.compile(_gToTableTemplate);
				
				  addRowToTable('.originating-table',_gFromMakeRow,++_gFromRowIndex);
				  addRowToTable('.receiving-table',_gToMakeRow,++_gToRowIndex);

				//BuildForm(
				//	function () {
				//		waitingDialog.hide();
				//	}, 
				//	function() {
				//		waitingDialog.hide();
				//	}
				//);
			});
		});
	}
	
	function LoadDataGrid() {
		//initialize the first rows of the repreating section
		_gRptSect_From = DataGrid($('#fromTA_FXXXXX'),'fromColumn');
		_gRptSect_To = DataGrid($('#toTA_FXXXXX'),'toColumn');
			
		//Register Events
		//wire up for After a row has been added
		_gRptSect_From.OnAddRow(function() {
			console.log('fired - onAddRow ');
			//fire onchange event get Accounts when an Index is changed
			$('[rel="from.select.index"]').on('change',function(e) {
				SetFormStatus('dirty');
				console.log('fired to selected index' + e.currentTarget.value);
				
				var controlId = '#'+e.currentTarget.id.replace(/Index/,'Account')
				GetAccounts(controlId,e.currentTarget.value);
			});

			//when an account is selected change the balance
			$('[rel="from.select.account"]').on('change',function(e) {
				SetFormStatus('dirty');
				console.log('fired to selected index' + e.currentTarget.value); 	//fromTABalance_FXXXXX
				
				var id = e.currentTarget.id.split("_");
				var controlId = '#fromTABalance_FXXXXX'.replace(/FXXXXX/,id[1]);
				GetAccountBalance(controlId,e.currentTarget.value);
			});
			//only allow numeric and arrow keys
			$('[rel="from.select.amounttotransfer"]').on('keydown',function(e){
				BTRUtils.KeyEvent_NumericOnly(e);
			});
        	

			//when the amount to transfer is changed update the rolling total
			$('[rel="from.select.amounttotransfer"]').on('change',function(e) {
				SetFormStatus('dirty');
				$('#totalFromValue').text('$'+Formula_CalcTotals('[rel="from.select.amounttotransfer"]'));
			});
		});
		
		
		//Event wire up for the To Side
		_gRptSect_To.OnAddRow(function () {
	
			$('[rel="to.select.index"]').on('change',function(e) {
				SetFormStatus('dirty');
				console.log('fired to selected index' + e.currentTarget.value);
				var controlId = '#'+ e.currentTarget.id.replace(/Index/,'Account')
				GetAccounts(controlId,e.currentTarget.value);
			});
			//only allow numeric and arrow keys
			$('[rel="to.select.amounttorecieve"]').on('keydown',function(e){ 
				BTRUtils.KeyEvent_NumericOnly(e);
			});

			$('[rel="to.select.amounttorecieve"]').on('change',function(e) {
				SetFormStatus('dirty');
				$('#totalToValue').text('$'+Formula_CalcTotals('[rel="to.select.amounttorecieve"]'));
			});
		});
	
	}
	
	function LoadUserInfromation(callback) {
		$("#userField").html(_gUser_LoginName);
		// TO DO:
		// Uncomment lines 867-874
		// BTR.User.Initialize(_gUser_User_uni_code, 
		// 	function() {
				
		// 		callback();
		// 	},
		// 	function() {
		// 	}
		// );
		callback();
	}

	//NewFunction
function addRowToTable(tableIdentifier,makeRow,rowIndex)
{
    var rowHTML = makeRow({rowNumber:rowIndex});
    $(tableIdentifier).append(rowHTML);
	
	debugger;
    
	$(tableIdentifier + ' [rel="from.select.index"]').on('change',function(e) {
		debugger;
		SetFormStatus('dirty');
		console.log('fired to selected index' + e.currentTarget.value);
		
		var controlId = '#'+e.currentTarget.id.replace(/Index/,'Account')
		GetAccounts(controlId,e.currentTarget.value);
	});
	
	//$(tableIdentifier)
}
	

//Global Variables

	//Constants
	var _gConst_Form_ModeNew= 1;
	var _gConst_Form_ModeEdit = 2;	
	var _gForm_Saved = 0;
	var _gConstForm_transfer_type_IntraDept = 'intradepartmental';
	var _gConstForm_transfer_type_InterDept = 'interdepartmental';
	var _gConstBTRServiceUrl = 'https://btrservices.azurewebsites.net';
	var _gConstTransferActivityServiceUrl = 'https://btrservices.azurewebsites.net';
	
	//User Attributes
	// TO DO:
	// Remove hard coding
	// var _gUser_LoginName = _spPageContextInfo.userLoginName;
	var _gUser_LoginName = 'kcooper';
	var _gUser_User_uni_code = BTRUtils.GetUniValue(_gUser_LoginName); 
	var _gUser_UserDept = null; //TODO: Fix this 

	//Form Variables
	var _gForm_Saved_BTR = 0;
	var _gForm_Saved_TransferActivities = 0;
	var _gForm_ID = BTRUtils.GetParamByName("rID");
	var _gForm_transfer_type = BTRUtils.GetParamByName("transfer_type");
	if (_gForm_transfer_type == null)
	{
		_gForm_transfer_type = BTRUtils.GetParamByName("transfertype");
	}
	
	var _gForm_Mode = ((_gForm_ID == null) ? 1 : 2); // Form Mode 1= New, 2=Edit
	var _gForm_IsDirty = false;
	var _gForm_Referrer = document.referrer;

	//Variables
	var _gData_IndexDenorm;
	var _gData_IndexTo;
	var _gBtrObj = {btr_key:0, title: '', budget_type: '', approved_date:'', approval_status: '', Requester: '', Author: '', Attachments: '', Created: '', Editor: '', Guid: '', internal_state: '', life_cycle:'', transfer_type:''};
	var _gRptSect_From;
	var _gRptSect_To;

	//---------- New Code --------------------------
  var _gFromRowIndex = 0;
  var _gToRowIndex = 0;
  var _gFromTableTemplate = null;
  var _gToTableTemplate = null;
  var _gFromMakeRow = null;
  var _gToMakeRow = null;
	
	
	if (_gForm_transfer_type != null)
	{
		_gForm_transfer_type = _gForm_transfer_type.toLowerCase();
	}

	$(document).ready(function() {
		  // inserting rows

		  $("#originating").click(function() {
			  addRowToTable('.originating-table',_gFromMakeRow,++_gFromRowIndex);
			  
		  });

		  $("#receiving").click(function() {
			  addRowToTable('.receiving-table',_gToMakeRow,++_gToRowIndex);
		  });
		
		// waitingDialog.show();
		
		BTR.BudgetTransfer.SiteUrl(_gConstBTRServiceUrl);
		BTR.TransferActivity.SiteUrl(_gConstBTRServiceUrl);
		BTR.User.SiteUrl(_gConstBTRServiceUrl); //
		BTR.Index.SiteUrl(_gConstBTRServiceUrl); 
		BTR.Account.SiteUrl(_gConstBTRServiceUrl);
		//------------------------------- HARD Coding to make it easier to transition code REMOVE LATER!!!!! ------------------------------
		BTR.User.dept_key = 1; 
		BTR.User.uni_key = 36;
		
		LoadUserInfromation(function() {
			//LoadDataGrid();
			LoadForm();
		});
		
	});
	var waitingDialog = waitingDialog || (function ($) {
	// Creating modal dialog's DOM
	var $dialog = $(
		'<div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;">' +
		'<div class="modal-dialog modal-m">' +
		'<div class="modal-content">' +
			'<div class="modal-header"><h3 style="margin:0;"></h3></div>' +
			'<div class="modal-body">' +
				'<div class="progress progress-striped active" style="margin-bottom:0;"><div class="progress-bar" style="width: 100%"></div></div>' +
			'</div>' +
		'</div></div></div>');

	return {
		show: function (message, options) {
			// Assigning defaults
			if (typeof options === 'undefined') {
				options = {};
			}
			if (typeof message === 'undefined') {
				message = 'Loading';
			}
			var settings = $.extend({
				dialogSize: 'm',
				progressType: '',
				onHide: null // This callback runs after the dialog was hidden
			}, options);

			// Configuring dialog
			$dialog.find('.modal-dialog').attr('class', 'modal-dialog').addClass('modal-' + settings.dialogSize);
			$dialog.find('.progress-bar').attr('class', 'progress-bar');
			if (settings.progressType) {
				$dialog.find('.progress-bar').addClass('progress-bar-' + settings.progressType);
			}
			$dialog.find('h3').text(message);
			// Adding callbacks
			if (typeof settings.onHide === 'function') {
				$dialog.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
					settings.onHide.call($dialog);
				});
			}
			// Opening dialog
			$dialog.modal();
		},
		/**
		 * Closes dialog
		 */
		hide: function () {
			$dialog.modal('hide');
		}
	};

})(jQuery);