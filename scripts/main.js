//---------- IDEMO ----------

var leagueListViewModel;
var matchListViewModel;
var matchViewModel;
var allSlipsViewModel;
var systemViewModel;
var searchViewModel;
var dayPreviewViewModel;
var slipViewModel;
var feedbackViewModel;

var _serverProxy;
var _memoryCache;

var p_key_uuid = "tiket_plus_uuid";
var p_key_open_slip = "tiket_plus_open_slip";
var deviceID = null;

var __testing = true;

function getOddTypes() {
    _serverProxy.getOddTypes(function(result){        
            var htmlOddTypeSelection = $("#oddTypeSelectionContent");
            htmlOddTypeSelection.empty();
            
            var htmlOddTypeSelectionRow;
            var oddTypeObject;
            var prevType;
            var counter = 0;
        
            for (var i = 0; i < result.length; i++) {                    
                oddTypeObject = result[i];
                
                if (!prevType || prevType != oddTypeObject.Type){
                    if (counter > 0){
                        htmlOddTypeSelection.append(htmlOddTypeSelectionRow);
                        counter = 0;
                        htmlOddTypeSelectionRow = null;
                    }
                    
                    $("<div>").attr({"class" : "matchView-oddType-heading"}).html(oddTypeObject.Type).appendTo(htmlOddTypeSelection);
                    prevType = oddTypeObject.Type;
                }
                
                if (!htmlOddTypeSelectionRow)
                    htmlOddTypeSelectionRow = $("<fieldset>").attr({"data-role" : "controlgroup", "data-type" : "horizontal", "class" : "oddtype-fieldset"});
                                        
                var chkboxID = "checkbox-"+oddTypeObject.ID;
                var onClickFunction = "oddTypeSelected('" + chkboxID + "'," + +oddTypeObject.ID + ",'" + oddTypeObject.Name + "')";
                var htmlOddType = $("<label>").html(oddTypeObject.Name).append("<input type='checkbox' id='" +chkboxID +"' onclick=\"" + onClickFunction +"\">");
                htmlOddTypeSelectionRow.append(htmlOddType);
                                
                counter = counter +1;
                
                //if third in the row, insert row
                if (counter == 3){
                    htmlOddTypeSelection.append(htmlOddTypeSelectionRow);
                    counter = 0;
                    htmlOddTypeSelectionRow = null;
                }
            }
            //add remaining odd types
            if (counter > 0)
                htmlOddTypeSelection.append(htmlOddTypeSelectionRow);
        
            htmlOddTypeSelection.trigger("create");
        }, function(status){
            //TODO: handle excpetion
        }
    );
}

function oddTypeSelected(chkboxID, oddTypeID, oddTypeName){    
    if ($("#"+chkboxID).is(':checked')){        
        addSlipItem(matchViewModel.matchID, matchViewModel.homeTeamName(), matchViewModel.awayTeamName(), oddTypeID, oddTypeName);
        $.mobile.changePage("#pageDayPreview");
        //$.mobile.pageContainer.pagecontainer("change", "#pageDayPreview"); -- to be used with JQM 1.4
    } 
    else {        
        deleteSlipItem(matchViewModel.matchID, oddTypeID);
    }
}

function loadStaticData() {    
    getOddTypes();    
}

function init() {
    if (window.localStorage.getItem(p_key_uuid) === null){
        console.log("No user ID => generate a new one");
        window.localStorage.setItem(p_key_uuid, device.uuid);
    }
    deviceID = window.localStorage.getItem(p_key_uuid);
    
    //TODO: handle excpetion
    _serverProxy.sayHelloToServer(deviceID);
}


$(document).ready(function () {
    FastClick.attach(document.body);    
});

