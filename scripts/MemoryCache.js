function MemoryCache() {
    this.matchMap = {};
    this.slipMap = {};
};

MemoryCache.prototype.addMatch = function(matchID, matchObject){    
    this.matchMap[matchID] = matchObject;
};

MemoryCache.prototype.getMatch = function(matchID){        
    return this.matchMap[matchID];
};

MemoryCache.prototype.addSlip = function(slipID, slipObject){    
    this.slipMap[slipID] = slipObject;
};

MemoryCache.prototype.getSlip = function(slipID){        
    return this.slipMap[slipID];
};