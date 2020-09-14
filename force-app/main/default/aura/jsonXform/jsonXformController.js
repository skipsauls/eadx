({
    init: function(component, event, helper) {
        
        var vfOrigin = "https://" + component.get("v.vfHost");
        window.addEventListener("message", function(event) {
            if (event.origin !== vfOrigin) {
                // Not the expected origin: Reject the message!
                return;
            }
            // Handle the message
            //console.log('LC received: ', event.data);
            let payload = event.data;
            let callbackName = payload.callback;
            let err = payload.error || null;
            let resp = payload.response || null;
            let requestId = payload.requestId || null;
            if (payload.callback) {
                helper[payload.callback](component, err, resp, requestId);
            }
        }, false);        
    },
    
    iframeLoaded: function(component, event, helper) {
        // Call any setup code here
        component.set('v.ready', true);
    },    
    
    transform: function(component, event, helper) {
        let enabled = component.get('v.enabled');
        if (enabled) {
			helper.transform(component);            
        }
    },
    
    doTransform: function(component, event, helper) {
        helper.transform(component);            
    }
    
})