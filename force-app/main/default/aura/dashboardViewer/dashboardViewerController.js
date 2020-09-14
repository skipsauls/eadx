({
    showDashboard: function(component, event, helper) {
        var params = event.getParams();
        var dashboardId = params.dashboardId;
        var developerName = params.developerName;
        helper.showDashboard(component, dashboardId, developerName, tabId);
    }    
})