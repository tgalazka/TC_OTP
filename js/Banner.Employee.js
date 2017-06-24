var Banner = Banner || {};
Banner.Employee = {};
Banner.Employee.WebApiUrlEmployeeByUni = "item";
Banner.Employee.ListBaseApiUrl = "/api/employee/";
	
	
	Banner.Employee.Authorization = function(key) {
		this._headerAuthorization = siteUrl;
	}

	Banner.Employee.SiteUrl = function(hostDomain) {
		this._siteUrl = hostDomain + Banner.Employee.ListBaseApiUrl;
	}
	
	Banner.Employee.HttpHeaders = {
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
			
			if ((typeof this._headerAuthorization) != 'undefined') {
				baseHeaders["authorization"] = this._headerAuthorization;
			}

			return baseHeaders;
		}
	}



//--------------------------------------------------------- Read  Item  ---------------------------------------------------------
//@Function Get Employee by Uni from Banner 
//@Description: Get all the indices 
	Banner.Employee.All= function(scb,fcb) {
		var dataError = {};
	  	dataError.StatusText = '';
	  	dataError.HttpStatus = '000';
	  	dataError.Url = '';
		
		Banner.Employee.Items(Banner.Employee.WebApiUrlIndices,null,scb,fcb);
	}


//@Function ByUni 
//@Description: Get employee by uni
//@Parameters: uni = Required, dept_key = optional
	Banner.Employee.ByUni = function(uni,scb,fcb) {
		var dataError = {};
	  	dataError.StatusText = '';
	  	dataError.HttpStatus = '000';
	  	dataError.Url = '';
		
		if ((uni== null) || (uni.length == 0)) {
			var dataError = {};
		  	dataError.StatusText = "Uni can not be blank";
		  	dataError.Message = dataError.StatusText;
			fcb(dataError);
		}
		
		var filter = 'uni='+uni;
		Banner.Employee.Items(Banner.Employee.WebApiUrlEmployeeByUni,filter,scb,fcb);
	}



//@Function Items 
//@Description: Function used to call the web api to retieve the data
	Banner.Employee.Items = function(indexUrl,filter,scb,fcb) {
	
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
				headers: this.HttpHeaders.Build(),
				success: function (data) {
					if (data == null) return data;
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