({
    echoLocal: function(component, text, callback) {
        if (typeof callback === 'function') {
            callback(null, text);
        }
    },
    
    echoRemote: function(component, text, callback) {
        var action = component.get("c.echo");
        action.setParams({text: text});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var val = response.getReturnValue();
                if (typeof callback === 'function') {
                    callback(null, val);
                }                
            }
            else if (state === "INCOMPLETE") {
                
            } else if (state === "ERROR") {
                var errors = response.getError();
                var error = "Unknown error";
                if (errors && errors[0] && errors[0].message) {
                    error = errors[0].message;
                }
                if (typeof callback === 'function') {
                    callback(errors[0].message, null);
                }                
            }            
        });
        $A.enqueueAction(action);
    }
})