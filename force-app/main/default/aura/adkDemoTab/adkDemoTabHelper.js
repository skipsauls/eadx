({
	callAction: function(component, actionName) {
        var action = component.get('c.' + actionName);
        action.setCallback(this, function(response) {
            var state = response.getState();
            //console.warn('state: ', state);
            if (state === "SUCCESS") {
                var records = response.getReturnValue();
                console.warn('records: ', records);
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