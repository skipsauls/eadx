({
    doInit: function(component, event, helper) {
        var self = this;
        
		var resourceName = component.get('v.resourceName');
        var action = component.get("c.getSoundResourceInfo");
        
        action.setParams({resourceName: resourceName});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var resourceInfo = response.getReturnValue();
                var soundResources = [];
                resourceInfo.forEach(function(info) {
                    if (info['fileName'].indexOf('__MACOSX') === 0) {
                        // ignore
                    } else if (info['fileName'].toLowerCase().indexOf('.wav') > 0) {
                        soundResources.push(info);
                    }
                });
                component.set('v.soundResources', soundResources);
                helper.setup(component);
                
            } else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var err = response.getError();
                console.error('error: ', err);
            }            
        });
        $A.enqueueAction(action);        
    },
    
	voiceSFXProxyReady : function(component, event, helper) {
        var loading = component.get('v.loading');
        if (loading === false) {
			helper.setup(component);
    		component.set('v.loading', true);        
        }
	},
    
	playSound: function(component, event, helper) {
		var params = event.getParam('arguments');
        if (params) {
            var voiceProxy = component.find('voiceSFXProxy');
            var uid = 'play_sound_' + Date.now();
            voiceProxy.playSound(params.name, uid, function() {
                //console.warn('voiceProxy.playSound returned: ', arguments); 
            });            
        }
	},

	stopSound: function(component, event, helper) {
		var params = event.getParam('arguments');
        if (params) {
            var voiceProxy = component.find('voiceSFXProxy');
            var uid = 'stop_sound_' + Date.now();
            voiceProxy.stopSound(params.name, uid, function() {
                //console.warn('voiceProxy.stopSound returned: ', arguments); 
            });            
        }
	},
})