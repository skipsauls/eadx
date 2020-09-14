({
	init: function(component, event, helper) {
        helper.createLocationTree(component);
	},

    handleSelectionChanged: function (component, event, helper) {
        console.warn('handleSelectionChanged: ', event.getParams(), JSON.stringify(event.getParams(), null, 2));
        
        var params = event.getParams();
        var id = params.id;
        component.set("v.dashboardId", id);
        var payload = params.payload;
        console.warn("payload: ", payload);
        var row = null;
        return;
        if (payload) {                
            var step = payload.step;
            console.warn("step: ", step);
            var data = payload.data;
            console.warn("data: ", data);
            if (step === 'GeoJson_State_1') {
                component.set('v.statecode', null);                
            }
            var idx = 0;
            data.forEach(function(obj) {
                for (var k in obj) {
                    console.warn(k + ': ' + obj[k]);
/*                    
                    if (k === 'statecode.Abbreviation') {
                        //component.set('v.statecode', obj[k]);
                        var statecode = obj[k];
                        console.warn('statecode: ', statecode);
						var items = component.get('v.items');
                        var itemMap = component.get('v.itemMap');
                        var item = null;
                        for (var key in itemMap) {
                            item = itemMap[key];
                            console.warn('item: ', item.type, item.name);
                            if (item.type === 'state' && item.name === statecode) {
                                item.expanded = true;
                                var parent = item;
                                do {
									parent.expanded = true;
                                    parent = parent.parent;
                                } while (parent !== null && typeof parent !== 'undefined');
                                break;
                            }                            
                        }

						component.set('v.items', items);
 
                        //
                    }
*/        
                }
            });
        }        
    },
    
    handleSelect: function (component, event, helper) {
        //console.warn('handleSelect: ', event.getParams(), JSON.stringify(event.getParams(), null, 2));
        var name = event.getParam('name');
        helper.selectItem(component, name);
    }
})