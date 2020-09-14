({
	test: function(component, event, helper) {
    	var action = component.get("{!c.getDashboards}");
        action.setCallback(this, function(response) {
            console.warn("response: ", response);
            var state = response.getState();
            console.warn("state: ", state);
            var value = response.getReturnValue();
            console.warn("value: ", value);
            var error = response.getError();
            console.warn("error: ", error);
        });
        $A.enqueueAction(action);
	}
})