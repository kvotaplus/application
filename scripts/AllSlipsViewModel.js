function AllSlipsViewModel(serverProxy, memCache) {
    var that = this;
    this.serverProxy = serverProxy;
    this.memoryCache = memCache;
    this.systemHeader = ko.observable("");
    
    this.pageCreated = function (){
        console.log("Page all slips view created");
    }
    
    $(document).on("pagebeforeshow", "#allSlipsView", function () {         
        $("#openSlipSubPage").hide();
    });
    
    this.pageShowed = function(){        
        that.fetchOpenSlipData();
        that.fetchData();
    }
    
    this.refresh = function(){
        that.fetchOpenSlipData();
        that.fetchData();
    }
    
    this.fetchOpenSlipData = function() {        
        var htmlListOpenSlipItems = $("#listOpenSlipItems");
        var htmlListOpenSlipSystemItems = $("#listOpenSlipSystemItems");
        var divSlipSystemHeader = $("#divSlipSystemHeader");
        
        htmlListOpenSlipItems.empty();
        htmlListOpenSlipSystemItems.empty();
        
        var slip = getOpenSlip();
        if (slip != null) {
            if (slip.slipItems.length > 0 || slip.system)
                $("#openSlipSubPage").show();
            
            for(var i=0;i< slip.slipItems.length; i++){
                var slipItem = slip.slipItems[i];
                var slipItemLabel = slipItem.homeString + " - " + slipItem.awayString + " <p class='ui-li-aside custom-ui-li-aside'><strong>" + slipItem.oddTypeString + "</strong></p>";

                var htmlItemLabel = $("<a>").attr({"href" : "#"}).html(slipItemLabel);
                var htmlItemDeleteLink = $("<a>").attr({"href" : "#"}).bind("click", {matchID : slipItem.matchID , oddTypeID : slipItem.oddTypeID}, deleteSlipItemEvent);
                var htmlSlipItem = $("<li>").attr({"data-icon" : "delete"});
                
                
                htmlSlipItem.append(htmlItemLabel);
                htmlSlipItem.append(htmlItemDeleteLink);
                
                htmlListOpenSlipItems.append(htmlSlipItem);                
            }
            htmlListOpenSlipItems.listview("refresh");
            
            if (slip.system) {                
                that.systemHeader("Sistem " + slip.system.maxSuccCount + " od " + slip.system.maxCount);
                for(i=0;i< slip.system.slipItems.length; i++){
                    slipItem = slip.system.slipItems[i];                    
                    htmlSlipItem = $("<li>").html(slipItem.homeString + " - " + slipItem.awayString);
                    htmlListOpenSlipSystemItems.append(htmlSlipItem);                
                }
                htmlListOpenSlipSystemItems.listview("refresh");
                
                htmlListOpenSlipSystemItems.show();
                divSlipSystemHeader.show();
                $("#btnLinkInSystem").parent().hide(); //had to use parent() since hide/show does not work properly on buttons in JQM
                $("#btnDeleteSystem").parent().show(); //had to use parent() since hide/show does not work properly on buttons in JQM
            } else {
                // Systems not supported in first version
/*                that.systemHeader("");
                htmlListOpenSlipSystemItems.hide();
                divSlipSystemHeader.hide();
                $("#btnLinkInSystem").parent().show(); //had to use parent() since hide/show does not work properly on buttons in JQM
                $("#btnDeleteSystem").parent().hide(); //had to use parent() since hide/show does not work properly on buttons in JQM*/
            }
            
            
        }
    }
       
    this.closeSlip = function() {
        closeOpenSlip(function(){
                //Success
                $("#openSlipSubPage").hide();
                that.fetchOpenSlipData();
                that.fetchData();
            }, function(){
                //Fail
            });        
    }
    
    this.linkInSystem = function() {
         $.mobile.changePage("#pageSlipSystem");
        //$.mobile.pageContainer.pagecontainer("change", "#pageSlipSystem"); -- to be used with JQM 1.4
    }
    
    this.delSystem = function() {
        deleteSystem(function(){
            $("#openSlipSubPage").hide();
            that.fetchOpenSlipData();
            that.fetchData();
        });
    }
    
    this.deleteSlipItem = function(){
        console.log("Time to delete slip item");
    }
    
    this.fetchData = function() {
       
        that.serverProxy.getAllSlips(deviceID,function(allSlipsObject){
            
            var htmlListActiveSlips = $("#listActiveSlips");
            var htmlListPastSlips = $("#listPastSlips");
            
            htmlListActiveSlips.empty();
            htmlListPastSlips.empty();
            
            var currentSlip = null;
            var slipLink = null;
            var htmlSlipCountBoubble = null;
            var htmlSlipLink = null;
            var htmlSlip = null;
            
            for (var i=0; i < allSlipsObject.ActiveSlips.length; i++)
            {                        
                currentSlip = allSlipsObject.ActiveSlips[i];
                that.memoryCache.addSlip(currentSlip.ID, currentSlip);
                
                slipLink = "#pageSlipView?id=" + currentSlip.ID;
                
                htmlSlipCountBoubble = $("<span>").attr({"class" : "ui-li-count"}).html(currentSlip.MatchCount);                        
                htmlSlipLink = $("<a>").attr({"href" : slipLink}).html(currentSlip.TimeCreatedString);
                htmlSlip = $("<li>");
                
                htmlSlipLink.append(htmlSlipCountBoubble);
                htmlSlip.append(htmlSlipLink).attr({"data-theme" : "e"});
                
                htmlListActiveSlips.append(htmlSlip);
            }
            
            for (var ii=0; ii < allSlipsObject.PastSlips.length; ii++)
            {                        
                currentSlip = allSlipsObject.PastSlips[ii];
                that.memoryCache.addSlip(currentSlip.ID, currentSlip);
                
                slipLink = "#pageSlipView?id=" + currentSlip.ID;
                
                htmlSlipCountBoubble = $("<span>").attr({"class" : "ui-li-count"}).html(currentSlip.MatchCount);                        
                htmlSlipLink = $("<a>").attr({"href" : slipLink}).html(currentSlip.TimeCreatedString);
                htmlSlip = $("<li>");
                
                htmlSlipLink.append(htmlSlipCountBoubble);
                htmlSlip.append(htmlSlipLink);
                
                //success
                if (currentSlip.Status == SLIP_STATUS_SUCCESS)                    
                    htmlSlip.attr({"class" : "slip-status-success"});
                //fail
                else if (currentSlip.Status == SLIP_STATUS_FAIL)
                    htmlSlip.attr({"class" : "slip-status-fail"});
                
                htmlListPastSlips.append(htmlSlip);                
            }
            
            htmlListActiveSlips.listview("refresh"); 
            htmlListPastSlips.listview("refresh"); 
        }, function(status){
            //TODO: handle exception
            console.log("holy shit");
        });
        
        
    };
}