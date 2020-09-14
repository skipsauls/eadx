({
    invokeMethod: function(component, event, helper) {
        let params = event.getParam('arguments');
        let sdk = component.find('sdk');
        sdk.invokeMethod(params.context, params.methodName, params.methodParameters, params.callback);
    },
    
    ping: function(component, event, helper) {
        let params = event.getParam('arguments');
        if (typeof params.callback === 'function') {
            params.callback('pong');
        }
    }
})