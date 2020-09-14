({
	execCommand: function(component, event, helper) {
        helper.fireCommandEvent(component, event);
	},

	execCommand2: function(component, event, helper) {
        helper.fireCommandEvent2(component, event);
	},
    
	handleCommandEvent: function(component, event, helper) {
        helper.handleCommandEvent(component, event);
	},    
})