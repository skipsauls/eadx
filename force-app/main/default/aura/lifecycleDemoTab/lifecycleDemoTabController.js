({
    init: function(component, event, helper) {
        let interval = setInterval($A.getCallback(function() {
            $A.get("e.wave:discover").fire();
        }), 300);
        component.set('v.interval', interval);
    },
    
    handleDiscoverResponse: function(component, event, helper) {
        let isLoaded = event.getParam('isLoaded');
        component.set('v.isLoaded', isLoaded);
        if (isLoaded === true) {
            let interval = component.get('v.interval');
            clearInterval(interval);
        }
    }
})