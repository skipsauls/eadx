({
	test: function(component, event, helper) {
		let sdkWrapper = component.find('sdkWrapper');
        var context = {apiVersion: "46"};
        var methodName = 'listDashboards';
        var methodParameters = {
        };
        sdkWrapper.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            if (err !== null) {
                console.error(methodName + ' error: ', JSON.parse(JSON.stringify(err)));
            } else {
                console.warn(methodName + ' returned: ', JSON.parse(JSON.stringify(data)));
            }
        }));
	}
})