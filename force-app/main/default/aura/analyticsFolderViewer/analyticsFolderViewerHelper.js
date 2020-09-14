({
	showFolder: function(component, folderId) {
        var folder = component.get('v.folder');
        //console.warn('folder: ', folder, JSON.stringify(folder, null, 2));
        return;
        var sdk = component.find("sdk");
        
        var context = {apiVersion: "44"};
        var methodName = "getFolder";
        var methodParameters = {
            folderId: folderId
        };
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            //console.warn('getFolder returned: ', err, data);
            if (err !== null) {
                console.error("getFolder error: ", err);
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