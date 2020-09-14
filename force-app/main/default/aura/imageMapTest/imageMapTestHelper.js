({
    generatePageNav: function(component) {
        var dashboardDef = component.get('v.dashboardDef');
        dashboardDef = JSON.parse(JSON.stringify(dashboardDef));
        //console.warn('dashboardDef: ', dashboardDef);
        var pages = dashboardDef.state.gridLayouts[0].pages;
        //console.warn('pages: ', pages);
        component.set('v.pages', pages);
        
        var pageMap = {};
        pages.forEach(function(page) {
            //console.warn('page: ', page);
          	pageMap[page.label] = page.name; 
        });
        //console.warn('pageMap: ', pageMap);
        component.set('v.pageMap', pageMap);
    },
    
    listDashboards: function(component, query, callback) {
        //console.warn('query: ', query);
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