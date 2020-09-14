({
	fireAction: function(component, event, helper) {
		var target = event.getSource();
        var name = target.get("v.name");        
		var actions = component.get("v.actions");
        actions.forEach(function(action) {
            if (action.name === name) {
                if (typeof action.handler === "function") {
                    action.handler(name);
                }
            }
        });
	}
})