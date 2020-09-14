({
    doInit: function(component, event, helper) {
        //console.warn('streamingController.doInit');
        var action = component.get("c.getSessionId");
        action.setCallback(this, function(response) {
        
            // Configure CometD
            var sessionId = response.getReturnValue();
            //console.warn('sessionId: ', sessionId);
            
            var cometd = new window.org.cometd.CometD();
            
            var cometdUrl = $A.get('$Resource.cometd_3_1_0')
            //console.warn('cometdUrl: ', cometdUrl, cometdUrl.indexOf('http'));
            
            var url = '';
                
            if (cometdUrl.indexOf('http') < 0) {
                // On SFDC
                url = window.location.origin;
            } else {
                var u = new URL(cometdUrl);
                url = u.origin;
            }

            console.warn('url: ', url);
            
            url += '/cometd/43.0/';
            
            var url = window.location.protocol + '//' + window.location.hostname + '/cometd/43.0/';
            //var url = 'https://adx-dev-ed.my.salesforce.com/';
            //var url = 'https://adx-dev-ed.gus.visual.force.com';
            
            //url = 'https://df17eadx-dev-ed.lightning.force.com/cometd/43.0/';
            //url = 'https://df17eadx-dev-ed.lightning.force.com/cometd/40.0';
            //url = 'https://df17eadx-dev-ed.my.salesforce.com/cometd/43.0';
            
            //console.warn('cometd url: ', url);
            
            cometd.configure({
                url: url,
                requestHeaders: { Authorization: 'OAuth ' + sessionId},
                appendMessageTypeToURL : false
            });

            // Connect to
            cometd.handshake($A.getCallback(function(status) {
                //console.warn('cometd status: ', status);
                if (status.successful === true) {
                    
                    cometd.onListenerException = function(exception, handle, isListener, message) {
                        console.warn('cometd listener exception: ', exception, handle, isListener, message);    
                    };
                    
                    var eventName = component.get("v.channel");
                    //console.warn('eventName: ', eventName);
                    cometd.subscribe(eventName, $A.getCallback(function(message) {
                        //console.warn('cometd message: ', message);
                        var messageEvent = component.getEvent("onMessage");
                        messageEvent.setParam("payload", message.data.payload);
                        messageEvent.fire();
					}));
                                        
                } else {
                    // TODO: Handle errors 
                    console.warn('unsuccessful cometd status: ', status);
                }
            }));

        });
        $A.enqueueAction(action);
    }
})