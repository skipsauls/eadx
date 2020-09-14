({
    init: function(component, event, helper) {
        let developerName = component.get('v.dashboardDevName');
        helper.describeDashboard(component, developerName, function(err, dashboard) {
            if (dashboard) {
                component.set('v.dashboard', dashboard);
            }
        });
        helper.listFolders(component);
        /*
        setInterval($A.getCallback(function() {
            console.warn('checking state');
            let config = {};
            let left = component.find('dashboard_1');
            if (left.get('v.isLoaded') === true) {
                left.getState(config, function(res, err) {
                    //console.warn('getState returned: ', JSON.stringify(res.payload, null, 2));
                    let lastState1 = component.get('v.lastState1');
                    //console.warn('lastState1: ', JSON.stringify(lastState1, null, 2));
                    
                    if (JSON.stringify(lastState1) !== JSON.stringify(res.payload)) {
                        console.warn('>>>>>>>>>>>>>>>> left state changed');
	                    component.set('v.lastState1', res.payload);
                    }
                    
                });
            }
            let right = component.find('dashboard_2');
            if (right.get('v.isLoaded') === true) {
	            right.getState(config, function(res, err) {
    	        });
            }
        }, 1000));
        */
    },

    selectFolder: function(component, event, helper) {
		helper.listDashboards(component);        
    },

    dashboard1Loaded: function(component, event, helper) {
        let dashboard = component.find('dashboard_1');
        console.warn('dashboard1Loaded');
        let config = {};
        dashboard.getState(config, function(res, err) {
            if (err) {
                console.error('getState error: ', err);
            } else {
                let state = JSON.parse(JSON.stringify(res.payload));
                console.warn('dashboard1 state: ', state);
            }
        });
    },

    dashboard2Loaded: function(component, event, helper) {
        let dashboard = component.find('dashboard_2');
        console.warn('dashboard2Loaded');
        let config = {};
        dashboard.getState(config, function(res, err) {
            if (err) {
                console.error('getState error: ', err);
            } else {
                let state = JSON.parse(JSON.stringify(res.payload));
                console.warn('dashboard2 state: ', state);
            }
        });
    },
    
    filter1Changed: function(component, event, helper) {
        console.warn('filter1Changed');
    },
    
    selectDashboard: function(component, event, helper) {
        let developerName = component.get('v.dashboardDevName');
        helper.describeDashboard(component, developerName, function(err, dashboard) {
            if (dashboard) {
                component.set('v.dashboard', dashboard);
            }
        });        
    },
    
    handleGetState: function(component, event, helper) {
        let config = {};
        let dashboard = component.find('dashboard_1');
        console.warn('dashboard: ', dashboard);
        dashboard.getState(config, function(res, err) {
            //console.warn('getState returned: ', JSON.parse(JSON.stringify(res, null, 2)), err);
            if (err) {
                console.error('getState error: ', err);
            } else {
                console.warn('res.payload: ', res.payload);
                let state = JSON.parse(JSON.stringify(res.payload));
                console.warn('state: ', state);
                let json = JSON.stringify(state, null, 2);
                console.warn('json: ', json);
                component.set('v.dashboardStateJson', json);
            }
        });
    },
    
    handleSetState: function(component, event, helper) {
        let json = component.get('v.dashboardStateJson');
        console.warn('json: ', json);
        let config = JSON.parse(json);
        console.warn('config: ', config);
        let dashboard = component.find('dashboard_2');
        console.warn('dashboard: ', dashboard);
        dashboard.setState(config, function(res, err) {
            console.warn('setState returned: ', JSON.parse(JSON.stringify(res, null, 2)), err);
            if (err) {
                console.error('setState error: ', err);
            } else {
                //let json = JSON.stringify(res.payload, null, 2);
                //component.set('v.dashboardStateJson', json);
            }
        });
        
    },

    handleLeftToRight: function(component, event, helper) {
        let config = {};
        let left = component.find('dashboard_1');
        let right = component.find('dashboard_2');
       	left.getState(config, function(res, err) {
            console.warn('getState returned: ', JSON.parse(JSON.stringify(res, null, 2)), err);
            right.setState(res.payload, function(res, err) {
	            console.warn('setState returned: ', JSON.parse(JSON.stringify(res, null, 2)), err);
            });
        });
    },
    
    handleRightToLeft: function(component, event, helper) {
        let config = {};
        let left = component.find('dashboard_1');
        let right = component.find('dashboard_2');
       	right.getState(config, function(res, err) {
            console.warn('getState returned: ', JSON.parse(JSON.stringify(res, null, 2)), err);
            left.setState(res.payload, function(res, err) {
	            console.warn('setState returned: ', JSON.parse(JSON.stringify(res, null, 2)), err);
            });
        });
    },
    
    handleSaveState: function(component, event, helper) {
        
    },
    
    handleLoadState: function(component, event, helper) {
        
    },
    
    handleSelectionChanged: function(component, event, helper) {
        var params = event.getParams();
        console.warn('params: ', JSON.stringify(params));
        //var id = params.id;
        //component.set("v.dashboardId", id);
        var payload = params.payload;
        console.warn("payload: ", payload);
        var row = null;        
        if (payload) {                
            var step = payload.step;
            console.warn("step: ", step);
            var data = payload.data;
            console.warn("data: ", data);
            var idx = 0;
            data.forEach(function(obj) {
                for (var k in obj) {
	                console.warn(k + ': ' + obj[k]);
                }
            });
        }
        
        
        return;
        
        // Mizuho code below
        
        /*
    <aura:attribute name="needsSave" type="Boolean" access="global" default="false"/>
    <aura:attribute name="saveCheckInterval" type="Integer" access="global" default="5000"/>
    <aura:attribute name="saveCheckTimeout" type="Object"/>    
	<aura:handler event="wave:selectionChanged" action="{!c.handleSelectionChanged}"/>        
    */
        let needsSave = component.get('v.needsSave');
        let saveCheckInterval = component.get('v.saveCheckInterval');
        let saveCheckTimeout = component.get('v.saveCheckTimeout');
        
        if (needsSave === false) {
            
            saveCheckTimeout = setTimeout(function() {
                console.warn('saveCheckTimeout fired');
                
                let config = {};
                let dashboard = component.find('dashboard_1');
                console.warn('dashboard: ', dashboard);
                dashboard.getState(config, function(res, err) {
                    console.warn('getState returned: ', JSON.parse(JSON.stringify(res, null, 2)), err);
                    if (err) {
                        console.error('getState error: ', err);
                    } else {
                        console.warn('res.payload: ', res.payload);
                        let state = JSON.parse(JSON.stringify(res.payload));
                        console.warn('state: ', state);
                        let json = JSON.stringify(state, null, 2);
                        console.warn('json: ', json);
                        component.set('v.dashboardStateJson', json);
                        
                        
                        let userId = '1234567890';
                        
                        var action = component.get("c.saveState");
                        action.setParams({userId: userId, state: json});
                        var self = this;
                        action.setCallback(this, function(response) {
                            var state = response.getState();
                            console.warn('state: ', state);
                            if (state === "SUCCESS") {
                                var val = response.getReturnValue();
                                console.warn('val: ', val);                
                            }
                            else if (state === "INCOMPLETE") {
                                // do something
                            } else if (state === "ERROR") {
                                var errors = response.getError();
                                if (errors) {
                                    if (errors[0] && errors[0].message) {
                                        console.error("Error message: " + errors[0].message);
                                    }
                                } else {
                                    console.error("Unknown error");
                                }
                            }            
                        });
                        $A.enqueueAction(action);
                        
                        
                        
                    }
                });                
                
                component.get('v.needsSave', false);

            }, saveCheckInterval);
            
	        component.get('v.needsSave', true);
        }
        
        
    },    
    
})