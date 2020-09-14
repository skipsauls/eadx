({
    doInit: function(component, event, helper) {
        console.warn('eventfulDashboardsEMPController.doInit');
        helper.setupEMP(component);
    },
    
    recordUpdated: function(component, event, helper) {
        console.warn('eventfulDashboardsEMPController.recordUpdated');
        helper.recordUpdated(component);
    }
})