({
	handleFire: function(component, event, helper) {
		var type = component.get("v.type");
		var target = component.get("v.target");
		var payload = component.get("v.payload");
        
        console.warn('eaPlatformEventTesterController.handleFire');
        console.warn('type: ', type);
        console.warn('target: ', target);
        console.warn('payload: ', payload);
        
        var action = component.get("c.fireEvent");
        action.setParams({type: type, target: target, payload: payload});
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
})