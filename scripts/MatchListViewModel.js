function MatchListViewModel(serverProxy) {
    var that = this;
    
    this.serverProxy = serverProxy;
    this.leagueID = -1;
    
    this.fetch = function() {
        console.log("LOG: Fetch function called in MatchListViewModel - League ID " + that.leagueID);
        if (that.leagueID === -1)
            return;
        
/*        that.serverProxy.getLeagueSchedule(that.leagueID, function(myData) {
                var prevDateString = null;
                $("#listMatches").empty();                    
                for (var i=0; i < myData.length; i++)
                {                        
                    var match = myData[i];
                    var time = new Date(match.Time);
                    var dateString = time.getDate() + "." + (time.getMonth() + 1) + "." + time.getFullYear();
                    
                    if (prevDateString == null || prevDateString !== dateString)
                    {
                        $("#listMatches").append("<li data-role='list-divider'>"+ dateString +"</li>");
                        prevDateString = dateString;
                    }
                    
                    var dateTimeString = dateString + " " + time.getHours() + ":" + time.getMinutes();
                    var linkParameters = "matchID=" + match.ID 
                                    + "&matchName=" +  encodeURIComponent(match.HomeTeamName + " - " + match.AwayTeamName) 
                                    + "&leagueName=" + encodeURIComponent(match.LeagueName)
                                    + "&time=" + encodeURIComponent(dateTimeString);
                                    
                    $("#listMatches").append("<li><a href='#matchView?" + linkParameters + "'>" + match.HomeTeamName + " - " + match.AwayTeamName +"</a></li>");                                          
                }
                $("#listMatches").listview("refresh");                
            }, function(status){
                
            }
        );*/
    };
    
    $(document).on("pagebeforeshow", "#matchListView", function () { 
         console.log("Page leageList before show");        
    });
    
    $(document).on("pagecreate", "#matchListView", function () { 
        console.log("Page leageList created");        
    });
    
    $(document).on("pageshow", "#matchListView", function () { 
         console.log("Page leageList showed");
    });
}