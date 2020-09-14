({
	handleElementChange: function(component, event, helper) {
        let element = component.get('v.element');
        if (element && element.type) {
	        component.set('v.clas', element.type.toLowerCase());
        }
	}
})