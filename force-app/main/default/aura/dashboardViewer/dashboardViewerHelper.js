({
    showDashboard: function(component, dashboardId, developerName, tabId) {
        
        var self = this;
        
        var workspaceAPI = component.find("workspace");
        
        workspaceAPI.getEnclosingTabId().then(function(cmpTabId) {
            if (typeof tabId !== 'undefined' && tabId !== null) {
                if (tabId !== cmpTabId) {
					return;                    
                }
            }

            self.describeDashboard(component, dashboardId, $A.getCallback(function(err, dashboard) {
                if (err !== null) {
                    console.warn('describeDashboard error: ', err);
                } else {
                    console.warn('dashboard: ', dashboard);
                    
                    if (dashboard && dashboard.label) {
                        var workspaceAPI = component.find("workspace");
                        var tabId = component.get("v.tabId");
                        workspaceAPI.setTabLabel({
                            tabId: tabId,
                            label: dashboard.label
                        });
                    }
                }
            }));
            
            var outer = component.find("dashboard-outer");
            $A.util.removeClass(outer, "fadein");
            $A.util.addClass(outer, "fadeout");
            
            // Focus this tab to show the dashboard
            var tabId = component.get("v.tabId");        
            var workspaceAPI = component.find("workspace");
            workspaceAPI.focusTab({
                tabId: tabId
            });        
            
            var config = {
                dashboardId: dashboardId,
                height: "800",
                openLinksInNewWindow: true,
                showHeader: false,
                showTitle: false,
                showSharing: false
            };
            $A.createComponent("wave:waveDashboard", config, function(cmp, msg, err) {
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
            
        });
    },
    
    describeDashboard: function(component, dashboardId, callback) {
        var sdk = null;
        try {            
            sdk = component.find("sdk");
            console.warn('describeDashboard - sdk: ', sdk);
        } catch (e) {
            console.error("Exception: ", e);
            if (callback !== null && typeof callback !== 'undefined') {
                callback(e, null);
            }
            return;
        }
        
        var context = {apiVersion: "41"};
        var methodName = "describeDashboard";
        var methodParameters = {
            dashboardId: dashboardId
        };
        //sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
        sdk.invokeMethod(context, methodName, methodParameters, function(err, data) {
            //console.warn('describeDashboard returned: ', err, data);
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
        //}));
    },
    
    // Forces dashboard to redraw
    updateSelection: function(component, init, target) {
        var values = init === true ? [component.get('v.fieldValue')] : [null];
        var self = this;
        var selection = {
            datasets: {}
        };
        
        selection.datasets[component.get("v.datasetName")] = [
            {
                fields: [component.get('v.fieldName')],
                selection: values
            }
        ];
        
        
        var json = JSON.stringify(selection);
        
        var dashboardId = target; //component.get('v.dashboardId');
        var evt = $A.get('e.wave:update');
        var params = {
            value: json,
            id: dashboardId,
            type: "dashboard"
        };
        evt.setParams(params);
        evt.fire();
        
        if (init === true) {
            setTimeout($A.getCallback(function() {
                self.updateSelection(component, false, target)
            }, 50));
        }
    }
})