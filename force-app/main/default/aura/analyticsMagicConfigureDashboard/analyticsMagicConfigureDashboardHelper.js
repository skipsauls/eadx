({
    setup: function(component) {
        var matchedDashboardIds = component.get('v.matchedDashboardIds') || '';
        console.warn('matcheDashboardIds: ', matchedDashboardIds);
        var matchedDashboardIdMap = {};
        var ids = matchedDashboardIds.split(',');
        ids.forEach(function(id) {
            matchedDashboardIdMap[id] = true;
        });
        console.warn('matcheDashboardIdMap: ', matchedDashboardIdMap);
        this.listDashboards(component, function(err, dashboards) {
            console.warn('dashboards: ', dashboards);
            component.set('v.dashboards', dashboards);
           	var matchedDashboards = [];
            dashboards.forEach(function(dashboard) {
                console.warn('dashboard.id: ', dashboard.id, matchedDashboardIdMap[dashboard.id]);
                if (matchedDashboardIdMap[dashboard.id] === true) {
                    matchedDashboards.push(dashboard);
                }
            });
            console.warn('matchedDashboards: ', matchedDashboards);
            component.set('v.matchedDashboards', matchedDashboards);
        });  
    },
    
    
    showDashboard: function(component) {
        var config = component.get('v.config');
        
        try {
            config = JSON.parse(config);
        } catch (e) {
            config = undefined;
        }
        
        if (typeof config !== 'undefined' && config !== null && config !== '') {
        
            var outer = component.find("dashboard-outer");
            $A.util.removeClass(outer, "fadein");
            $A.util.addClass(outer, "fadeout");
            
            $A.createComponent(config.type, config.attributes, function(cmp, msg, err) {
                var dashboard = component.find("dashboard");
                if (err) {
                    console.warn("error: ", err);
                } else {
                    $A.util.addClass(cmp, "dashboard-container");
                    //$A.util.addClass(outer, "hidden");
                    dashboard.set("v.body", [cmp]);
                    setTimeout($A.getCallback(function() {
                        //$A.util.removeClass(outer, "hidden");
                        $A.util.removeClass(outer, "fadeout");
                        $A.util.addClass(outer, "fadein");
                    }), 500);
                }            
            });
        }
    },
    
    listAssets: function(component, methodName, callback) {
        var sdk = component.find("sdk");
        
        var context = {apiVersion: "42"};
        var methodName = methodName;
        var methodParameters = {
            pageSize: 200
        };
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            if (err !== null) {
                console.error("listAssets error: ", err);
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
        }));		
    },
    
    listDashboards: function(component, callback) {
        this.listAssets(component, "listDashboards", function(err, data) {
            console.warn('listAssets returned: ', err, data);
            callback(err, data ? data.dashboards : null); 
        });
    },
})