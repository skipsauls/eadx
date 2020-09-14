({
    init: function(component, event, helper) {
        console.warn('analyticsMagicConfigureDashboardController.init');
        helper.showDashboard(component);
        helper.setup(component);
        
    },
    
    handleSelectDashboard: function(component, event, helper) {
        var dashboardId = component.get('v.dashboardId');
        console.warn('handleSelectDashboard: ', dashboardId);
        
        if (typeof dashboardId !== 'undefined' && dashboardId !== null && dashboardId !== '') {
            
            var config = component.get('v.config');
            
            if (typeof dashboardId !== 'undefined' && dashboardId !== null && dashboardId !== '') {
                var config = {
                    type: 'wave:waveDashboard',
                    attributes: {
                        dashboardId : dashboardId,
                        height: "600",
                        openLinksInNewWindow: true,
                        showHeader: false,
                        showTitle: false,
                        showSharing: false
                    }
                };
                
                // Store the config JSON so the flow picks it up
                component.set('v.config', JSON.stringify(config));
                
                helper.showDashboard(component);
            }
            
        }
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