({
	refresh: function(component, event, helper) {
        helper.listObjects(component, function(err, results) {
            console.warn('helper.listObjects returned: ', err, results);
            if (results) {
                let columns = [];
                let record = results[0];
                for (var key in record) {
                    columns.push({label: key, fieldName: key, type: typeof record[key]});
                }
                console.warn('columns: ', columns);
                component.set('v.columns', columns);
                component.set('v.data', results);
            }
        });		
	}
})