({
	init: function(component, event, helper) {
		console.warn('wizardAppPreviewController.init');
	},
    
	handleNext: function(component, event, helper) {
		var navigate = component.get('v.navigateFlow');
		navigate('NEXT'); 
    },

	handleBack: function(component, event, helper) {
		var navigate = component.get('v.navigateFlow');
		navigate('BACK'); 
    }    
})