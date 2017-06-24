var BTR = BTR || {};
BTR.BudgetTransfer = {};

BTR.BudgetTransfer.ListBaseApiUrl = "/api/BTR/";


BTR.BudgetTransfer.SiteUrl = function(siteUrl) {
	this._siteUrl = siteUrl;
};


BTR.BudgetTransfer.HttpHeaders = {
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

BTR.BudgetTransfer.FullApiUri = function (uriAction) {
    if ((typeof this._siteUrl) === 'undefined') {
        throw "Site Url is not defined for Budget Transfer class";
    }
    if (typeof uriAction != 'undefined') {
        return this._siteUrl + this.ListBaseApiUrl + uriAction;
    }
    throw "Malformed site Url for BTR controller, no action defined.";
}

BTR.BudgetTransfer.DataItem = {
    Create: function () {
        var jsonData = {};
        return jsonData;
    }
};


BTR.BudgetTransfer.CreateErrMsg = function (data, message) {
    var dataError = {};

    dataError.InnerError = '';
    dataError.HttpStatus = '000';
    if (data != null) {
        dataError.InnerError = JSON.stringify(data.responseText);
        dataError.HttpStatus = data.Status;
    }
    dataError.Message = (message != null) ? message : 'Error processing reqest';
    return dataError;
};

//--------------------------------------------------------- Read  Item  ---------------------------------------------------------
BTR.BudgetTransfer.Item = function (listItemId, scb, failedCB) {
    try {
        var ajaxUrl = this.FullApiUri("Item") + '/?btr_key=' +listItemId;
        $.ajax({
            url: ajaxUrl,
            method: "GET",
            headers: this.HttpHeaders.Build(),
            success: function (data) {
            	if (Array.isArray(data))
            	{
                	scb(data.slice(0));
                }
                scb(data);
            },
            error: function (data) {
	            console.log(data);
	            var errObj = BTR.BudgetTransfer.CreateErrMsg(data, 'BudgetTransfer.GetItem - ' );
	            failedCB(errObj);
        	}
    	});
	}
	catch (err) {
	    console.log(err);
	    var errObj = this.CreateErrMsg(null, 'BudgetTransfer.GetItem - ' + err);
	    failedCB(errObj);
	}	
};

BTR.BudgetTransfer.ItemTableRecord = function (userId, scb, failedCB) {

    try {
        //Read the timestamp for concurrent situations
        var ajaxUrl = this.FullApiUri("ItemsByUni") + "?requestor_uni_key=" + userId
        
        $.ajax({
            url: ajaxUrl,
            method: "GET",
            headers: this.HttpHeaders.Build(),
            success: function (data) {
                scb(data.slice(0));
            },
            error: function (data) {
                console.log(data);
                var errObj = BTR.BudgetTransfer.CreateErrMsg(data, 'BudgetTransfer.ItemTableRecord - ' );
                failedCB(errObj);
            }
        });
    }
    catch (err) {
        console.log(err);
        var errObj = this.CreateErrMsg(null, 'BudgetTransfer.ItemTableRecord - ' + err);
        failedCB(errObj);
    }
};
//--------------------------------------------------------- Create ---------------------------------------------------------

BTR.BudgetTransfer.Create = function (jsonData, successCB, failedCB) {

    try {
        var ajaxUrl = this.FullApiUri('create');
        $.ajax({
            url: ajaxUrl,
            method: "POST",
            headers: this.HttpHeaders.Build(null,''),
            data: JSON.stringify(jsonData),
            success: function (data) {
                successCB(data);
            },
            error: function (data) {
            	console.log(data);
            	var errObj = BTR.BudgetTransfer.CreateErrMsg(data, 'BudgetTransfer.GetItem - ' );
                failedCB(errObj);
            }
        });

    }
    catch (err) {
        console.log(err);
        var errObj = this.CreateErrMsg(null, 'BudgetTransfer.XYZ - ' + err);
        failedCB(errObj);
    }
};

//--------------------------------------------------------- Update ---------------------------------------------------------
BTR.BudgetTransfer.Update = function (listItemId, jsonData, eTag, successCB, failedCB) {
    //debugger;

    try {
        eTag = "*"; //quick fix for now
        var ajaxUrl = this.FullApiUri('update');

        console.log('JSon data:' + JSON.stringify(jsonData));
        $.ajax({
            url: ajaxUrl,
            method: "PUT",
            headers: this.HttpHeaders.Build(null,'',eTag),
            data: JSON.stringify(jsonData),
            success: function (data) {
                successCB(data);
            },
            error: function (data) {
                console.log(data);
                var errObj = BTR.BudgetTransfer.CreateErrMsg(data, 'BudgetTransfer.Update - ');
                failedCB(errObj);
            }
        });

    }
    catch (err) {
        console.log(err);
        var errObj = this.CreateErrMsg(null, 'BudgetTransfer.Update - ' + err);
        failedCB(errObj);
    }
}; // end of function


/*
data.responseText
"{"error":{"code":"-1, Microsoft.SharePoint.Client.InvalidClientQueryException","message":{"lang":"en-US","value":"The property 'PriorityFlag ' does not exist on type 'SP.Data.TC_x005f_BudgetTransferFormListItem'. Make sure to only use property names that are defined by the type."}}}"				
*/
