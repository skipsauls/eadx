({
	listFolders: function(component) {
		var sdk = component.find("sdk");
        var context = {apiVersion: "44"};
		var methodName = "listFolders";
        var methodParameters = {
            pageSize: 200,
            sort: 'Name'
        };
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            console.warn('err: ', err, ', data: ', data);
            component.set("v.folders", data.folders);
        }));		
	}
})