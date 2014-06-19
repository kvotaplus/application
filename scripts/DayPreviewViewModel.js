function DayPreviewViewModel(serverProxy, memCache) {    
    var that = this;
    this.serverProxy = serverProxy;
    this.memoryCache = memCache;
    
    this.dateList = [];
    this.dateHtmlElementList = [];
    
    this.initDatePicker();
    this.dateChanged(0);
    
    
    $("input[name='radioDatePicker']").bind("change", function(event, ui) {          
        var selectedDateIndex = $('input[name=radioDatePicker]:checked').val();        
        if (selectedDateIndex) {
			that.dateChanged(selectedDateIndex);
        }            
    });
}

DayPreviewViewModel.prototype.initDatePicker = function(){
    var dateDispl = "";    
    var currDate = new Date();
    currDate.setHours(0);
    currDate.setMinutes(0);
    currDate.setSeconds(0);
    currDate.setMilliseconds(0);
    
    for(var i = 0; i < 5; i++){
        dateDispl = currDate.getDate() + "." + (currDate.getMonth() + 1) + ".";        
      
		this.dateList[i] = new Object();
        this.dateList[i].timeFromIso = currDate.toISOString();
        this.dateList[i].timeToIso = (new Date(currDate.getTime() + (24 * 60 * 60 * 1000))).toISOString();
        
        
        $("#lblRadio" + i + " span.ui-btn-text").text(dateDispl);
        $("#radioDate" + i).val(i);
        
        currDate = new Date(currDate.getTime() + (24 * 60 * 60 * 1000));
    }
    
}

DayPreviewViewModel.prototype.dateChanged = function(dateIndex){
    var that = this;
    
    if (this.dateHtmlElementList.length == 0) {
        this.fetchData(0);
        this.fetchData(1);
        this.fetchData(2);
        this.fetchData(3);
        this.fetchData(4);
    }
    
    $.mobile.showPageLoadingMsg();
    $("#csetDayPreview").detach();
    $("#contentDayPreview").trigger("create");
    
    var intID = setInterval(function(){                
        clearInterval(intID);
        $("#contentDayPreview").append(that.dateHtmlElementList[dateIndex]);
        $("#contentDayPreview").trigger("create");
        $.mobile.hidePageLoadingMsg();
    }, 100);
}

DayPreviewViewModel.prototype.fetchData = function(dateIndex){
    var that = this;    
    this.serverProxy.getDayPreview(this.dateList[dateIndex].timeFromIso, this.dateList[dateIndex].timeToIso ,function(dayPreviewObject){
        //$("#csetDayPreview").empty();
        
        //<div data-role="collapsible-set" data-inset="false" id="csetDayPreview">
        
        var htmlCollSet = $("<div>").attr({"data-role" : "collapsible-set", "data-inset" : "false", "id" : "csetDayPreview"});
        for (var i=0; i < dayPreviewObject.ContryMatchList.length; i++)
        {   
            var countryMatchListObject = dayPreviewObject.ContryMatchList[i];
            
            var htmlCountryImg = $("<img>").attr({"style" : "float:right;" , "class" : "flag flag-"+countryMatchListObject.CountryISO});
            var htmlCountryHeading = $("<h2>").html(countryMatchListObject.CountryName).append(htmlCountryImg);
            var htmlCountryItem = $("<div>").attr({"data-role" : "collapsible"}).append(htmlCountryHeading); 
            var htmlMatchList = $("<ul>").attr({"data-role" : "listview"});
            var prevLeagueName = null;
            
            for (var ii=0; ii < countryMatchListObject.MatchList.length; ii++)
            {
                var matchObject = countryMatchListObject.MatchList[ii];                
                that.memoryCache.addMatch(matchObject.ID, matchObject);
                
                var matchLink = "#pageMatchView?matchID=" + matchObject.ID;
                var matchName = "<span>" + matchObject.TimeString.slice(0,5) + "</span> " + matchObject.HomeTeamName + " - " + matchObject.AwayTeamName;
                
                var htmlLinkObject = $("<a>").attr({"href" : matchLink, "data-transition" : "slide"}).html(matchName);
                var htmlMatchObject = $("<li>").attr({"data-theme" : "c"}).append(htmlLinkObject);        
                
                if (prevLeagueName == null || prevLeagueName != matchObject.LeagueName)
                {
                    prevLeagueName = matchObject.LeagueName;
                    $("<li>").attr({"data-role" : "list-divider"}).html(prevLeagueName).appendTo(htmlMatchList);                    
                }
                
                htmlMatchList.append(htmlMatchObject);
            }
            
            htmlCountryItem.append(htmlMatchList);
            htmlCountryItem.appendTo(htmlCollSet);            
            //htmlCountryItem.appendTo("#csetDayPreview");
        }
        
        that.dateHtmlElementList[dateIndex] = htmlCollSet;
        
        //$("#csetDayPreview").collapsibleset().trigger("create");
    }, function(status){
        //TODO: handle exception
        console.log("holy shit");
    }
);
};
