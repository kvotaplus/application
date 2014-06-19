function ServerProxy() {    
    this.apiURI = "http://api.kvotaplus.com/api";
    //this.apiURI = "http://localhost:11960/api";
};

ServerProxy.prototype.sayHelloToServer = function(deviceUID, resultCallback, errorCallback){        
    this.callApiGet("/user/LogUser/?deviceUUID=" + deviceUID, resultCallback, errorCallback);   
};

ServerProxy.prototype.getOddTypes = function(resultCallback, errorCallback){        
    this.callApiGet("/odd/getoddtypes", resultCallback, errorCallback);   
};

ServerProxy.prototype.closeSlip = function(slipRegRequest, resultCallback, errorCallback){
    this.callApiPost("/slip/PostSlipCreate", slipRegRequest, resultCallback, errorCallback);
};

ServerProxy.prototype.getLeaguesWithCount = function(resultCallback, errorCallback){        
    this.callApiGet("/League/GetLeaguesInNextWeekWithCount", resultCallback, errorCallback);   
};

ServerProxy.prototype.search = function(searchTerm, resultCallback, errorCallback){
    this.callApiGet("/schedule/search/?teamName=" + searchTerm, resultCallback, errorCallback);
};

ServerProxy.prototype.getLeagueSchedule = function(leagueID, resultCallback, errorCallback){      
    this.callApiGet("/schedule/GetLeagueSchedule/" + leagueID, resultCallback, errorCallback);
};

ServerProxy.prototype.getDayPreview = function(timeFromIso, timeToIso, resultCallback, errorCallback){    
	this.callApiGet("/schedule/scheduleSummary/?timeFromIso="+encodeURIComponent(timeFromIso)+"&timeToIso="+encodeURIComponent(timeToIso), resultCallback, errorCallback);    
};

ServerProxy.prototype.getAllSlips = function(deviceUID, resultCallback, errorCallback){      
    this.callApiGet("/slip/getAllSlips/?userID=" + deviceUID, resultCallback, errorCallback);
};

ServerProxy.prototype.getSlip = function(slipID, resultCallback, errorCallback){      
    this.callApiGet("/slip/getSlip/?slipID=" + slipID, resultCallback, errorCallback);
};

ServerProxy.prototype.sendFeedback = function(feedback, resultCallback, errorCallback){
    this.callApiPost("/feedback/post", feedback, resultCallback, errorCallback);
}

ServerProxy.prototype.registerForPush = function(deviceID, pushKey, resultCallback, errorCallback){
    this.callApiGet("/user/RegisterForPush/?deviceUUID=" + deviceID + "&pushKey=" + pushKey, resultCallback, errorCallback);
}

// Low level functions
ServerProxy.prototype.callApiGet = function(action, resultCallback, errorCallback){
    var actionResult = null;
    var fullURI = this.apiURI + action;
    console.log("GET API: " + fullURI);
    
    var request = new XMLHttpRequest();    
    request.open("GET", fullURI, true);
    request.onreadystatechange = function() {//Call a function when the state changes.
        if (request.readyState == 4) {            
            if (request.status == 200 || request.status == 0) {                
                console.log("Response: " + request.responseText);
                actionResult = JSON.parse(request.responseText);         
                if (resultCallback != null)
                    resultCallback(actionResult);
            }
            else
            {
                if (errorCallback != null)
                    errorCallback(request.status);
            }
            $.mobile.hidePageLoadingMsg();
        }
    }
    
    $.mobile.showPageLoadingMsg();
    request.send();
};

ServerProxy.prototype.callApiPost = function(action, postData, resultCallback, errorCallback){
    var actionResult = null;
    var fullURI = this.apiURI + action;
    console.log("POST API: " + fullURI);
    
    
    var request = new XMLHttpRequest();
    request.open("POST", fullURI, true);
    request.setRequestHeader("Content-type", "application/json");
    request.onreadystatechange = function() {//Call a function when the state changes.
        if (request.readyState == 4) {            
            if (request.status == 200 || request.status == 0) {                
                if (request.responseText)
                    actionResult = JSON.parse(request.responseText);                
                
                if (resultCallback != null)
                    resultCallback(actionResult);
            }
            else
            {
                if (errorCallback != null)
                    errorCallback(request.status);
            }
            $.mobile.hidePageLoadingMsg();
        }
    }
    
    $.mobile.showPageLoadingMsg();
    request.send(JSON.stringify(postData));
}