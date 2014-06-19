function SearchViewModel(serverProxy, memCache) {
    this.serverProxy = serverProxy;
    this.memoryCache = memCache;
};

SearchViewModel.prototype.search = function(){    
    var that = this;
    var searchT = $("#searchField").val();
    
    if (!searchT)
        return;
    
    that.serverProxy.search(searchT, function(myData) {
            var prevDateString = null;
            $("#searchResultList").empty();                    
            for (var i=0; i < myData.length; i++)
            {                        
                var match = myData[i];
                that.memoryCache.addMatch(match.ID, match);
                
                var time = new Date(match.Time);
                var dateString = time.getDate() + "." + (time.getMonth() + 1) + "." + time.getFullYear();
                
                if (prevDateString == null || prevDateString !== dateString)
                {
                    $("#searchResultList").append("<li data-role='list-divider'>"+ dateString +"</li>");
                    prevDateString = dateString;
                }
                var linkParameters = "matchID=" + match.ID;
                                
                $("#searchResultList").append("<li><a href='#pageMatchView?" + linkParameters + "'>" + match.TimeString.slice(0,5) + " " + match.HomeTeamName + " - " + match.AwayTeamName +"</a></li>");                                          
            }
            $("#searchResultList").listview("refresh");                
        }, function(status){
            
        }
    );
};