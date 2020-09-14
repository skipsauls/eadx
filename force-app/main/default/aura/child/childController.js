({
	setCallback: function(component, event, helper) {
		let callback = event.getParam('callback');
        component.set('v.callback', callback);
	},
    
	callParent: function(component, event, helper) {
		let parent = component.get('v.parent');
        console.warn('parent: ', parent);
        let foo = parent.get('v.foo');
        console.warn('foo: ', foo);
        
		let callback = component.get('v.callback');
        //console.warn('callback: ', callback);
        callback('from the child', 1234, true);
	}
})