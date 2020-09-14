({
    doInit: function(component, event, helper) {
        
        var filter = null;
        var developerName = null;
        var dashboardId = null;
        var params = null;
        
        filter = helper.dashboardAFilter;
        developerName = component.get('v.dashboardADeveloperName');        
        params = {
            value: filter,
            id: developerName,
            type: "dashboard"
        };
        component.set('v.developerNameAParams', JSON.stringify(params, null, 2));
        
        filter = helper.dashboardAFilter;
        dashboardId = component.get('v.dashboardAId');        
        var params = {
            value: filter,
            id: dashboardId,
            type: "dashboard"
        };
        component.set('v.dashboardIdAParams', JSON.stringify(params, null, 2));

        filter = helper.dashboardBFilter;
        developerName = component.get('v.dashboardBDeveloperName');        
        params = {
            value: filter,
            id: developerName,
            type: "dashboard"
        };
        component.set('v.developerNameBParams', JSON.stringify(params, null, 2));
        
        filter = helper.dashboardBFilter;
        dashboardId = component.get('v.dashboardBId');        
        var params = {
            value: filter,
            id: dashboardId,
            type: "dashboard"
        };
        component.set('v.dashboardIdBParams', JSON.stringify(params, null, 2));

    },
    
    fireDeveloperNameAParams: function(component, event, helper) {
        var params = component.get('v.developerNameAParams');
        var paramsObj = JSON.parse(params);
        paramsObj.value = JSON.stringify(paramsObj.value);
        var evt = $A.get('e.wave:update');
        evt.setParams(paramsObj);
        evt.fire();        
    },
    
    fireDashboardIdAParams: function(component, event, helper) {
        var params = component.get('v.dashboardIdAParams');
        var paramsObj = JSON.parse(params);
        paramsObj.value = JSON.stringify(paramsObj.value);
        var evt = $A.get('e.wave:update');
        evt.setParams(paramsObj);
        evt.fire();        
    },
    
    fireDeveloperNameBParams: function(component, event, helper) {
        var params = component.get('v.developerNameBParams');
        var paramsObj = JSON.parse(params);
        paramsObj.value = JSON.stringify(paramsObj.value);
        var evt = $A.get('e.wave:update');
        evt.setParams(paramsObj);
        evt.fire();        
    },
    
    fireDashboardIdBParams: function(component, event, helper) {
        var params = component.get('v.dashboardIdBParams');
        var paramsObj = JSON.parse(params);
        paramsObj.value = JSON.stringify(paramsObj.value);
        var evt = $A.get('e.wave:update');
        evt.setParams(paramsObj);
        evt.fire();        
    }
    
    
})