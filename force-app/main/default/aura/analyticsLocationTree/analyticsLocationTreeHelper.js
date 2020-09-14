({
    createTree: function(component, records) {
        var itemMap = {};
        var items = [];
        var states = {};
        var state = null;
        var city = null;
        var location = null;
        
        var none = {
            label: 'None',
            name: 'none',
            type: 'None',
            expanded: false,
            items: null,
        };
        items.push(none);
        itemMap['none'] = none;
        
        records.forEach(function(record, idx) {
            //console.warn('record: ', record);
            state = states[record.State];
            if (state === null || typeof state === 'undefined') {
                state = {
                    label: record.State,
                    name: 'state_' + idx,
                    type: 'State',
                    record: record,
                    expanded: false,
                    items: [],
                    cities: {}
                };
                items.push(state);
                itemMap['state_' + idx] = state;
                states[record.State] = state;
            }
            city = state.cities[record.City];
            if (city === null || typeof city === 'undefined') {
                city = {
                    label: record.City,
                    name: 'city_' + idx,
                    type: 'City',
                    record: record,                    
                    expanded: false,
                    items: [],
                    locations: {}
                };
                state.items.push(city);
                state.cities[record.City] = city;
                itemMap['city_' + idx] = city;
            }
            location = city.locations[record.Address];
            if (location === null || typeof location === 'undefined') {
                location = {
                    label: record.Address + ',' + record.City + ', ' + record.State + ' ' + record.Zip,
                    name: 'location_' + idx,
                    type: 'Location',
                    record: record,
                    expanded: false,
                    items: []                             	   
                };
                city.items.push(location);
                city.locations[record.Location] = location;
                itemMap['location_' + idx] = location;
            }
        });
        
        component.set('v.itemMap', itemMap);
        component.set('v.items', items);
        
    }
})