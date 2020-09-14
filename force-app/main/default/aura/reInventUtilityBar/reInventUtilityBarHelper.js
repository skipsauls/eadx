({
    
    camelize: function(str, spaces) {
    	var regex1 = new RegExp('(?:^\\w|[A-Z]|\\b\\w)', 'g');
        var regex2 = spaces === true ? '' : new RegExp('\\s+', 'g');
	  	return str.replace(regex1, function(letter, index) {
    		return index === 1 ? letter.toLowerCase() : letter.toUpperCase();
	  	}).replace(regex2, '');
	},
    
    handlePlatformEvent: function(component, event) {
        
        var self = this;
        
		/*        
        var workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            console.warn('focused tab info: ', response);
        })
        .catch(function(error) {
            console.log(error);
        });
        */
        
        var p = event.getParam('payload');
        //console.warn('reInventDemoTabrHelper.handlePlatformEvent: ', p);
        var type = p.df17eadx__type__c;
        var target = p.df17eadx__target__c;
        var payload = p.df17eadx__payload__c;
        
        console.warn('type: ', type);
        console.warn('target: ', target);
        console.warn('payload: ', payload);
        
        if (payload !== null && typeof payload !== 'undefined') {
            payload = typeof payload === 'object' ? payload : JSON.parse(payload);
            var objectType = payload.objectType;
            var id = payload.id;
            var isListView = (typeof payload.listView !== 'undefined' && payload.listView !== null) ? payload.listView : false;
            
            console.warn('objectType: ', objectType);
            console.warn('id: ', id);
            console.warn('isListView: ', isListView);
            
            component.set('v.objectType', objectType);
            
            if (type === 'show') {
                if (isListView === true) {
                    component.set('v.recordId', id)
                    this.showListView(component);
                } else if (objectType === 'dashboard') {
                    component.set('v.dashboardId', id);
                    this.showDashboard(component);                
                } else if (objectType === 'document' || objectType === 'spreadsheet') {
                    component.set('v.threadId', id);
                    this.showQuipThread(component);                
                } else {
                    component.set('v.recordId', id);
                    this.showRecord(component);
                }
            } else if (type === 'filter_dashboard') {
                console.warn('filter!!!!!!!');
                console.warn('filter: ', payload.filter);
                console.warn('filter: ', JSON.stringify(payload.filter, null, 2));
                
                // FOR TESTING!!!!!!!!!!!!
                payload.filter.datasets['df17eadx_opportunity'] = payload.filter.datasets['opportunity'];
                                
                var dataset = null;
                
                for (var name in payload.filter.datasets) {
                    dataset = payload.filter.datasets[name];
                    dataset.forEach(function(filter) {
                        filter.fields.forEach(function(field, i) {
                            filter.fields[i] = self.camelize(field, false);
                        });
                        filter.filter.values.forEach(function(value, i) {
                            filter.filter.values[i] = self.camelize(value, true);
                        });
                    });
                }
                

                console.warn('filter: ', JSON.stringify(payload.filter, null, 2));
                
                /*
                payload.filter = {
                    datasets:{
                        "df17eadx__opportunity":[
                            {
                                fields:[
                                    "ForecastCategoryName"
                                ],
                                filter:{
                                    operator:"in",
                                    values:[
                                        "Closed"
                                    ]
                                }
                            }
                        ]
                    }
                };
                */
                
                var evt = $A.get('e.wave:update');
                var params = {
                    value: JSON.stringify(payload.filter),
                    id: payload.id,
                    type: payload.objectType
                };
                console.warn('params: ', JSON.stringify(payload, null, 2));
                evt.setParams(params);
                evt.fire();
            } else if (type === 'select_dashboard') {
                console.warn('select!!!!!!!');
                console.warn('selection: ', payload.selection);
                console.warn('selection: ', JSON.stringify(payload.selection, null, 2));
                
                // FOR TESTING!!!!!!!!!!!!
                payload.selection.datasets['df17eadx_opportunity'] = payload.selection.datasets['opportunity'];
                
                var dataset = null;
                
                for (var name in payload.selection.datasets) {
                    dataset = payload.selection.datasets[name];
                    dataset.forEach(function(selection) {
                        selection.fields.forEach(function(field, i) {
                            selection.fields[i] = self.camelize(field, false);
                        });
                        selection.selection.forEach(function(value, i) {
                            selection.selection[i] = self.camelize(value, true);
                        });
                    });
                }

                console.warn('selection: ', JSON.stringify(payload.selection, null, 2));
                
                /*
                payload.selection = {
                    datasets:{
                        "df17eadx__opportunity":[
                            {
                                fields:[
                                    "ForecastCategoryName"
                                ],
                                selection:["Closed"]
                            }
                        ]
                    }
                };
                
				*/

                var evt = $A.get('e.wave:update');
                var params = {
                    value: JSON.stringify(payload.selection),
                    id: payload.id,
                    type: payload.objectType
                };
                console.warn('params: ', JSON.stringify(payload, null, 2));
                evt.setParams(params);
                evt.fire();
            }
                
        }
        
        //this.updateSelection(component, true, target);
    },
    
    showListView: function(component) {
        var self = this;
        
        var recordId = component.get("v.recordId");
        var objectType = component.get("v.objectType");
        objectType = objectType.substring(0, 1).toUpperCase() + objectType.substring(1).toLowerCase();

        var evt = $A.get("e.force:navigateToList");
        //console.warn('evt: ', evt);
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
        
        console.warn('worspaceAPI: ', workspaceAPI);
		workspaceAPI.getFocusedTabInfo().then(function(response) {
			var focusedTabId = response.tabId;
            if (response.recordId === recordId) {
                
                // Yikes!!!!!
                //var anchor = document.querySelector(".refreshTab a");
               	//anchor.click();
                
                $A.get('e.force:refreshView').fire();
                /*
				workspaceAPI.closeTab({tabId: focusedTabId});            
                workspaceAPI.openTab({
                    recordId: recordId,
                    focus: true
                }).then(function(response) {
                    workspaceAPI.focusTab({
                        tabId: response
                    });
                });
                */
            } else {
                workspaceAPI.openTab({
                    recordId: recordId,
                    focus: true
                }).then(function(response) {
                    workspaceAPI.focusTab({
                        tabId: response
                    });
                })
            }
        })        
        .catch(function(error) {
            console.error(error);
        });
    },

    showQuipThread: function(component) {
        
        var self = this;
        
        var threadId = component.get("v.threadId");

        console.warn('showQuipThread: ', threadId);
        
        var workspaceAPI = component.find("workspace");
        workspaceAPI.openTab({
            url: '#/n/df17eadx__Quip_Viewer',
            focus: true
        }).then(function(response) {
            workspaceAPI.focusTab({
                tabId: response
            });
            var evt = $A.get('e.c:showQuipThread');
            var params = {
                threadId: threadId,
                tabId: response
            };
            evt.setParams(params);
            evt.fire();
		});
    },
    
    showDashboard: function(component) {
        
        var self = this;
        
        var dashboardId = component.get("v.dashboardId");

        var workspaceAPI = component.find("workspace");
        workspaceAPI.openTab({
            url: '#/n/df17eadx__Analytics_Dashboards',
            focus: true
        }).then(function(response) {
            workspaceAPI.focusTab({
                tabId: response
            }).then(function(resp) {
                var evt = $A.get('e.c:showDashboard');
                var params = {
                    dashboardId: dashboardId,
                    tabId: response
                };
                evt.setParams(params);
                evt.fire();
            });
        });
        
		/* Subtabs not supported!!!!!!!
		 * 
        var workspaceAPI = component.find("workspace");
        workspaceAPI.openTab({
           	url: '#/n/df17eadx__Analytics_Dashboards',
            focus: true,
            overrideNavRules: true
        }).then(function(response) {
            console.warn('parent tab opened: ', response);
			workspaceAPI.openSubtab({
                parentTabId: response,
                url: '#/n/df17eadx__Analytics_Dashboards',
                focus: true
            }).then(function(response) {
                console.warn('subtab opened: ', response);
                var evt = $A.get('e.c:showDashboard');
                var params = {
                    dashboardId: dashboardId,
                    tabId: response
                };
                evt.setParams(params);
                evt.fire();
            });
            //workspaceAPI.focusTab({
            //    tabId: response
            //});
        })
        .catch(function(error) {
            console.error(error);
        });
		*/
        
		return;
        
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