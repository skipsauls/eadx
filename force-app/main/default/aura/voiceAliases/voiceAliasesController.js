({
	init: function(component, event, helper) {
        component.set('v.aliasColumns', helper.aliasColumns);
        helper.listAliases(component, function(err, aliases) {
            console.warn('listAliases returned: ', err, aliases);
            component.set('v.aliases', aliases);
        });
        console.warn('component: ', component);
	},
    
    handleRowAction: function(component, event, helper) {
        var action = event.getParam('action');
        var row = event.getParam('row');
        
        switch (action.name) {
            case 'execute':
                helper.execute(component, row, function(err, results) {
                    console.warn('execute returned: ', err, results);
                });
                break;

                
            default:
                break;
        }
    },

    handleRowSelection: function(component, event, helper) {
		let selectedRows = event.getParam('selectedRows');
		component.set('v.selectedRows', selectedRows);
        helper.getAliasDetails(component, selectedRows[0]);
    },
    
    handleExecuteQuery: function(component, event, helper) {
		let selectedRows = component.get('v.selectedRows');
        let row = selectedRows[0];
        helper.execute(component, row, function(err, results) {
            console.warn('execute returned: ', err, results);
            if (err) {
                
            } else {
                let json = JSON.stringify(results, null, 2);
                component.set('v.aliasQueryResultsJson', json);
            }
        });
    },    
    
})