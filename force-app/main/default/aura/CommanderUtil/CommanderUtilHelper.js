({
	listCommandActionIntents: function(component, callback) {
        var action = component.get("c.listCommandActionIntents");
        action.setParams({});
        var self = this;
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                let results = response.getReturnValue();
                console.warn('results: ', results);
                if (typeof callback === 'function') {
                    callback(null, results);
                }
            }
            else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var err = response.getError();
                console.error('error: ', err);
                if (typeof callback === 'function') {
                    callback(err, null);
                }
            }            
        });
        $A.enqueueAction(action);		
	}
})