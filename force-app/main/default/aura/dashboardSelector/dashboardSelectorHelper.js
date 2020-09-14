({
	listDashboards: function(component) {
        var folderId = component.get('v.folderId');
        if (folderId !== null && typeof folderId !== 'undefined') {
            var sdk = component.find("sdk");
            var context = {apiVersion: "44"};
            var methodName = "listDashboards";
            var methodParameters = {
                pageSize: 200,
                sort: 'Name'
            };
            sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
                console.warn('data: ', data);
                if (err) {
	                console.error('Error: ', err);
                }
                var dashboards = [];
                data.dashboards.forEach(function(dashboard) {
                    if (dashboard.folder.id === folderId) {
                        dashboards.push(dashboard);
                    } 
                });
                component.set("v.dashboards", dashboards);
            }));		
        }
	}
})