function onDeviceReady() {
    console.log("Device Ready");    
    _serverProxy = new ServerProxy();
    _memoryCache = new MemoryCache();
    
    leagueListViewModel = new LeagueListViewModel(_serverProxy);    
    matchListViewModel = new MatchListViewModel(_serverProxy);
    matchViewModel = new MatchViewModel(_memoryCache);
    allSlipsViewModel = new AllSlipsViewModel(_serverProxy, _memoryCache);
    systemViewModel = new SystemViewModel();
    searchViewModel = new SearchViewModel(_serverProxy, _memoryCache);
    slipViewModel = new SlipViewModel(_serverProxy, _memoryCache);
    dayPreviewViewModel = new DayPreviewViewModel(_serverProxy, _memoryCache);
    feedbackViewModel = new FeedbackViewModel(_serverProxy);   
    
    
    ko.applyBindings(dayPreviewViewModel, document.getElementById("pageDayPreview"));    
    ko.applyBindings(matchListViewModel, document.getElementById("matchListView"));
    ko.applyBindings(matchViewModel, document.getElementById("pageMatchView"));
    ko.applyBindings(allSlipsViewModel, document.getElementById("pageAllSlipsView"));
    ko.applyBindings(systemViewModel, document.getElementById("pageSlipSystem"));
    ko.applyBindings(searchViewModel, document.getElementById("searchView"));
    ko.applyBindings(slipViewModel, document.getElementById("pageSlipView"));
    ko.applyBindings(feedbackViewModel, document.getElementById("pageFeedbackView"));
    
    
    init();
    //dayPreviewViewModel.initDatePicker();
    loadStaticData();
    
    window.plugins.pushNotification.register( 
        function(id) {
            // successful registration
        }, 
        function(error) {
            // problm in registration
            //console.log("###Error " + error.toString());                
        }, 
        {
            "senderID": "346674270125", //KvotaPlus project number
            "ecb": "onNotificationGCM"
        }
    );    
}

function onNotificationGCM(e) {
    switch (e.event) {
        case 'registered':
            if (e.regid.length > 0) {
				_serverProxy.registerForPush(window.localStorage.getItem(p_key_uuid), e.regid);
            }
            break;
        case 'message':
            slipViewModel.forceCacheUpdate = true;
        	if (e.foreground)
            {
                alert("FOREGROUND: " + e.payload.slipID);
            }
            else
            {  
				//alert("Background: " + e.payload.slipID);                
                $.mobile.changePage( "#pageSlipView?id=" + e.payload.slipID);
            }	
            break;
        case 'error':
            alert('Error Occured: ' + e.msg);
            break;
        default:
            alert('An unknown GCM event has occurred.');
            break;
    }
}


function openNewSlip(){
    var slip = new Object();
    slip.id = guid();
    slip.datetime = Date();
    slip.slipItems = [];
    
    window.localStorage.setItem(p_key_open_slip, JSON.stringify(slip));
    return slip;
}

function getOpenSlip() {
    var slip = JSON.parse(window.localStorage.getItem(p_key_open_slip));    
    //TODO: check is not null
    return slip;
}

function closeOpenSlip(succCallback, errorCallback) {
    var slip = JSON.parse(window.localStorage.getItem(p_key_open_slip));
    
    var slipRegRequest = new Object();
    slipRegRequest.UserID = window.localStorage.getItem(p_key_uuid);
    slipRegRequest.VirtualOdds = [];
    slipRegRequest.Odds = [];    

    for(var i=0;i< slip.slipItems.length; i++){        
        var virtualOdd = new Object();
        virtualOdd.OddTypeID = slip.slipItems[i].oddTypeID;
        virtualOdd.MatchID = slip.slipItems[i].matchID;
        slipRegRequest.VirtualOdds.push(virtualOdd);           
    }
    
    _serverProxy.closeSlip(slipRegRequest, function(result) {
            window.localStorage.removeItem(p_key_open_slip);
            if (succCallback != null)
                succCallback();
        },
        function(status){
            console.log("ERROR: " + status);
            if (errorCallback != null)
                errorCallback();
        }
    ); 
}


function addSlipItem(matchID, homeString, awayString, oddTypeID, oddTypeString) {    
    var slip = JSON.parse(window.localStorage.getItem(p_key_open_slip));
    
    //if slip already exists => check for duplicates
    if (slip){
        for(var i=0;i< slip.slipItems.length; i++){                
            if (slip.slipItems[i].matchID == matchID && slip.slipItems[i].oddTypeID == oddTypeID){
                return;
            }   
        }
    }
    //else open new slip
    else{
        slip = openNewSlip();
    }
    
    var slipItem = new Object();    
    slipItem.matchID = matchID;
    slipItem.homeString = homeString;
    slipItem.awayString = awayString;
    slipItem.oddTypeID = oddTypeID;
    slipItem.oddTypeString = oddTypeString;
    
    slip.slipItems.push(slipItem);
    
    console.log(JSON.stringify(slip));
    window.localStorage.setItem(p_key_open_slip, JSON.stringify(slip));
}

function deleteSlipItemEvent(event){
    deleteSlipItem(event.data.matchID, event.data.oddTypeID);
}

