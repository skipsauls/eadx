({
	setup : function(component, callback) {
        var action = component.get('c.create');
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var config = response.getReturnValue();
                console.warn('config: ', config);
                
                if (typeof callback === 'function') {
                    callback(null, config);
                }
            }
            else if (state === 'INCOMPLETE') {
                // do something
            } else if (state === 'ERROR') {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.error('Error message: ' + errors[0].message);
                        if (typeof callback === 'function') {
                            callback('Error message: ' + errors[0].message, null);
                        }
                    }
                } else {
                    console.error('Unknown error');
                    if (typeof callback === 'function') {
                        callback('Unknown error', null);
                    }
                    
                }
            }            
        });
        $A.enqueueAction(action);        

        
	}
})