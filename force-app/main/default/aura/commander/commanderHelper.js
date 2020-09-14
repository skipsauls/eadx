({
    callbacks: {},
    
	fireCommandEvent2: function(component, event, helper) {
        console.warn('commanderHelper.fireCommandEvent2');
        var self = this;
		var params = event.getParam('arguments');
        if (params) {
            var name = params.name;
            var config = params.config;
            var uid = params.uid || Date.now() + '.' + Math.round(Math.random() * 10000000);
			var callback = params.callback;
            
            self.callbacks[uid] = callback;
            
            console.warn('commanderHelper.fireCommandEvent2');
            console.warn('name: ', name);
            console.warn('config: ', config);
            console.warn('uid: ', uid);
            
            var action = component.get("c.fireEvent");
            action.setParams({name: name, config: config, uid: uid});
            var self = this;
            action.setCallback(this, function(response) {
                var state = response.getState();
                console.warn('state: ', state);
                if (state === "SUCCESS") {
                    var val = response.getReturnValue();
                    console.warn('val: ', val);                
                }
                else if (state === "INCOMPLETE") {
                    // do something
                } else if (state === "ERROR") {
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            console.error("Error message: " + errors[0].message);
                        }
                    } else {
                        console.error("Unknown error");
                    }
                }            
            });
            $A.enqueueAction(action);               
        }
		
	},

	fireCommandEvent: function(component, event, helper) {
        console.warn('commanderHelper.fireCommandEvent');
        var self = this;
		var params = event.getParam('arguments');
        if (params) {
            var name = params.name;
            var config = params.config;
            var uid = params.uid || Date.now() + '.' + Math.round(Math.random() * 10000000);
			var callback = params.callback;
            
            self.callbacks[uid] = callback;
            
            console.warn('commanderHelper.fireCommandEvent');
            console.warn('name: ', name);
            console.warn('config: ', config);
            console.warn('uid: ', uid);
            
            var action = component.get("c.fireEvent");
            action.setParams({name: name, config: config, uid: uid});
            var self = this;
            action.setCallback(this, function(response) {
                var state = response.getState();
                console.warn('state: ', state);
                if (state === "SUCCESS") {
                    var val = response.getReturnValue();
                    console.warn('val: ', val);                
                }
                else if (state === "INCOMPLETE") {
                    // do something
                } else if (state === "ERROR") {
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            console.error("Error message: " + errors[0].message);
                        }
                    } else {
                        console.error("Unknown error");
                    }
                }            
            });
            $A.enqueueAction(action);               
        }
		
	},
    
	handleCommandEvent: function(component, event, helper) {
        console.warn('commanderHelper.handleCommandEvent');
        var self = this;
        
        var payload = event.getParam('payload');
       	console.warn('commanderHelper.handleCommandEvent payload: ', JSON.stringify(payload, null, 2));
        
        var name = payload.eadx__name__c;
        var config = payload.eadx__config__c;
        var uid = payload.eadx__uid__c;
        
        console.warn('------------> name: ', name);
        console.warn('------------> config: ', config);
        console.warn('------------> uid ', uid);
        
        var callback = self.callbacks[uid];
        if (typeof callback === 'function') {
            callback({name: name, config: config, uid: uid});
        }
	}
    
})