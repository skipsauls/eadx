({
    doInit: function(component, event, helper) {
        
        let states = helper.states;
        console.warn('states: ', states);
        component.set('v.states', states);
        
        //var json = JSON.stringify(state, null, 2);
        //component.set('v.state', json);    
    },
    
    handleSavedViewIdChange:  function(component, event, helper) {
        
      	let savedViewId = component.get('v.savedViewId');
        if (savedViewId) {            
            helper.getSavedView(component, function(err, savedView) {
                console.warn('getSavedView returned: ', err, savedView);
                if (err) {
                    console.warn('getSavedView error: ',err);
                } else {
                    component.set('v.savedView', savedView);
                    let json = JSON.stringify(savedView, null, 2);
                    component.set('v.savedViewJson', json);
                }
            });
        } else {
            component.set('v.savedView', null);
            component.set('v.savedViewJson', null);
        }
    },
    
    handleRefresh: function(component, event, helper) {
        helper.refreshSavedViewsList(component, function(err, savedViews) {
        	let savedView = component.get('v.savedView');
            if (savedView && savedView.id) {
	            component.set('v.savedViewId', savedView.id);            
            } else {
                component.set('v.savedViewId', null);
            }
        });
        
    },
    
    handleSelect: function(component, event, helper) {
        let action = event.getParam("value");
        console.warn('action: ', action);
        
        if (action === 'save') {
            helper.updateSavedView(component, function(err, savedView) {
                console.warn('updateSavedView returned: ', err, savedView);
                
                if (err) {
                    console.warn('getSavedView error: ',err);
                } else {
                    component.set('v.savedView', savedView);
                    let json = JSON.stringify(savedView, null, 2);
                    component.set('v.savedViewJson', json);
                    helper.refreshSavedViewsList(component, function(err, savedViews) {
                        component.set('v.savedViewId', savedView.id);
                    });
                }
                
            });            
        } else if (action === 'clone') {
            
        } else if (action === 'delete') {
            helper.deleteSavedView(component, function(err, resp) {
                console.warn('deleteSavedView returned: ', err, resp);
                
                if (err) {
                    console.warn('deleteSavedView error: ',err);
                } else {
                    component.set('v.savedView', null);
                    component.set('v.savedViewJson', null);
                    component.set('v.savedViewId', null);
                    helper.refreshSavedViewsList(component, null);
                }
                
            });            
        }
    },
    
    handleSave: function(component, event, helper) {
        helper.updateSavedView(component, function(err, savedView) {
            console.warn('updateSavedView returned: ', err, savedView);
            
            if (err) {
                console.warn('updateSavedView error: ',err);
            } else {
                component.set('v.savedView', savedView);
                let json = JSON.stringify(savedView, null, 2);
                component.set('v.savedViewJson', json);
                helper.refreshSavedViewsList(component, function(err, savedViews) {
                    component.set('v.savedViewId', savedView.id);
                });
            }
            
        });
    },

    handleClone: function(component, event, helper) {
        helper.createSavedView(component, function(err, savedView) {
            console.warn('createSavedView returned: ', err, savedView);
            
            if (err) {
                console.warn('createSavedView error: ',err);
            } else {
                component.set('v.savedView', savedView);
                let json = JSON.stringify(savedView, null, 2);
                component.set('v.savedViewJson', json);
                helper.refreshSavedViewsList(component, function(err, savedViews) {
                    component.set('v.savedViewId', savedView.id);
                });
            }
            
        });
    },
    
    handleDelete: function(component, event, helper) {
        helper.deleteSavedView(component, function(err, resp) {
            console.warn('deleteSavedView returned: ', err, resp);
            
            if (err) {
                console.warn('deleteSavedView error: ',err);
            } else {
                component.set('v.savedView', null);
                component.set('v.savedViewJson', null);
                component.set('v.savedViewId', null);
                helper.refreshSavedViewsList(component, null);
            }
            
        });
    },    
    
    handleStateIndexChange: function(component, event, helper) {
        let states = helper.states;
        let stateIndex = component.get('v.stateIndex');
        try {
            let state = states[stateIndex];
            let json = JSON.stringify(state.value, null, 2);
            component.set('v.state', json);                
        } catch (e) {
            component.set('v.state', '');                
        }
    },
    
    
    setState: function(component, event, helper) {
        let state = component.get('v.state');
        let value = JSON.stringify(JSON.parse(state));
        console.warn('value: ', value);
        let dashboardId = component.get('v.dashboardId');
        
        try {
            //let evt = component.getEvent("update");
            let evt = $A.get('e.wave:update');
            let params = {
                value: value,
                id: dashboardId,
                type: "dashboard"
            };
            console.warn('params: ', params);
            evt.setParams(params);
            evt.fire();
            
        } catch (e) {
            console.warn("JSON exception: ", e);
            
        }
    }        
})