var global_error_background = '#ffaaee';

	

	
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
				alert("Error(GetAllAccountsAndBalances): "+ data.Message);
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
				  alert("Error(GetAccounts): "+ data.Message);
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
				alert("Error(GetAccountBalance): "+ data.Message);
		 	}
		);
	}


	function GetIndicesOwned(cb)
	{
		var dept_key = null;
		
		if (_gForm_transfer_type == _gConstForm_transfer_type_IntraDept) {
			dept_key = BTR.User.dept_key;
		}
			
		BTR.Index.GetIndicesOwnedByDept(_gUser_User_uni_code,dept_key,
			function (data) {
				cb(data);
			},
			function (data) {
			  alert("Error (GetIndicesOwned): "+ data.Message);
			}
		);
	}

	function GetIndicesAll(cb)
	{
		var dept_key = null;

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

	
	function PopulateElement (GetDataFn, PopulateFn) {
		GetDataFn(PopulateFn); 
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


	function BuildForm_Populate_Indices(callback) {
		//Get the full index list
		PopulateElement(GetIndicesAll,function(data2) {
			var _select = new Array();
			$.each(data2, function(index,obj) {
			    _select.push('<option value="'+obj.index_key+'">'+obj.index_number_description+'</option>');
			});
		
			$('#toTAIndex_F1').append(_select.join())
			callback();
		});
	}

	function LoadForm() {

		BuildForm_Populate_Indices(function () {
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
	

//Global Variables

	//Constants
	var _gConstBTRServiceUrl = 'https://btrservices.azurewebsites.net';
	var _gConstTransferActivityServiceUrl = 'https://btrservices.azurewebsites.net';
	
	//User Attributes
	// TO DO: Remove hard coding
	// var _gUser_LoginName = _spPageContextInfo.userLoginName;
	var _gUser_LoginName = 'kcooper';
	var _gUser_User_uni_code = BTRUtils.ParseUniValue(_gUser_LoginName); 
	var _gUser_UserDept = null; //TODO: Fix this 

	//Form Variables
	var _gForm_ID = BTRUtils.GetParamByName("rID");
	
	var _gForm_Mode = ((_gForm_ID == null) ? 1 : 2); // Form Mode 1= New, 2=Edit
	var _gForm_IsDirty = false;
	var _gForm_Referrer = document.referrer;


	//---------- New Code (might need this later) --------------------------
  var _gFromRowIndex = 0;
  var _gToRowIndex = 0;
  var _gFromTableTemplate = null;
  var _gToTableTemplate = null;
  var _gFromMakeRow = null;
  var _gToMakeRow = null;
	
	$(document).ready(function() {
		  // inserting rows

		/* Might need this later
		$('[rel="from.select.index"]').on('change',function(e) {
			SetFormStatus('dirty');
			console.log('fired to selected index' + e.currentTarget.value);
			
			var controlId = '#'+e.currentTarget.id.replace(/Index/,'Account')
			GetAccounts(controlId,e.currentTarget.value);
		});
		*/
		  
		BTR.User.SiteUrl(_gConstBTRServiceUrl); 
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