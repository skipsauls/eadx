({
    setup: function(component) {
        this.refresh(component);
    },
    
    refresh: function(component, event, helper) {
        var self = this;
        this.listDashboards(component, function(err, dashboards) {
            if (dashboards !== null && typeof dashboards !== 'undefined') {
                component.set('v.dashboards', dashboards);
            }
        });
    },
    
    listDashboards: function(component, callback) {
        var sdk = component.find("sdk");
        
        var context = {apiVersion: "41"};
        var methodName = "listDashboards";
        var methodParameters = {};
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            if (err !== null) {
                console.error("listDashboards error: ", err);
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(err, null);
                } else {
                    return err;
                }
            } else {
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(null, data.dashboards);
                } else {
                    return data.dashboards;
                }
            }
        }));		
    }
})