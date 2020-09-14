({
	init: function(component, event, helper) {
		component.set('v.actionTypes', helper.actionTypes);
        helper.getCommandTargets(component, function(err, results) {
            console.warn('getCommandTargets returned: ', results);
            if (err) {
                console.error('getCommandTargets error: ', err);
            } else {
                let commandTargets = [];
                results[0].forEach(function(res) {
                    console.warn('res: ', res);
                    res.DeveloperName = (res.NamespacePrefix ? res.NamespacePrefix + '__' : '') + res.Name;
                    commandTargets.push(res);
                });
				component.set('v.commandTargets', commandTargets);
            }
        });
	},
    
    handleLabelBlur: function(component, event, helper) {
        let action = component.get('v.action');
        if (action.name === null || typeof action.name === 'undefined' || action.name === '') {
            action.name = action.label.toLowerCase().replace(new RegExp(' ', 'g'), '_');
	        component.set('v.action', action);
        }
  }
})