function deleteSlipItem(matchID, oddTypeID){    
    var slip = JSON.parse(window.localStorage.getItem(p_key_open_slip));
    if (slip === null)
        return;
    
    for(var i=0;i< slip.slipItems.length; i++){                
        if (slip.slipItems[i].matchID == matchID && slip.slipItems[i].oddTypeID == oddTypeID){
            slip.slipItems.splice(i,1);
            break;
        }   
    }
    
    window.localStorage.setItem(p_key_open_slip, JSON.stringify(slip));
    allSlipsViewModel.fetchOpenSlipData();
}

function createSystem(systemMaxCount, systemSuccCount, systemItemList, succCallback){   
    if (systemItemList && systemItemList.length > 0 && systemMaxCount > 0 && systemSuccCount > 0) {        
        var slip = JSON.parse(window.localStorage.getItem(p_key_open_slip));
        slip.system = new Object();
        slip.system.maxCount = systemMaxCount;
        slip.system.maxSuccCount = systemSuccCount;
        slip.system.slipItems = [];
        
        var sanityCheckCountBefore = slip.slipItems.length; 
        
        for(var i=0; i< systemItemList.length; i++){
            var systemItem = systemItemList[i];
            
            for(var j=0;j< slip.slipItems.length; j++){                
                if (slip.slipItems[j].matchID == systemItem.matchID && slip.slipItems[j].oddTypeID == systemItem.oddTypeID){
                    slip.system.slipItems.push(slip.slipItems[j]);
                    slip.slipItems.splice(j,1);
                    break;
                }   
            }
        }
        
        if (sanityCheckCountBefore === slip.slipItems.length + slip.system.slipItems.length) {
            window.localStorage.setItem(p_key_open_slip, JSON.stringify(slip));
        } else {
        	console.log("-----> PROBLEM WHEN CREATING SYSTEM: before=" + sanityCheckCountBefore + ", but now " + slip.slipItems.length + " and " + slip.system.slipItems.length);
        }
    }
    
    succCallback();
}

function deleteSystem(succCallback){
	var slip = JSON.parse(window.localStorage.getItem(p_key_open_slip));
    if (slip && slip.system) {
	    for(var i=0; i < slip.system.slipItems.length; i++){
            slip.slipItems.push(slip.system.slipItems[i]);                        
        }
        slip.system = null;
        window.localStorage.setItem(p_key_open_slip, JSON.stringify(slip));
    }
    
    succCallback();   
}

$(document).bind("pagebeforechange", function(e, data) {    
    // We only want to handle changePage() calls where the caller is asking us to load a page by URL.
    if (typeof data.toPage === "string") {
        // We are being asked to load a page by URL, but we only want to handle URLs that request the data for a specific category.        
        var url = $.mobile.path.parseUrl(data.toPage);        
        var reOddsPreivew = /^#oddsPreview/;
        var reMatchListView = /^#matchListView/;
        var reMatchView = /^#pageMatchView/;
        var reSlipView = /^#pageSlipView/;
        
        if (url.hash.search(reMatchListView) !== -1){
            var lID = url.hash.replace(/.*leagueID=/, "");
            console.log(url.hash);
            console.log(lID);
            matchListViewModel.leagueID = lID;
            matchListViewModel.fetch();            
        }
        else if (url.hash.search(reMatchView) !== -1){            
            var matchID = getURLParameter(url.href, "matchID");
            matchViewModel.matchID = matchID;
        }
        else if (url.hash.search(reOddsPreivew) !== -1) {
            var leagueID = url.hash.replace(/.*id=/, "");
            oddsPreviewViewModel.leagueID = leagueID;
            oddsPreviewViewModel.fetch();
        }
        else if (url.hash.search(reSlipView) !== -1) {            
            var slipID = url.hash.replace(/.*id=/, "");
            slipViewModel.slipID = slipID;
        }
    }
});

//TODO: check if this works
document.addEventListener("backbutton", function(e){    
    if($.mobile.activePage.is("#pageDayPreview")){
        e.preventDefault();
        navigator.app.exitApp();
    } else {
        navigator.app.backHistory();        
    }
}, false);


function debugDevice(text){
    $("#debugDevice").append(("<p>").html(text));
}

function getURLParameter(uri, name) {
    return decodeURIComponent((RegExp(name + '=' + '(.+?)(&|$)').exec(uri)||[,null])[1]
    );
};

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
};

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}