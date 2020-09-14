({
    init : function(component, event, helper) {
        
        // Change SFDC format with _ to -
        var lang = component.get('v.lang');
        lang = lang.replace('_', '-');
        component.set('v.lang', lang);
        
        var vfOrigin = component.get("v.vfOrigin");
        
        window.addEventListener("message", function(event) {
            //console.log('LC received event.origin: ', event.origin);
            //console.warn('LC vfOrigin: ', vfOrigin);

	        let vfToken = component.get('v.vfToken');

            //console.warn('LC vfToken: ', vfToken);
       
            // If vfOrigin is not set, only allow setup messages
            if (vfOrigin === null || typeof vfOrigin === 'undefined') {
                //console.log('LC received event.data: ', event.data);
	            //console.warn('vfOrigin: ', vfOrigin);
                
                let payload = event.data;
                vfOrigin = payload.vfOrigin;
                component.set('v.vfOrigin', vfOrigin);
                
            } else {
                
                if (event.origin !== vfOrigin) {
                    // Not the expected origin: Reject the message!
                    return;
                }
                // Handle the message
                //console.log('LC received event.data: ', event.data);
                let payload = event.data;
                let type = payload.type;
                if (type === 'hide_vf_frame') {
                    let vfFrame = component.find('vfFrame');
                    $A.util.addClass(vfFrame, 'hidden');
                    component.set('v.state', 'home');
                } else {
                    let callbackName = payload.callback;
                    let err = payload.error || null;
                    let resp = payload.response || null;
                    if (payload.callback) {
                        helper[payload.callback](component, err, resp);
                    }
                }
            }
        }, false);
        
        let action = component.get('c.fetchUser');
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var userDetails = response.getReturnValue();
                console.warn('userDetails: ', userDetails);
                component.set('v.userDetails', userDetails);
            }
            else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var err = response.getError();
                console.error('error: ', err);
            }            
        });
        $A.enqueueAction(action);        
    },

    iframeLoaded: function(component, event, helper) {
    	//console.warn('iframeLoaded');
        setTimeout(function() {
	        helper.setup(component);
            
        }, 500);
    },

    handleProxyReady: function(component, event, helper) {
        console.warn('handleProxyReady');
        let proxyReady = component.get('v.proxyReady');
        console.warn('proxyReady: ', proxyReady);
        if (proxyReady === true) {
	    	let proxy = component.find('proxy');
            console.warn('proxy: ', proxy);
    	    component.set('v.proxy', proxy);
        }
    },
    
    handleSpeechTextChange: function(component, event, helper) {
        let text = component.get('v.speechText');
        if (text !== null && typeof text !== 'undefined') {
            helper.speak(component, text);
            component.set('v.speechText', null);
        }
    },

    handleUserLogTextChange: function(component, event, helper){ 
        let text = component.get('v.userLogText');
        if (text !== null && typeof text !== 'undefined') {
            helper.logUser(component, text);
            component.set('v.userLogText', null);
        }
    },

    handleSystemLogTextChange: function(component, event, helper){ 
        let text = component.get('v.systemLogText');
        if (text !== null && typeof text !== 'undefined') {
			helper.logSystem(component, text);
    	    component.set('v.systemLogText', null);
        }
    },

    handleCommanderEvent: function(component, event, helper){ 
        helper.handleCommanderEvent(component, event);
    },
    
    handleCommanderEventChange: function(component, event, helper) {
        helper.handleCommanderEventChange(component, event);
    },
    
    
    handleCommanderEventPayload: function(component, event, helper) {
    },
    
    handleCommanderOutputEvent: function(component, event, helper){
        //console.warn('handleCommanderOutputEvent: ', event);
        
        var text = event.getParam('text');
        var speech = event.getParam('speech');

        if (text) {
            helper.logSystem(component, text);
        }
        
        if (speech) {
            helper.speak(component, speech);            
        }
    },
    
    handleSettingsClick: function(component, event, helper) {
    	let state = component.get('v.state');
        if (state !== 'settings') {
            state = 'settings';
        } else {
            state = 'home';
        }
        component.set('v.state', state);
    }, 
    
    keyCheck: function(component, event, helper) {
        if (event.which === 13) {
            helper.callCommander(component);
        }
    },
    
    callCommander: function(component, event, helper) {
        helper.callCommander(component);
    },
    
    type: function(component, event, helper) {
        component.set('v.state', 'typing');
    },
    
    listen: function(component, event, helper) {
        let state = component.get('v.state');
        if (state === 'speaking') {
            helper.stopListening(component);
           	component.set('v.state', 'home');
        } else {            
            helper.startListening(component);
            component.set('v.state', 'speaking');
        }
    },
   
    getVoices: function(component, event, helper) {
        let payload = {
            action: 'getVoices',
            callback: 'handleGetVoices'
        };
        helper.sendToVF(component, payload);
    },
    
	testSpeech: function(component, event, helper) {
        let payload = {
            action: 'speak',
            params: {
	            text: 'This is a test',
                voice: component.get('v.voiceName')
            },
            callback: 'handleSpeakCallback'
        };
        helper.sendToVF(component, payload);
    }
    
})