function LeagueListViewModel(serverProxy) {
    var that = this;
    this.serverProxy = serverProxy;
    
    this.fetch = function() {        
        that.serverProxy.getLeaguesWithCount(function(myData){
                $("#listLeagues").empty();
                for (var i=0; i < myData.length; i++)
                {                        
                    var league = myData[i];
                    $("#listLeagues").append("<li><a href='#matchListView?leagueID="+league.ID+"'>" + league.Name + "<span class='ui-li-count'>" + league.MatchCount + "</span></a></li>");
                }
                $("#listLeagues").listview("refresh");
            }, function(status){
                //TODO: handle exception
            }
        );
    };
    
    $(document).on("pagebeforeshow", "#leagueListView", function () { 
         console.log("Page leageList before show");        
    });
    
    this.onPageCreate = function(){
        console.log("-------------------------->");
        that.fatch();
    }
    
    
    $(document).on("pagecreate", "#leagueListView", function () { 
        console.log("Page leageList created");
        //that.fetch();
    });
    
    $(document).on("pageshow", "#leagueListView", function () { 
         console.log("Page leageList showed");
    });
}