({
	listDashboards: function(component) {
        console.warn("listDashboards");
		var sdk = component.find("sdk");
        var context = {apiVersion: "41"};
		var methodName = "listDashboards";
        var methodParameters = {};
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            console.warn("err: ", err);
            console.warn("data: ", data);
            component.set("v.dashboards", data.dashboards);
        }));		
	}
})