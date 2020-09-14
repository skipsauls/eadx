({
    listLenses: function(component, callback) {
        var sdk = component.find("sdk");
        
        var context = {apiVersion: "42"};
        var methodName = "listLenses";
        var methodParameters = {
        };
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            if (err !== null) {
                console.error("listLenses error: ", err);
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(err, null);
                } else {
                    return err;
                }
            } else {
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(null, data.lenses);
                } else {
                    return data.lenses;
                }
            }
        }));		
    }
})