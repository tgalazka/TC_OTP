//		https://btrservices.azurewebsites.net/api/Indices/IndicesByOwner?uni=kcooper
	var BTR = BTR || {};
	BTR.Index = {};
	BTR.Index.WebApiUrlIndices  = "Indices";
	BTR.Index.WebApiUrlIndicesOwnedByDept  = "IndicesByOwner";
	BTR.Index.WebApiUrlIndicesByDept = "IndicesByDept";
	BTR.Index.SiteUrl = function(siteUrl) {
		this._siteUrl = "https://btrservices.azurewebsites.net/api/Indices/";
	};

//--------------------------------------------------------- Read  Item  ---------------------------------------------------------
//@Function GetIndicesOwnedByDept 
//@Description: Get all the indices 
	BTR.Index.GetIndices = function(scb,fcb) {
		var dataError = {};
	  	dataError.StatusText = '';
	  	dataError.HttpStatus = '000';
	  	dataError.Url = '';
		
		
		BTR.Index.Items(BTR.Index.WebApiUrlIndices,null,scb,fcb);
	}


//@Function GetIndicesOwnedByDept 
//@Description: Get all the indices owned by the user and filtered by department, if dept_key is not supplied then results will not be filtered by department
//@Parameters: uni = Required, dept_key = optional
	BTR.Index.GetIndicesOwnedByDept = function(uni,dept_key,scb,fcb) {
		var dataError = {};
	  	dataError.StatusText = '';
	  	dataError.HttpStatus = '000';
	  	dataError.Url = '';
		
		if ((uni == null) || (uni.length == 0)) {
			var dataError = {};
		  	dataError.StatusText = "Department key or Uni ID can not be blank";
		  	dataError.Message = dataError.StatusText;
			fcb(dataError);
		}
		
		var filter = 'uni='+uni;
		if (dept_key != null)
		{
			filter += '&dept_key='+dept_key;
		}
		BTR.Index.Items(BTR.Index.WebApiUrlIndicesOwnedByDept,filter,scb,fcb);
	}

//@Function GetIndicesOwnedByDept 
//@Description: Get all the indices filtered by department
	BTR.Index.GetIndicesByDept = function(dept_key,scb,fcb) {
		
		var filter = '';
		if (dept_key != null) {
			filter = "dept_key="+dept_key;
		}
		BTR.Index.Items(BTR.Index.WebApiUrlIndicesByDept ,filter,scb,fcb);
	}

//@Function Items 
//@Description: Function used to call the web api to retieve the data
	BTR.Index.Items = function(indexUrl ,filter,scb,fcb) {
	
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
				//debugger;
					scb(data.slice(0));
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