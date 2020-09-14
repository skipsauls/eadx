({
    doInit: function(component, event, helper) {
        helper.listDashboards(component, function(err, dashboards) {
            component.set('v.dashboards', dashboards);    
        });
        
        helper.loadDashboard(component);
    },

    handleDeveloperNameChanged: function(component, event, helper) {
        let sync = component.get('v.sync');
        if (sync === true) {
            let developerName = component.get('v.developerName');
            component.set('v.developerNameA', developerName);
            component.set('v.developerNameB', developerName);
        }
    },
    
    handleDeveloperNameAChanged: function(component, event, helper) {
        let sync = component.get('v.sync');
        if (sync === true) {
            let developerName = component.get('v.developerNameA');
            component.set('v.developerNameB', developerName);
        }
    },
    
    handleDeveloperNameBChanged: function(component, event, helper) {
        let sync = component.get('v.sync');
        if (sync === true) {
            let developerName = component.get('v.developerNameB');
            component.set('v.developerNameA', developerName);
        }
        helper.loadDashboard(component);
    },
    
    handleDiscoverResponse: function(component, event, helper) {        
        let id = event.getParam('id');
        let developerName = component.get('v.developerName');
        if (id === developerName) {
            component.set('v.ready', true);
        }
    },
    
    handleSwitch: function(component, event, helper) {
        
    }
    
})