({
	init: function(component, event, helper) {
        console.warn('eadlModalController.init');
        
        return;
        let action = component.get('c.listAnalyticsApps');
        console.warn('action: ', action);
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var folders = response.getReturnValue();
                console.warn('folders: ', folders);
                component.set('v.folders', folders);
            }
            else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var err = response.getError();
                console.error('error: ', err);
            }            
        });
        $A.enqueueAction(action); 		
	}
})