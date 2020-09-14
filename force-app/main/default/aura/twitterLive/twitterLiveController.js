({
    handleSelectionChanged: function(component, event, helper) {
        helper.handleSelectionChanged(component, event);
    },
    
    handlePlatformEvent: function(component, event, helper) {
        helper.handlePlatformEvent(component, event);
    },    
    
    start: function(component, event, helper) {
        helper.start(component);
    },
    
    stop: function(component, event, helper) {
        helper.stop(component);
    },

    toggleRunning: function(component, event, helper) {
        var started = component.get("v.started");
        if (started === false) {
			helper.start(component);
        } else {
            helper.stop(component);
        }
	},
    
    changeInterval: function(component, event, helper) {
        //helper.stop(component);
        //helper.start(component);
    },
    
    handleFire: function(component, event, helper) {
        //helper.fireEvent(component);
        var target = component.get("v.target");
        helper.updateSelection(component, true, target);
    },
    
    handleGetLimits: function(component, event, helper) {
		helper.updateLimits(component);        
    }
})