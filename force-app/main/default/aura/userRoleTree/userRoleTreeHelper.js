({
    
    selectItem: function(component, name) {    
        //console.warn('selectItem: ', name);
		var items = component.get('v.items');
        //console.warn('items: ', items);
        
        var itemMap = component.get('v.itemMap');
        //console.warn('itemMap: ', itemMap);
        
        var item = itemMap[name];
        item = JSON.parse(JSON.stringify(item));
        //console.warn('item: ', item);
        
        var datasetName = 'df17eadx__user';
        var fields = 'Role.RoleNames';
        var selection = item.name;


        var selection = {datasets:{}};
        
        selection.datasets[datasetName] = [{
            fields: [fields],
            selection: [item.name]
        }];
        
        //console.warn('selection: ', selection);

        var selectionJSON = JSON.stringify(selection, null, 2);
        //console.warn('selectionJSON: ', selectionJSON);
        
        var dashboardId = component.get('v.dashboardId');
        var developerName = component.get('v.developerName');
        
        try {
            var obj = JSON.parse(selectionJSON);
            var selection = JSON.stringify(obj);
            
            var evt = $A.get('e.wave:update');
            var params = {
                value: selection,
                id: dashboardId,
                //id: developerName,
                type: "dashboard"
            };
            console.warn('params: ', params);
            evt.setParams(params);
            evt.fire();
            
        } catch (e) {
            console.warn("JSON exception: ", e);
            helper.showToast(component, "Error", "The selection JSON is invalid JSON, please check and try again.", "error", null);
            
        }        
	},
    
	createUserRoleTree: function(component) {
        
		var self = this;
        
        self.getUserRoles(component, function(err, userRoles) {
            
            var item = null;
            var items = [];
            var itemMap = {};
            var itemNameMap = {};
            userRoles.forEach(function(userRole) {
                item = {
                    label: userRole.Name,
                    name: userRole.DeveloperName,
                    id: userRole.Id,
                    parentRoleId: userRole.ParentRoleId
                };
                itemMap[item.id] = item;
                itemNameMap[item.name] = item;
            });
            
            var parent = null;
            for (var id in itemMap) {
                item = itemMap[id];
                if (item.parentRoleId) {
                    parent = itemMap[item.parentRoleId];
                    if (parent !== null && typeof parent !== 'undefined') {
                        parent.items = parent.items || [];
                        parent.items.push(item);
                    }
                } else {
                    items.push(item);
                }
            }
            
            //console.warn('itemMap: ', itemMap);
            //console.warn('items: ', items);

            // Set the itemNameMap as lookup is by name, not id
			component.set('v.itemMap', itemNameMap);
			component.set('v.items', items);
            
        });
        
    },
    
    getUserRoles: function(component, callback) {
        var action = component.get('c.getUserRoles');
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var userRoles = response.getReturnValue();
                //console.warn('userRoles: ', userRoles);
                if (typeof callback === 'function') {
                    callback(null, userRoles);
                }
            }
            else if (state === 'INCOMPLETE') {
                // do something
            } else if (state === 'ERROR') {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.error('Error message: ' + errors[0].message);
                        if (typeof callback === 'function') {
                            callback('Error message: ' + errors[0].message, null);
                        }
                    }
                } else {
                    console.error('Unknown error');
                    if (typeof callback === 'function') {
                        callback('Unknown error', null);
                    }
                    
                }
            }            
        });
        $A.enqueueAction(action);        
	}
})