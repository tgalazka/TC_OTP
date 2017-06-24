/* Commonly tasks and utility functions */

var BTRUtils = BTRUtils || {};

BTRUtils.GetDate = function getDate(datestr) {
        return  new Date(eval('new ' + datestr.replace(/\//g, '')));
}
    
BTRUtils.DateFormat = function DateFormat(value) {
		return (new Date(value)).toLocaleDateString('en-US'); 	
}	

BTRUtils.GetParamByName = function getParameterByName(name, url) {
		
	    if (!url) url = window.location.href;
		name = name.toLowerCase();
		url = url.toLowerCase();
	    name = name.replace(/[\[\]]/g, "\\$&");
	    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
	        results = regex.exec(url);
	    if (!results) return null;
	    if (!results[2]) return '';
	    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

BTRUtils.GetUniValue = function getUniValue() 	{
		//_spPageContextInfo.userLoginName.replace("@teacherscollegecolumbia.onmicrosoft.com","")
		// TO DO:
		// remove hard coding
		return 'kcooper';
}
	
BTRUtils.S4 =	function S4() {
	    return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}
 	
BTRUtils.GenerateGuid = function GenGuid()  	{
		return (BTRUtils.S4() + BTRUtils.S4() + "-" + BTRUtils.S4() + "-4" + BTRUtils.S4().substr(0,3) + "-" + BTRUtils.S4() + "-" + BTRUtils.S4() + BTRUtils.S4() + BTRUtils.S4()).toLowerCase();
}

BTRUtils.KeyEvent_NumericOnly =	function KeyEvent_IsNumeric(e) {
		// Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
             // Allow: Ctrl+A, Command+A
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) || 
            	             // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
                 // let it happen, don't do anything
                 return;
		}
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
	}
