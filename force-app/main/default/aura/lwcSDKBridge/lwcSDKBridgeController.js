({
    init: function(component, event, helper) {
        let sdkWrapper = {
            invokeMethod: $A.getCallback(function(context, methodName, methodParameters, callback) {
                let sdk = component.find("sdk");
                sdk.invokeMethod(context, methodName, methodParameters, function(err, data) {
                    if (callback !== null && typeof callback === 'function') {
                        callback(err, data);
                    }
                });
            })
        };
        component.set('v.sdkReference', sdkWrapper);
    }
})