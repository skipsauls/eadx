({
	login: function(component, event, helper) {
        var action = component.get("c.getAccessToken");
        action.setParams({});
        var self = this;
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var val = response.getReturnValue();
                console.warn('val: ', val, JSON.stringify(val, null, 2));
            }
            else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.error("Error message: " + errors[0].message);
                        if (typeof callback === "function") {
                            callback(errors, null);
                        }
                    }
                } else {
                    console.error("Unknown error");
                    if (typeof callback === "function") {
                        callback({error: 'Unknown error'}, null);
                    }
                }
            }            
        });
        $A.enqueueAction(action);

	}
})