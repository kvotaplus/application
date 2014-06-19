function SystemViewModel() {
    var that = this;
    this.systemMaxCount = ko.observable(0);
}

SystemViewModel.prototype.pageBeforeShowed = function(){
	this.clear();
}

SystemViewModel.prototype.pageShowed = function(){
	this.getOpenSlip();
}

SystemViewModel.prototype.clear = function(){	
    $("#chkBoxListGroupSystem").empty();
}

SystemViewModel.prototype.getOpenSlip = function(){	
    var t = this;
    var slip = getOpenSlip();
    
    var htmlSystem = $("#chkBoxListGroupSystem");
    for(var i=0;i< slip.slipItems.length; i++){
        var slipItem = slip.slipItems[i];
    	var slipItemLabel = slipItem.homeString + " - " + slipItem.awayString;
        var slipItemID = "c-"+slipItem.matchID+"_"+slipItem.oddTypeID;
        
        var htmlItemChkbox = $("<input>").attr({"type" : "checkbox", "name" : slipItemID, "id" : slipItemID, "class" : "chkboxSystem", "data-match-id" : slipItem.matchID, "data-oddtype-id" : slipItem.oddTypeID, "checked":"checked"});
        htmlSystem.append(htmlItemChkbox);
        
        var htmlItemLabel = $("<label>").attr({"for" : slipItemID}).html(slipItemLabel);
        htmlSystem.append(htmlItemLabel);
    }
    htmlSystem.trigger("create");
    this.updateCount();
    
    $("input[type='checkbox'].chkboxSystem").bind("change", function(event, ui) {
    	t.updateCount();
    });
}

SystemViewModel.prototype.updateCount = function(){	
    var count = $("input[type='checkbox'].chkboxSystem:checked").length;
    this.systemMaxCount(count);
    htmlSlider = $("#sliderSystem");
    htmlSlider.attr({"max" : count});
    htmlSlider.slider("refresh");
}

SystemViewModel.prototype.linkInSystem = function(){    
    var systemMaxCount = $("input[type='checkbox'].chkboxSystem:checked").length;
    var systemSuccCount = $("#sliderSystem").val();
        
    var systemItemList = [];
    
    var htmlCheckedChkboxes = $("input[type='checkbox'].chkboxSystem:checked");
    for(var i=0; i< htmlCheckedChkboxes.length; i++) {
        var systemItem = new Object();
        systemItem.matchID = $(htmlCheckedChkboxes[i]).attr("data-match-id");
        systemItem.oddTypeID = $(htmlCheckedChkboxes[i]).attr("data-oddtype-id");
        systemItemList.push(systemItem);
    }
    
    createSystem(systemMaxCount, systemSuccCount, systemItemList, function(){
		 $.mobile.changePage("#pageAllSlipsView");
        //$.mobile.pageContainer.pagecontainer("change", "#pageSlipSystem"); -- to be used with JQM 1.4 
    });
}