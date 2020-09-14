({
	handleMenuSelect: function(component, event, helper) {
        var command = event.getParam("value");
        var app = component.get("v.app");
        var handler = component.get("v.handler");
        if (typeof handler === "function") {
            handler(command, app);
        }        
	}
})