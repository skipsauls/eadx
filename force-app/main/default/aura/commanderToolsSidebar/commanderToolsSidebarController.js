({
	init: function(component, event, helper) {
        let topic = component.get('v.topic');
		component.set('v.items', helper.items[topic]);
	}
})