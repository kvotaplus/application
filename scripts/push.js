(function() {
 
    var addCallback = function addCallback(key, callback) {
        if (window.pushCallbacks === undefined) {
            window.pushCallbacks = {}
        }
        window.pushCallbacks[key] = callback;
    };
    
    var pushNotification;
    
    var apnSuccessfulRegistration = function(token) {
        sendTokenToServer(token.toString(16));
        addCallback('onNotificationAPN', onNotificationAPN);
    }
 
    var apnFailedRegistration = function(error) {
        alert("Error: " + error.toString());
    }
 
    //the function is a callback when a notification from APN is received
    var onNotificationAPN = function(e) {
        getPromotionFromServer();
    };
    
 
    var deviceReady = function() {        
        pushNotification = window.plugins.pushNotification;
        
        //register for GCM            
        pushNotification.register( 
            function(id) {
                //console.log("###Successfully sent request for registering with GCM.");
                //set GCM notification callback
                //addCallback('onNotificationGCM', onNotificationGCM);
                alert("Registration sent");
            }, 
            function(error) {                    
                alert("Error " + error.toString());
            }, 
            {
                "senderID": "346674270125", //KvotaPlus project number
                "ecb": "onNotificationGCM"
            }
        );
    }
    
    document.addEventListener("deviceready", deviceReady, false);
}()); 


function onNotificationGCM(e) {
        switch (e.event) {
            case 'registered':
                if (e.regid.length > 0) {
                    //your GCM push server needs to know the regID before it can push to this device
                    //you can store the regID for later use here
                    console.log('###token received');
                    ////////////////////sendTokenToServer(e.regid);
                    alert(e.regid);
                }
                break;
            case 'message':
                getPromotionFromServer();
                break;
            case 'error':
                alert('GCM error = ' + e.msg);
                break;
            default:
                alert('An unknown GCM event has occurred.');
                break;
        }
    }