({
    countDatasetRows: function(component) {
        let self = this;
        
        self.listDatasets(component, function(err, datasets) {
            console.warn('datasets: ', datasets, ', err: ', err);
            datasets.forEach(function(dataset, i) {
                if (i < 3) {
                    console.warn('dataset: ', dataset);
                    self.describeDataset(component, dataset.id, dataset.currentVersionId, function(err, datasetDetails) {
                        console.warn('datasetDetails: ', JSON.parse(JSON.stringify(datasetDetails)));
                        self.getDatasetExtendedMetadata(component, dataset.id, dataset.currentVersionId, function(err, datasetXMD) {
                            console.warn('datasetXMD: ', JSON.parse(JSON.stringify(datasetXMD))); 
                        });
                    });
                }
            });
        });
    },
    
    getRowCount: function(compnent, dataset, callback) {
        var action = component.get("c.execQuery");
        var self = this;
        
        action.setParams({query: query});
        action.setCallback(this, function(response) {
            console.warn('getRowCount response: ', response);
            var state = response.getState();
            console.warn('state: ', state);
            if (state === "SUCCESS") {
                var val = response.getReturnValue();
                console.warn('val: ', val);
                
            } else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var err = response.getError();
                console.error('error: ', err);
            }            
        });
        $A.enqueueAction(action);        
    },
    
    listAssets: function(component, methodName, callback) {
        var sdk = component.find("sdk");
        
        var context = {apiVersion: "45"};
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
    },
    
    describeDataset: function(component, datasetId, versionId, callback) {
        var sdk = component.find("sdk");
        
        var context = {apiVersion: "45"};
        var methodName = "describeDataset";
        var methodParameters = {
            datasetId: datasetId,
            versionId: versionId
        };
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            //console.warn('describeDataset returned: ', err, data);
            if (err !== null) {
                console.error("describeDataset error: ", err);
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
    
    getDatasetExtendedMetadata: function(component, datasetId, versionId, callback) {
        var sdk = component.find("sdk");
        
        var context = {apiVersion: "45"};
        var methodName = "getDatasetFields";
        var methodParameters = {
            datasetId: datasetId,
            versionId: versionId
        };
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            //console.warn('getDatasetExtendedMetadata returned: ', err, data);
            if (err !== null) {
                console.error("getDatasetExtendedMetadata error: ", err);
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