({
	handleCommanderEvent: function(component, event, helper) {
		console.warn('commanderVoiceAliasHandlerController.handleCommanderEvent');
	},
    
    handleCommanderEventPayload: function(component, event, helper) {
		console.warn('commanderVoiceAliasHandlerController.handleCommanderEventPayload');
	},
    
    handleCommanderEventChange: function(component, event, helper) {
		console.warn('commanderVoiceAliasHandlerController.handleCommanderEventChange');
        helper.handleCommanderEventChange(component, event);
	}
    
    
})