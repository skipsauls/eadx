({
	listFolders: function(component) {
		var sdk = component.find("sdk");
        var context = {apiVersion: "47"};
		var methodName = "listFolders";
        var methodParameters = {
            pageSize: 200,
            sort: 'Name'
        };
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            console.warn('err: ', err, ', data: ', data);
            component.set("v.folders", data.folders);
        }));		
	},
    
	listDashboards: function(component) {
        var folderId = component.get('v.folderId');
        if (folderId !== null && typeof folderId !== 'undefined') {
            var sdk = component.find("sdk");
            var context = {apiVersion: "47"};
            var methodName = "listDashboards";
            var methodParameters = {
                pageSize: 200//,
                //sort: 'Name'
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
	},
    
    describeDashboard: function(component, developerName, callback) {
        var sdk = component.find("sdk");
        
        var context = {apiVersion: "47"};
        var methodName = "describeDashboard";
        var methodParameters = {
            dashboardId: developerName
        };
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            if (err !== null) {
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(err, null);
                } else {
                    return err;
                }
            } else {
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(null, data);
                } else {
                    return data;
                }
            }
        }));
    }
})