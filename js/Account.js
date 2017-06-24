//		https://btrservices.azurewebsites.net/api/Indices/IndicesByOwner?uni=kcooper
	var BTR = BTR || {};
	BTR.Account = {};
	BTR.Account.WebApiUrlAccounts = "Accounts";
	BTR.Account.WebApiUrlAccountsByIndexKey = "AccountsByIndexKey";
	BTR.Account.WebApiUrlAccountBalance = "AccountBalance";	
	BTR.Account.WebApiUrlAccountBalances = "AccountBalances";	

	BTR.Account.SiteUrl = function(siteUrl) {
		this._siteUrl = "https://btrservices.azurewebsites.net/api/Accounts/";
	};

//--------------------------------------------------------- Read  Item  ---------------------------------------------------------
//@Function GetIndicesOwnedByDept 
//@Description: Get all the indices 
	BTR.Account.GetAccounts= function(scb,fcb) {
		var dataError = {};
	  	dataError.StatusText = '';
	  	dataError.HttpStatus = '000';
	  	dataError.Url = '';
		
		BTR.Account.Items(BTR.Account.WebApiUrlIndices,null,scb,fcb);
	}


//@Function GetIndicesOwnedByDept 
//@Description: Get all the indices owned by the user and filtered by department, if dept_key is not supplied then results will not be filtered by department
//@Parameters: uni = Required, dept_key = optional
	BTR.Account.GetAccountsByIndexKey = function(index_key,scb,fcb) {
		var dataError = {};
	  	dataError.StatusText = '';
	  	dataError.HttpStatus = '000';
	  	dataError.Url = '';
		
		if ((index_key== null) || (index_key.length == 0)) {
			var dataError = {};
		  	dataError.StatusText = "Index key can not be blank";
		  	dataError.Message = dataError.StatusText;
			fcb(dataError);
		}
		
		var filter = 'index_key='+index_key;
		BTR.Account.Items(BTR.Account.WebApiUrlAccountsByIndexKey,filter,scb,fcb);
	}

//@Function GetAccountsByIndexKeys 
//@Description: Get all the indices filtered by department
	BTR.Account.GetAccountsByIndexKeys = function(dept_keys,scb,fcb) {
		
		var dataError = {};
	  	dataError.StatusText = '';
	  	dataError.HttpStatus = '000';
	  	dataError.Url = '';
		
		if ((index_key== null) || (index_key.length == 0)) {
			var dataError = {};
		  	dataError.StatusText = "Index key can not be blank";
		  	dataError.Message = dataError.StatusText;
			fcb(dataError);
		}
		
		var filter = 'index_key='+index_key;
		BTR.Account.Items(BTR.Account.WebApiUrlAccountsByIndexKey,filter,scb,fcb);
	}

//@Function GetAccountBalance 
//@Description: Get all the indices filtered by department
	BTR.Account.GetAccountBalance = function(account_key,scb,fcb) {
		
		var dataError = {};
	  	dataError.StatusText = '';
	  	dataError.HttpStatus = '000';
	  	dataError.Url = '';
		
		if ((account_key== null) || (account_key.length == 0)) {
			var dataError = {};
		  	dataError.StatusText = "Index key can not be blank";
		  	dataError.Message = dataError.StatusText;
			fcb(dataError);
		}
		
		var filter = 'account_key='+account_key;
		BTR.Account.Items(BTR.Account.WebApiUrlAccountBalance,filter,scb,fcb);
	}

//@Function GetAccountBalances
//@Description: Get all accounts based on a set of index_keys
	BTR.Account.GetAccountBalances = function(index_keys,scb,fcb) {
		
		var dataError = {};
	  	dataError.StatusText = '';
	  	dataError.HttpStatus = '000';
	  	dataError.Url = '';
		
		if ((index_keys== null) || (index_keys.length == 0)) {
			var dataError = {};
		  	dataError.StatusText = "Index key can not be blank";
		  	dataError.Message = dataError.StatusText;
			fcb(dataError);
		}
		
		var filter = 'index_keys='+index_keys;
		BTR.Account.Items(BTR.Account.WebApiUrlAccountBalances,filter,scb,fcb);
	}

//@Function Items 
//@Description: Function used to call the web api to retieve the data
	BTR.Account.Items = function(indexUrl,filter,scb,fcb) {
	
		if ((typeof this._siteUrl) == 'undefined') {
			var dataError = {};
		  	dataError.StatusText = "Web API site URL is has not been initialized";
		  	dataError.HttpStatus = "000";
		  	dataError.Url = '';
		  	dataError.Message = dataError.StatusText;
			fcb(dataError);
			return;
		}
		
		var queryString = "";
		if ((filter !=null) && (filter.length > 0))
		{
			queryString = "?" + filter;
		}
		
		var executeUrl = this._siteUrl + indexUrl + queryString;
		$.ajax({
				url: executeUrl,
				method: "GET",
				headers: { "Accept": "application/json; odata=verbose" },
				success: function (data) {

					if(data.constructor === Array)
					{
						scb(data.slice(0));
					}
					else
					{
						scb(data);
					}
				  },
				  error: function (data) {
				  	var dataError = {};
				  	dataError.StatusText = data.statusText;
				  	dataError.HttpStatus = data.status;
				  	dataError.Url = executeUrl;
				  	dataError.Message = "("+data.status+") - URL(" + executeUrl + ") - "+data.statusText;
					fcb(dataError);
				 }
		});
	};