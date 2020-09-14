({
	init: function(component, event, helper) {
		console.warn('wizardAppCreateController.init');
	},
    
	handleNext: function(component, event, helper) {
		var navigate = component.get('v.navigateFlow');
		navigate('NEXT'); 
    },

	handleBack: function(component, event, helper) {
		var navigate = component.get('v.navigateFlow');
		navigate('BACK'); 
    } ,
    
	createApp: function(component, event, helper) {
		var appName = component.get('v.appName');
        var templateId = component.get('v.templateId');
        console.warn('create app ', appName, ' from template with the id ', templateId);
        helper.createApp(component, function(response) {
            console.warn('createApp returned: ', response);
            
            var navigate = component.get('v.navigateFlow');
            navigate('NEXT'); 
        });
	}
})