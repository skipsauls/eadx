({
	test: function(component, event, helper) {
        var sdk = component.find("sdk");
        var context = {apiVersion: "46"};
        var methodName = 'listFolders';
        var methodParameters = {
            q: 'My_Demo_App',
            sort: 'Name'
        };
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            if (err !== null) {
                console.error("error: ", JSON.stringify(err, null, 2));
            } else {
                console.warn('data: ', JSON.stringify(data, null, 2));
            }
        }));		
	}
})