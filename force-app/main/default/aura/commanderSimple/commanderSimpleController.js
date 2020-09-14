({
	handleExecute: function(component, event, helper) {
		let text = component.get('v.text');

        helper.interpret(component, text, function(err, result) {            
            if (err) {
                console.error('helper.interpret error: ', err);
            } else {
                console.warn('result: ', result);
                let action = result.actions[0];
                if (action) {
                    console.warn('action: ', action);
                    let actionJSON = JSON.stringify(action, null, 2);
                    component.set('v.actionJSON', actionJSON);
                    helper.invoke(component, action, function(err, result) {
                        if (err) {
                            console.error('helper.execute error: ', error);
                        } else {
                            
                        }
                    });
                } else {
                    console.error('No actions returned');
                }
            }
        });
	},
    
	handleSelectItem: function(component, event, helper) {
        let responseItems = component.get('v.responseItems');
		let selectedItemName = component.get('v.selectedItemName');
        responseItems.forEach(function(item) {
            if (item.name === selectedItemName) {
                let itemJSON = JSON.stringify(item, null, 2);
                component.set('v.selectedItemJSON', itemJSON);
            }
        });
    }
})