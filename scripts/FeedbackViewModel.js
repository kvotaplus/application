function FeedbackViewModel(serverProxy) {
    var that = this;
    this.serverProxy = serverProxy;    
}


FeedbackViewModel.prototype.send = function(){    
    var that = this;
    var feedbackText = $("#txtFeedback").val();
    
    console.log("Feedback is " + feedbackText);
    if (!feedbackText)
        return;
    
    var feedbackModel = {"Feedback" : feedbackText, "DeviceID" : window.localStorage.getItem(p_key_uuid)};
    that.serverProxy.sendFeedback(feedbackModel, function(myData) {                    
            console.log("feedback sent");
            $.mobile.changePage( "#pageDayPreview", { transition: "slide", reverse: true, changeHash: false });
        }, function(status) {
            console.log("feedback error " + status);
            $.mobile.changePage( "#pageDayPreview", { transition: "slide", reverse: true, changeHash: false });
        });
};