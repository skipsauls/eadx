({
    init: function(component, event, helper) {
    	var child = component.find('child');
        child.set('v.parent', component);
        child.set('v.callback', function(msg, val, isFoo) {
            console.warn('callback: ', msg, val, isFoo); 
        });
    },
    
	handleCallback: function(component, event, helper) {
        console.warn('parent.handleCallback: ', event.getParam('arguments'));
        console.warn('params: ', params);
	}
})