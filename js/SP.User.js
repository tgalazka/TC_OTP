var BTR = BTR || {};
BTR.User = {};

	BTR.User.ListApiUrl = "/_api/web/lists/getbytitle('users')";
	
	BTR.User.SiteUrl = function(siteUrl) {
		//this._siteUrl = "https://btrservices.azurewebsites.net";
		this._siteUrl = siteUrl;
	};

	BTR.User.user_uni = '';
	BTR.User.user_uni_key = 0;
	BTR.User.user_lastName = '';
	BTR.User.user_firstName = '';
	BTR.User.user_email = '';
	BTR.User.user_dept_key = '';
	
	BTR.User.DataItem = {
	/*	dataTypeName : "SP.Data.TC_x005f_BudgetTransferFormListItem",
		Create: function() {
			var jsonData = {'__metadata': {}};		
			jsonData.__metadata['type'] = this.dataTypeName;
			return jsonData;
		}
	*/
	};
	BTR.User.InfoRecord = function(uniID,scb,fcb) {
		if ((typeof this._siteUrl) == 'undefined') {
			fcb();
			return;
		}
		
		//Read the timestamp for concurrent situations
		var filter = "&$filter=Uni eq '"+uniID + "'";
		$.ajax({
				url: this._siteUrl + this.ListApiUrl + "/items?$select=*"+filter,
				method: "GET",
				headers: { "Accept": "application/json; odata=verbose" },
				success: function (data) {
					if(data.d.results.length != 1)
					{
						fcb();
					}
					scb(data.d.results[0]);
				  },
				  error: function (data) {
					fcb(data);
				 }
		});
	};

	BTR.User.Initialize = function(uniID,scb,fcb) {
		BTR.User.InfoRecord(uniID,
			function(userData) {
				if(userData){
					BTR.User.uni_code = userData.Uni;
					BTR.User.last_name = userData.LastName;
					BTR.User.first_name = userData.FirstName;
					BTR.User.full_name = userData.FullName;
					BTR.User.email = userData.Email;
					BTR.User.dept_key = userData.dept_key;
					BTR.User.uni_key = userData.uni_key;
				}
				scb();
			}
			,fcb
		);
	};
