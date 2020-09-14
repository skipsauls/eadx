({
    showDashboard: function(component, config) {
        $A.createComponent("wave:waveDashboard", config, function(cmp, msg, err) {
            component.set('v.dashboardId', config.dashboardId);
            var dashboard = component.find("dashboard");
            if (err) {
                console.warn("error: ", err);
            } else {
                $A.util.addClass(cmp, "dashboard-container");
                dashboard.set("v.body", [cmp]);
            }            
        });                   
        
    },
    
    filterBy:  function(component, config) {

        console.warn('config: ', config);
        
        var dashboardId = component.get('v.dashboardId');        

        var filter = JSON.stringify(config);
        
        console.warn('filter: ', filter);
        
        var params = {
            value: filter,
            id: dashboardId,
            type: "dashboard"
        };
        console.warn('params: ', params);
        var evt = $A.get('e.wave:update');
        evt.setParams(params);
        evt.fire();           
    }
})