({
    createTabs: function(component) {
        var self = this;
        
        var devName = component.get('v.developerName');
        var developerName = component.get('v.developerName');
        
        component.set('v.developerNameTemp', devName);
        component.set('v.developerName', null);
        
        if (developerName.indexOf('__') >= 0) {
            developerName = developerName.split('__')[1];            
        }
        self.listDashboards(component, developerName, function(err, dashboards) {
            //console.warn('dashboards: ', dashboards); 
            if (dashboards) {
                self.describeDashboard(component, dashboards[0].id, function(err, dashboard) {
                    component.set('v.dashboardDef', dashboard);
                    self.generatePageNav(component);                    
			        component.set('v.developerName', devName);
                });
            }
        });
    },
    
    generatePageNav: function(component) {
        var dashboardDef = component.get('v.dashboardDef');
        dashboardDef = JSON.parse(JSON.stringify(dashboardDef));
        //console.warn('dashboardDef: ', dashboardDef);
        var pages = dashboardDef.state.gridLayouts[0].pages;
        //console.warn('pages: ', pages);
        component.set('v.pages', pages);
    },
    
    listDashboards: function(component, query, callback) {
        var sdk = component.find("sdk");
        
        var context = {apiVersion: "44"};
        var methodName = 'listDashboards';
        var methodParameters = {
            q: query
        };
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
                    return data;
                }
            }
        }));		
    },
    
    describeDashboard: function(component, dashboardId, callback) {
        var sdk = component.find("sdk");
        
        var context = {apiVersion: "44"};
        var methodName = "describeDashboard";
        var methodParameters = {
            dashboardId: dashboardId
        };
        sdk.invokeMethod(context, methodName, methodParameters, function(err, data) {
            if (err !== null) {
                console.error("describeDashboard error: ", err);
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(err, null);
                } else {
                    return err;
                }
            } else {
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(null, data);
                } else {
                    return data;
                }
            }
        });
    }
    
})