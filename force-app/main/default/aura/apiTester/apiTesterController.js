({
	doTest : function(component, event, helper) {
        var sdk = component.find("sdk");

        var context = {apiVersion: "42"};
        var methodName = 'listDashboards';
        var methodParameters = {
        };
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            if (err !== null) {
                console.error("listAssets error: ", err);
            } else {
		        component.set('v.dashboards', data.dashboards);
                
            }
        }));		
        
	}
})