({
	init: function(component, event, helper) {
        var query = "q = load \"0FbB0000000HGHgKAO/0FcB0000001hyf9KAA\";";
        query +=  "q = foreach q generate 'Address' as 'Address', 'City' as 'City', 'Latitude' as 'Latitude', 'Location' as 'Location', 'Longitude' as 'Longitude', 'Name' as 'Name', 'Phone' as 'Phone', 'State' as 'State', 'State_Name' as 'State_Name', 'Store_Name' as 'Store_Name', 'Vendor' as 'Vendor', 'Zip' as 'Zip';";
		query += "q = limit q 20000;";

        var action = component.get('c.execQuery');
        action.setParams({
            query: query
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var json = response.getReturnValue();
                //console.warn('json: ', json);
                var value = JSON.parse(json);
                //console.warn('value: ', value);
                var results = value.results;
                //console.warn('results: ', results);
                var records = results.records;
                //console.warn('records: ', records);
                helper.createTree(component, records);
            }
            else if (state === 'INCOMPLETE') {
                // do something
            } else if (state === 'ERROR') {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.error('Error message: ' + errors[0].message);
                    }
                } else {
                    console.error('Unknown error');
                }
            }            
        });
        $A.enqueueAction(action);    		
	},

    handleSelect: function(component, event, helper) {
        try {
            var name = event.getParam('name');
            //console.warn('name: ', name);
            var itemMap = component.get('v.itemMap');
            var item = JSON.parse(JSON.stringify(itemMap[name]));
            //console.warn('item: ', item);
            var type = item.type;
            var record = item.record || {};
            
            var datasetName = 'eadx__starbucks_us_locations';
            
            // This will zoom in to the city, which is too far!
            //var field = item.type;
            //var value = record[field];

            var field = 'State';//item.type;
            var value = record[field] || null;
            
            var selection = {datasets:{}};
            
            selection.datasets[datasetName] = [{
                fields: [field],
                selection: [value]
            }];
            
            console.warn('selection: ', selection);
            
            var selectionJSON = JSON.stringify(selection, null, 2);
            //console.warn('selectionJSON: ', selectionJSON);
            
            var dashboardId = component.get('v.dashboardId');
            var developerName = component.get('v.developerName');
        
            var obj = JSON.parse(selectionJSON);
            var selection = JSON.stringify(obj);
            
            var evt = $A.get('e.wave:update');
            var params = {
                value: selection,
                id: developerName,
                type: "dashboard"
            };
            //console.warn('params: ', params);
            evt.setParams(params);
            evt.fire();
            
        } catch (e) {
            console.warn("JSON exception: ", e);
            //helper.showToast(component, "Error", "The selection JSON is invalid JSON, please check and try again.", "error", null);
            
        }
        
    },
    
    handleSelectionChanged: function(component, event, helper) {
        var params = event.getParams();
        //console.warn('params: ', JSON.stringify(params));
        var id = params.id;
        component.set("v.dashboardId", id);
        var payload = params.payload;
        //console.warn("payload: ", payload);
        var row = null;        
        if (payload) {                
            var step = payload.step;
            //console.warn("step: ", step);
            var data = payload.data;
            //console.warn("data: ", data);
            
            var idx = 0;
            data.forEach(function(obj) {
                for (var k in obj) {
	                //console.warn(k + ': ' + obj[k]);
                    
                    if (k === 'Address') {
                        var states = component.get('v.items');
                        //console.warn('states: ', states);
                        var matchedState = null;
                        var matchedCity = null;
                        var matchedLocation = null;                        
                        states.forEach(function(state) {
                            //console.warn('state: ', state);
                            state.expanded = false;
                            state.items.forEach(function(city) {
                                //console.warn('city: ', city);
                                city.expanded = false;
                                city.items.forEach(function(location) {                                    
                                    //console.warn('location: ', location);
                                    if (location.record.Address && location.record.Address === obj[k]) {
                                        matchedState = state;
                                        matchedCity = city;
                                        matchedLocation = location;
                                    }
                                });
                            });
                        });
                        //console.warn('matchedState: ', matchedState);
                        //console.warn('matchedCity: ', matchedCity);
                        //console.warn('matchedLocation: ', matchedLocation);
                        if (matchedState && matchedCity && matchedLocation) {
                           	matchedState.expanded = true;
                            matchedCity.expanded = true;
                            component.set('v.items', states);
                        }
                    }
                }
            });
        }
    }
})