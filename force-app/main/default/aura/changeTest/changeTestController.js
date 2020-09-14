({
    doInit: function(component, event, helper) {
        helper.loadDashboard(component);
    },

    handleDeveloperNameChanged: function(component, event, helper) {
        helper.loadDashboard(component);
    },

    handleDiscoverResponse: function(component, event, helper) {        
	    console.warn('handleDiscoverResponse: ', event, event.getParams());
        let id = event.getParam('id');
        console.warn('id: ', id);
        let developerName = component.get('v.developerName');
        if (id === developerName) {
            component.set('v.ready', true);
        }
        
    },

    handleSwitch: function(component, event, helper) {
    
    }
    
})