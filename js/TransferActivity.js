var BTR = BTR || {};
BTR.TransferActivity = {};


	BTR.TransferActivity.ListBaseApiUrl = "/api/transferactivity/";
	
	
	BTR.TransferActivity.SiteUrl = function(siteUrl) {
		this._siteUrl = siteUrl;
	};

	BTR.TransferActivity.HttpHeaders = {
		Build : function(xMethod,xRequestDigest,eTag)
		{
			var baseHeaders = {"Accept": "application/json; odata=verbose",
		                       "content-type": "application/json;odata=verbose"
		                       };
	
		    if (typeof xMethod != 'undefined')
		    {
		    	baseHeaders["X-HTTP-Method"] = xMethod;
		    }
		    if (typeof xRequestDigest != 'undefined')
		    {
		    	baseHeaders["X-RequestDigest"] = xRequestDigest;
		    }
	
		    if (typeof eTag != 'undefined')
		    {
		    	baseHeaders["IF-MATCH"] = eTag;
		    }
			return baseHeaders;
		}
	}

	BTR.TransferActivity.RequestDigest = function(requestDigest) {
		this._requestDigest = requestDigest;
	};

	BTR.TransferActivity.DataItem = {
		dataTypeName : "SP.Data.TransferActivitiesListItem",
		Create: function() {
			var jsonData = {'__metadata': {}};		
			jsonData.__metadata['type'] = this.dataTypeName;
			return jsonData;
		}
	};
	
	BTR.TransferActivity.FullApiUri = function (uriAction) {
	    if ((typeof this._siteUrl) === 'undefined') {
	        throw "Site Url is not defined for Budget Transfer class";
	    }
	    if (typeof uriAction != 'undefined') {
	        return this._siteUrl + this.ListBaseApiUrl + uriAction;
	    }
	    throw "Malformed site Url for BTR controller, no action defined.";
	}
	

	
	BTR.TransferActivity.GetItems = function(controllerActionName,filter,successCB,failedCB)
	{
		var queryString = "";
		if (filter != null)
		{
			queryString = "?" + filter
		}
		var ajaxUrl = this.FullApiUri(controllerActionName) + queryString;
		$.ajax({
				url:  ajaxUrl,
				method: "GET",
				headers: { "Accept": "application/json; odata=verbose" },
				success: function (data) {
	            	if (Array.isArray(data))
	            	{
	                	successCB(data.slice(0));
	                	return; //stop the execution from falling through
	                }
	                successCB(data);
				},
				error: function (data) {
				    console.log(err);
				    var errObj = this.CreateErrMsg(null, 'TransferActivity.'+controllerName+' - ' + err);
				    failedCB(errObj);
				}
		});
	}

	BTR.TransferActivity.Item = function (item_key, scb, fcb) {
		this.GetItems('item', 'transfer_activity_key=' +item_key, scb, fcb);
	};

	BTR.TransferActivity.GetBTRAssociatedTransferActivities = function(btrId,successCB,failedCB)
	{
		var filter = "btr_key="+btrId;
		this.GetItems('ItemsByBtrId',filter,successCB,failedCB);
	};

	BTR.TransferActivity.Create = function(jsonData,successCB,errorCB)
	{
		//debugger;
        var ajaxUrl = this.FullApiUri('create');
		console.log('Create - JSon data:'+JSON.stringify(jsonData));
		$.ajax({
				url:  ajaxUrl,
				method: "POST",
				headers: this.HttpHeaders.Build(null,$("#__REQUESTDIGEST").val()),
				data:  JSON.stringify(jsonData),
				success: function (data) {
					successCB(data.d);
				  },
				error: function (data) {
					console.log(JSON.stringify(data));
					errorCB(data);
				 }
		});
	
	};
	
	BTR.TransferActivity.Update = function(listItemId,jsonData,eTag,successCB,errorCB)
	{
		eTag = "*"; //quick fix for now
		        var ajaxUrl = this.FullApiUri('update');
		
		$.ajax({
				url:  ajaxUrl,
				method: "POST",
				headers: this.HttpHeaders.Build(null,$("#__REQUESTDIGEST").val()),
				data:  JSON.stringify(jsonData),
				success: function () {
					console.log('TransferActivity.Update.Success - '+listItemId);
					successCB(jsonData);
				  },
				error: function (data) {
					console.log(JSON.stringify(data));
				 }
		});
	};

	BTR.TransferActivity.Delete = function(listItemId,eTag,successCB,errorCB)
	{
		eTag = "*"; //quick fix for now

        var ajaxUrl = this.FullApiUri('create');		

		$.ajax({
				url:  ajaxUrl,
				method: "POST",
				headers: this.HttpHeaders.Build(null,$("#__REQUESTDIGEST").val()),
				success: function () {
					successCB(jsonData);
			    },
				error: function (data) {
					console.log(JSON.stringify(data));
				}
		});
	};

	BTR.TransferActivity.BatchSave = function(jsonData,successCB,errorCB)
	{
		debugger;
        var ajaxUrl = this.FullApiUri('batchsave');
		console.log('BatchSave - JSon data:'+JSON.stringify(jsonData));
		$.ajax({
				url:  ajaxUrl,
				method: "POST",
				headers: this.HttpHeaders.Build(null,''),
				data:  JSON.stringify(jsonData),
				success: function (data) {
					successCB(data.d);
				  },
				error: function (data) {
					console.log(JSON.stringify(data));
					errorCB(data);
				 }
		});
	
	}

	BTR.TransferActivity.UpdateStatus = function(item_key,eTag,action)
	{
		eTag = "*"; //quick fix for now
		var vActionValue = (action==1) ? "Approved":"Rejected";
        var ajaxUrl = this.FullApiUri('udpatestatus');
		var jsonData = {'__metadata': {}};		

		jsonData['transfer_activity_key'] = item_key;	
		jsonData['approval_status'] = vActionValue;	

		$.ajax({
				url:  ajaxUrl,
				method: "POST",
				headers: this.HttpHeaders.Build(null,$("#__REQUESTDIGEST").val()),
				data:  JSON.stringify(jsonData),
				success: function (data) {
					
				  },
				error: function (data) {
					console.log(JSON.stringify(data));
				 }
		});
	}	