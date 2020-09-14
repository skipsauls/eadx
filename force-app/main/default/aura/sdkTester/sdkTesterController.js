({
	getCurrentVersion: function(component, event, helper) {
        var sdk = component.find("sdk");
        var datasetId = component.get('v.datasetId');
        var context = {apiVersion: "46"};
        var methodName = 'describeDataset';
        var methodParameters = { datasetId: datasetId };
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            if (err !== null) {
                console.error("error: ", err);
            } else {
               	component.set('v.currentVersionId', data.currentVersionId);
               	component.set('v.currentVersionUrl', data.currentVersionUrl);
            }
		}));			
	}
})