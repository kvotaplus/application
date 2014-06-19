function SlipViewModel(serverProxy, memCache) {
    var that = this;
    
    this.serverProxy = serverProxy;
    this.memoryCache = memCache;
    
    this.slipID;
    this.forceCacheUpdate = false;
    
    this.slipItemCount = ko.observable(0);
    this.slipItemWaitCount = ko.observable(0);
    this.slipItemSuccessCount = ko.observable(0);
    this.slipItemFailCount = ko.observable(0);
    this.slipSystem = ko.observable("");
    this.timeCreatedString = ko.observable("");
    this.statusString = ko.observable("");
    
    $(document).on("pagebeforeshow", "#pageSlipView", function () { 
        that.clear();
    });
    
    $(document).on("pageshow", "#pageSlipView", function () { 
        that.getSlip();
    });
}

SlipViewModel.prototype.clear = function(){
    this.slipItemCount(0);
    this.slipItemWaitCount(0);
    this.slipItemSuccessCount(0);
    this.slipItemFailCount(0);
    this.slipSystem("-");
    this.timeCreatedString("");
    this.statusString(SlipStatusString(SLIP_STATUS_UNKNOWN));
}

SlipViewModel.prototype.getSlip = function(){
    var slipObject = null;
    var that = this
    
    if (this.forceCacheUpdate) {
        this.serverProxy.getSlip(this.slipID, function(slipModel) {
            console.log("Entering here");            
            that.memoryCache.addSlip(slipModel.ID, slipModel);
            that.forceCacheUpdate = false;
            that.refreshUI(slipModel)
        },function(status){
            //TODO: handle exception
            console.log("holy shit");
        });
    } else {    
        slipObject = this.memoryCache.getSlip(this.slipID);        
        if (slipObject){
			this.refreshUI(slipObject);
        }
        else{
            //TODO: return to previous page
        }    
    }
}

SlipViewModel.prototype.refreshUI = function(slipObject){
    
    function formatScore(score){
        if (score || score == 0)
            return score;
        else
            return "-";
    }
    
    this.statusString(SlipStatusString(slipObject.Status));
    this.timeCreatedString(slipObject.TimeCreatedString);
    
    if (slipObject.Status == SLIP_STATUS_SUCCESS)
        $("#blockStatus").addClass("status-block-grid-success");
    else if (slipObject.Status == SLIP_STATUS_FAIL)
        $("#blockStatus").addClass("status-block-grid-fail");
    else if (slipObject.Status == SLIP_STATUS_WAITING)
        $("#blockStatus").addClass("status-block-grid-waiting");
    
    
    var htmlListSlipItems = $("#listSlipItems");
    htmlListSlipItems.empty();
    for (var i=0; i < slipObject.SlipItems.length; i++){
        var slipItemObject = slipObject.SlipItems[i];
        var htmlSlipItem = $("<li>").attr({"class" : "test"});
        
        var htmlGridItem = $("<div>").attr({"class" : "ui-grid-b slipItem-grid"});
        
        
        $("<div>").attr({"class" : "ui-block-a"}).html(slipItemObject.HomeTeamName).appendTo(htmlGridItem);
        $("<div>").attr({"class" : "ui-block-b"}).html(formatScore(slipItemObject.HomeScore)).appendTo(htmlGridItem);
        $("<div>").attr({"class" : "ui-block-c"}).html("(" + formatScore(slipItemObject.HTHomeScore) + ")").appendTo(htmlGridItem);
        $("<div>").attr({"class" : "ui-block-a"}).html(slipItemObject.AwayTeamName).appendTo(htmlGridItem);
        $("<div>").attr({"class" : "ui-block-b"}).html(formatScore(slipItemObject.AwayScore)).appendTo(htmlGridItem);
        $("<div>").attr({"class" : "ui-block-c"}).html("(" + formatScore(slipItemObject.HTAwayScore) + ")").appendTo(htmlGridItem);
        htmlSlipItem.append(htmlGridItem);
        
        $("<p>").html("Liga: " + slipItemObject.LeagueName).appendTo(htmlSlipItem);
        $("<p>").html("Vreme: " + slipItemObject.MatchTimeString).appendTo(htmlSlipItem);
        $("<p>").html("Odigrana igra: " + slipItemObject.OddTypeKey).appendTo(htmlSlipItem);
        $("<p>").html("Status: " + SlipStatusString(slipItemObject.Status)).appendTo(htmlSlipItem);
        
        
        this.slipItemCount(this.slipItemCount() + 1);
        if (slipItemObject.Status == SLIP_STATUS_SUCCESS){
            htmlSlipItem.addClass("slip-item-li-success");
            this.slipItemSuccessCount(this.slipItemSuccessCount() + 1);
        }
        else if (slipItemObject.Status == SLIP_STATUS_FAIL){
            htmlSlipItem.addClass("slip-item-li-fail");   
            this.slipItemFailCount(this.slipItemFailCount() + 1);
        }
        else if (slipItemObject.Status == SLIP_STATUS_WAITING){
            htmlSlipItem.addClass("slip-item-li-waiting");   
            this.slipItemWaitCount(this.slipItemWaitCount() + 1);
        }
        
        htmlListSlipItems.append(htmlSlipItem);
    }
    htmlListSlipItems.listview("refresh"); 
}