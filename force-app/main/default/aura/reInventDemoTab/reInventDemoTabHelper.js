({
    
    handlePlatformEvent: function(component, event) {
        
        
        var p = event.getParam('payload');
        //console.warn('reInventDemoTabrHelper.handlePlatformEvent: ', p);
        var type = p.df17eadx__type__c;
        var target = p.df17eadx__target__c;
        var payload = p.df17eadx__payload__c;
        
        //console.warn('type: ', type);
        //console.warn('target: ', target);
        //console.warn('payload: ', payload);
        
        if (payload !== null && typeof payload !== 'undefined') {
            payload = typeof payload === 'object' ? payload : JSON.parse(payload);
            var objectType = payload.objectType;
            var id = payload.id;
            var isListView = (typeof payload.listView !== 'undefined' && payload.listView !== null) ? payload.listView : false;
            
            //console.warn('objectType: ', objectType);
            //console.warn('id: ', id);
            //console.warn('isListView: ', isListView);
            
            component.set('v.objectType', objectType);
            
            if (type === 'show') {
                if (isListView === true) {
                    component.set('v.recordId', id)
                    this.showListView(component);
                } else if (objectType === 'dashboard') {
                    component.set('v.dashboardId', id);
                    this.showDashboard(component);                
                } else {
                    component.set('v.recordId', id);
                    this.showRecord(component);
                }
            } else if (type === 'filter_dashboard') {
                
                //console.warn('filter!!!!!!!');
                //console.warn('filter: ', payload.filter);
                //console.warn('filter: ', JSON.stringify(payload.filter, null, 2));
                
                // FOR TESTING!!!!!!!!!!!!
                payload.filter.datasets['df17eadx_opportunity'] = payload.filter.datasets['opportunity'];
                
                payload.filter = {
                    datasets:{
                        "df17eadx__opportunity":[
                            {
                                fields:[
                                    "CloseDate"
                                ],
                                filter:{
                                    operator:"in",
                                    values:[
                                        "This Month"
                                    ]
                                }
                            }
                        ]
                    }
                };
                
                var evt = $A.get('e.wave:update');
                var params = {
                    value: JSON.stringify(payload.filter),
                    id: payload.id,
                    type: payload.objectType
                };
                console.warn('params: ', JSON.stringify(payload, null, 2));
                evt.setParams(params);
                evt.fire();
            }
        }
        
    },
    
    showListView: function(component) {
        var self = this;
        
        var recordId = component.get("v.recordId");
        var objectType = component.get("v.objectType");
        objectType = objectType.substring(0, 1).toUpperCase() + objectType.substring(1).toLowerCase();

        var evt = $A.get("e.force:navigateToList");
       	evt.setParams({
            listViewId: recordId,
            listViewName: null,
            scope: objectType
        });
        evt.fire();
    },
    
    showRecord: function(component) {
        
        var self = this;
        
        var recordId = component.get("v.recordId");
        
        var workspaceAPI = component.find("workspace");
        workspaceAPI.openTab({
            recordId: recordId,
            focus: true
        }).then(function(response) {
            workspaceAPI.focusTab({
                tabId: response
            });
        })
        .catch(function(error) {
            console.error(error);
        });
    },
    
    showDashboard: function(component) {
        
        var self = this;
        
        var dashboardId = component.get("v.dashboardId");
        
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