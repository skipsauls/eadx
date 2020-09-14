({
    show: function(component, event, helper) {
		helper.openWizard(component);
    },

    hide: function(component, event, helper) {
        helper.closeWizard(component);
    },
    
    handleClose: function(component, event, helper) {
        helper.closeWizard(component);
    },
    
	handleBack: function(component, event, helper) {
		console.warn("installerWizardController.handleBack");
        helper.handleBack(component);
	},
    
	handleNext: function(component, event, helper) {
		console.warn("installerWizardController.handleNext");
        helper.handleNext(component);
	}
    
})