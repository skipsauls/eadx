({
    sdkInvokeMethod: function(component, context, methodName, methodParameters, callback) {
        let sdk = component.find("sdk");
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            if (err !== null) {
                console.error("listAssets error: ", err);
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
        
    },

    invokeMethod: function(component, context, methodName, methodParameters, callback) {
        console.warn('lwcSDKBridgeHelper.invokeMethod: ', context, methodName, methodParameters, callback);
        var sdk = component.find("sdk");
        
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            if (callback !== null && typeof callback !== 'undefined') {
                callback(err, data);
            }
        }));
    },
    
    listAssets: function(component, methodName, callback) {
        var sdk = component.find("sdk");
        
        var context = {apiVersion: "46"};
        var methodName = methodName;
        var methodParameters = {
        };
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            if (err !== null) {
                console.error("listAssets error: ", err);
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
    },
    
    listDashboards: function(component, callback) {
        this.listAssets(component, "listDashboards", function(err, data) {
            callback(err, data ? data.dashboards : null); 
        });
    },
    
    listDatasets: function(component, callback) {
        this.listAssets(component, "listDatasets", function(err, data) {
            callback(err, data ? data.datasets : null); 
        });
    },
    
    listLenses: function(component, callback) {
        this.listAssets(component, "listLenses", function(err, data) {
            callback(err, data ? data.lenses : null); 
        });
    },
    
    listFolders: function(component, callback) {
        this.listAssets(component, "listFolders", function(err, data) {
            callback(err, data ? data.folders : null); 
        });
    },
    
    listTemplates: function(component, callback) {
        this.listAssets(component, "listTemplates", function(err, data) {
            callback(err, data ? data.templates : null); 
        });
    }
})