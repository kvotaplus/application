function MatchViewModel(memCache) {
    var that = this;
    
    this.memoryCache = memCache;
    
    this.matchID = -1;    
    this.homeTeamName = ko.observable("");
    this.awayTeamName = ko.observable("");
    this.matchTime = ko.observable("");
    this.leagueName = ko.observable("");
    this.imgFlagPath = ko.observable("");
    
    this.pageShowed = function(){                
        //$("input[type='checkbox']").attr("checked",false).checkboxradio("refresh");
    }
    
    //check if this is working faster with page-show
    $(document).on("pagebeforeshow", "#pageMatchView", function () { 
        $("input[type='checkbox']").attr("checked",false).checkboxradio("refresh");
        var matchObject = that.memoryCache.getMatch(that.matchID);
        if (matchObject) {            
            that.homeTeamName(matchObject.HomeTeamName);
            that.awayTeamName(matchObject.AwayTeamName);
            that.leagueName(matchObject.LeagueName);
            that.matchTime(matchObject.TimeString);
            that.imgFlagPath("img/flags/flag_" + matchObject.CountryIso + ".png");
        }
        else{
            console.log("------------> Cannot find match in memory cache " + that.matchID);
        }
    });
}