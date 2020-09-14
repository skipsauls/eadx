({
	init: function(component, event, helper) {
		helper.showDashboard(component);
        
        var self = this;

        var dashboardId = component.get("v.dashboardId");
        component.set('v.dashboardIdReference', dashboardId);
        
		var queryName = component.get('v.queryName');
        var action = component.get("c.getQuery");
        
        action.setParams({queryName: queryName});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var saql = response.getReturnValue();
                //console.warn('saql: ', saql);
                component.set('v.saql', saql);
                
            } else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var err = response.getError();
                console.error('error: ', err);
            }            
        });
        $A.enqueueAction(action); 	        
	},

	queryNameUpdated: function(component, event, helper) {
		helper.showDashboard(component);
	},
    
    updateDashboard: function(component, event, helper) {
        var params = event.getParam('arguments');
        if (params) {
            var saql = params.saql;
            component.set('v.saql', saql);
            var dashboardId = component.get("v.dashboardId");
            helper.updateQuery(component, saql, function(err, id) {
                if (err) {
                    console.warn('updateQuery error: ', err);
                } else {
		            helper.updateSelection(component, true, dashboardId);                            
                }
            });
        }
    }
})