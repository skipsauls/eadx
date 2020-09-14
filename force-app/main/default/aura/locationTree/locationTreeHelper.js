({
    selectItem: function(component, name) {    
        console.warn('selectItem: ', name);
        var items = component.get('v.items');
        console.warn('items: ', items);
        
        var itemMap = component.get('v.itemMap');
        console.warn('itemMap: ', itemMap);
        
        var item = itemMap[name];
        //item = JSON.parse(JSON.stringify(item));
        console.warn('item: ', item);
        
		var statecode = component.get('v.statecode');
		
        console.warn('item.name: ', item.name);
        console.warn('statecode: ', statecode);
        
        if (statecode === item.name) {
            statecode = '';           
        } else {
            statecode = item.name;
        }
        component.set('v.statecode', statecode);
        
        var datasetName = component.get('v.datasetName');
        
        var fields = 'statecode';
                
        var selection = {datasets:{}};
        
        selection.datasets[datasetName] = [{
            fields: [fields],
            selection: [statecode]
        }];
        
        console.warn('selection: ', selection);
        
        var selectionJSON = JSON.stringify(selection, null, 2);
        console.warn('selectionJSON: ', selectionJSON);
        
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
    
    createLocationTree: function(component) {
        
        var self = this;
        
        self.getAddresses(component, function(err, objs) {
            //console.warn('objs: ', objs);
            
            var itemMap = {};
            var items = [];
            var item = null;
            
            var country = null;
            var state = null;
            var city = null;
            var objItem = null;
            
	        var addressPrefix = component.get('v.objectAddressPrefix');
	        var countryField = addressPrefix + component.get('v.countryField');
	        var stateField = addressPrefix + component.get('v.stateField');
	        var cityField = addressPrefix + component.get('v.cityField');
	        var streetField = addressPrefix + component.get('v.streetField');
            
            // Create a map for the country, state, city, and obj nodes
            objs.forEach(function(obj) {
                //console.warn('obj: ', obj);
                country = itemMap[obj[countryField]] || { type: 'country', label: obj[countryField], name: obj[countryField], itemMap: {}, items: [] };
                state = itemMap[obj[stateField]] || { type: 'state', label: obj[stateField], name: obj[stateField], itemMap: {}, items: [] };
                city = itemMap[obj[cityField]] || { type: 'city', label: obj[cityField], name: obj[cityField], itemMap: {}, items: [] };
                objItem = itemMap[obj.Id] || { type: 'obj', label: obj.Name, name: obj.Id, obj: obj, itemMap: {}, items: [] };
                
                itemMap[obj[countryField]] = country;
                itemMap[obj[stateField]] = state;
                itemMap[obj[cityField]] = city;
                itemMap[obj.Id] = objItem;
                
                if (country.itemMap[obj[stateField]] !== 1) {
                    country.itemMap[obj[stateField]] = 1;
                    state.parent = country;
                    country.items.push(state);
                }
                if (state.itemMap[obj[cityField]] !== 1) {
                    state.itemMap[obj[cityField]] = 1;
                    city.parent = state;
                    state.items.push(city);
                }
                if (city.itemMap[obj.Id] !== 1) {
                    city.itemMap[obj.Id] = 1;
                    objItem.parent = city;
                    city.items.push(objItem);
                }
                
            });
            
/*            
            // Add the space nodes to the objs
            var spaceItem = null;
            spaces.forEach(function(space) {
                objItem = itemMap[space.obj];
                if (objItem.itemMap[space.Name] !== 1) {
                    spaceItem = objItem.itemMap[space.Id] || { type: 'space', label: space.Name, name: space.Id, space: space, itemMap: {}, items: [] };
                    objItem.itemMap[space.Name] = spaceItem;
                    objItem.items.push(spaceItem);
                    itemMap[space.Id] = spaceItem;
                }
            });
*/           
            
            var type = component.get('v.objectType');
            console.warn('----------------------------------------- type: ', type);
            
            // Now create the tree using the countries as the root!
            for (var key in itemMap) {
                item = itemMap[key];
                console.warn('item: ', item);
                if (item.type === 'country') {
                    items.push(item);
                }
                
            }
            
            component.set('v.items', items);
            component.set('v.itemMap', itemMap);
        });  
        
    },
    
    getAddresses: function(component, callback) {
        var type = component.get('v.objectType');
        //console.warn('type: ', type);
        var addressPrefix = component.get('v.objectAddressPrefix');
        //console.warn('addressPrefix: ', addressPrefix);
        
        var action = null;
        switch (type) {
            case 'Account':
                action = addressPrefix = 'Billing' ? component.get('c.getAccountBillingAddresses') : component.get('c.getAccountBillingAddresses');
                break;

            case 'Contact':
                action = component.get('c.getContactAddresses');
                break;

            case 'User':
                action = component.get('c.getUserAddresses');
                break;

            case 'Lead':
                action = component.get('c.getLeadAddresses');
                break;
                
        }
        //console.warn('action: ', action);
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var objs = response.getReturnValue();
                //console.warn(type, ' - objs: ', objs);
                if (typeof callback === 'function') {
                    callback(null, objs);
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
    },

})