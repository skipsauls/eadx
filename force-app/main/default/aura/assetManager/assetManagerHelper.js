({
    assetTypeSingularMap: {
        'dashboards': 'dashboard',
        'lenses': 'lens',
        'datasets': 'dataset',
        'dataflows': 'dataflow',
        'stories': 'story',
        'recipes': 'recipe',
        'folders': 'folder',
        'templates': 'template',
        'fields': 'field',
        'connectors': 'connector'
    },

    assetTypePluralMap: {
        'dashboard': 'dashboards',
        'lens': 'lenses',
        'dataset': 'datasets',
        'dataflow': 'dataflows',
        'story': 'stories',
        'recipe': 'recipes',
        'folder': 'folders',
        'template': 'templates',
        'field': 'fields',
        'connector': 'connectors'
    },
    
    getAssetTypeUrl: function(component, type) {
        let self = this;
        let pluralType = self.assetTypePluralMap[type] || type;
        let waveUrls = component.get('v.waveUrls');
    	let url = waveUrls[pluralType];
        return url;
    },
    
    getAssetByType: function(component, id, type, callback) {
        let self = this;
        let proxy = component.find('proxy');
        
        let url = self.getAssetTypeUrl(component, type) + '/' + id;
        let config = null;
        
        proxy.exec(url, 'GET', config, function(response) {
            console.warn('getAssetByType returned: ', response);
            if (callback !== null && typeof callback !== 'undefined') {
                callback(null, response.body);
            } else {
                return null;
            }            
        });
    },
    
   	getDatasetDetails: function(component, dataset, callback) {
        console.warn('getDatasetDetails: ', dataset);
        var self = this;
        
        if (dataset !== null) {
            
            let t1 = Date.now();
            self.getDatasetFields(component, dataset.id, dataset.currentVersionId, function(err, xmd) {                
                let t2 = Date.now();
                console.warn('getDatasetFields timing: ', (t2 - t1));
                console.warn('getDatasetFields returned: ', err, xmd);
                //console.warn(JSON.stringify(xmd, null, 2));

                var datasetDetails = {
                    xmd: xmd
                };
                
                var connector = xmd.dataset.connector;
                //console.warn('connector: ', connector);
                var fullyQualifiedName = xmd.dataset.fullyQualifiedName;
                //console.warn('fullyQualifiedName: ', fullyQualifiedName);
                
                var fieldMap = self.parseXMD(component, xmd);
                //console.warn('fieldMap: ', fieldMap);
                
                datasetDetails.fieldMap = fieldMap;
                
                var fieldList = [];
                var shownFields = {};
                
                var field = null;
                var fieldDetails = null;
                
                var max = 10;
                
                // First use fields that have labels
                var i = 0;
                for (var name in fieldMap) {
                    field = fieldMap[name];
                    //console.warn('field: ', field);
                    
                    fieldDetails = field[field.type];
                    //console.warn('fieldDetails: ', fieldDetails);
                    //console.warn(name, fieldDetails.label, field.type);
                    if (field.type === 'dimension' && fieldDetails.showInExplorer === true) {
                        fieldList.push({
                            name: name,
                            label: fieldDetails.label,
                            type: field.type,
                            field: fieldDetails.fields ? fieldDetails.fields.fullField : fieldDetails.field,
                            fullyQualifiedName: fieldDetails.fullyQualifiedName,
                            selected: i < max && fieldDetails.label !== name,
                            hasLabel: fieldDetails.label !== name
                        });
                        if (fieldDetails.label !== name) {
                            shownFields[name] = 1;
                            i++;
                        }
                    }
                }
                
                // Add the rest
                for (var name in fieldMap) {
                    field = fieldMap[name];
                    fieldDetails = field[field.type];
                    if (fieldDetails.showInExplorer === true && shownFields[name] !== 1) {
                        fieldList.push({
                            name: name,
                            label: fieldDetails.label,
                            type: field.type,
                            field: fieldDetails.fields ? fieldDetails.fields.fullField : fieldDetails.field,
                            fullyQualifiedName: fieldDetails.fullyQualifiedName,
                            selected: i < max,
                            hasLabel: fieldDetails.label !== name
                        });
                        if (fieldDetails.label !== name) {
                            i++;
                        }
                    }
                }
                
                datasetDetails.fieldList = fieldList;
                
                //console.warn('calling callback with datasetDetails: ', datasetDetails);
                if (typeof callback === 'function') {
                    callback(null, datasetDetails);
                }
                
            });
        }
    },
    
    getDatasetFields: function(component, datasetId, versionId, callback) {
        let sdk = component.find("sdk");
        let apiVersion = component.get('v.apiVersion');
        let context = {apiVersion: apiVersion.version};
       	let methodName = "getDatasetFields";
        let methodParameters = {
            datasetId: datasetId,
            versionId: versionId
        };
        let t1 = Date.now();
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            let t2 = Date.now();
            console.warn('sdk.invokeMethod getDatasetFields timing: ', (t2 - t1));
            //console.warn('getDatasetFields returned: ', err, data);
            if (err !== null) {
                console.error("getDatasetFields error: ", err);
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
    
    getDatasetFields: function(component, datasetId, versionId, callback) {
        let self = this;
        console.warn('getDatasetFields: ', datasetId, versionId);
        let proxy = component.find('proxy');
        
        console.warn('proxy: ', proxy);
        
        let config = null;
        
        console.warn('proxy.get(\'v.ready\'): ', proxy.get('v.ready'));
        
        if (proxy.get('v.ready') !== true) {
            console.warn('calling setTimeout');
            setTimeout(function() {
                self.getDatasetFields(component, url, callback);
            }, 500);
        } else {
            let url = self.getAssetTypeUrl(component, 'datasets') + '/' + datasetId + '/versions/' + versionId + '/xmds'; 
            console.warn('url:" ', url);                
            proxy.exec(url, 'GET', config, function(response) {
                console.warn('xmds response: ', response);
                if (response.body && response.body.xmds) {
                    let xmdMainUrl = null;
                    response.body.xmds.forEach(function(xmd) {
                        if (xmd.type === 'main') {
                          	xmdMainUrl = xmd.url;  
                        };
                    });
                    console.warn('xmdMainUrl: ', xmdMainUrl);
                    if (xmdMainUrl !== null && typeof xmdMainUrl !== 'undefined') {
                        proxy.exec(xmdMainUrl, 'GET', config, function(resp) {
                            let xmdMain = resp.body;
                            console.warn('get xmdMain: ', xmdMain);
                            if (callback !== null && typeof callback !== 'undefined') {
                                callback(null, xmdMain);
                            } else {
                                return null;
                            }            
                        });
                    } else {
		                if (callback !== null && typeof callback !== 'undefined') {
                            callback({err: 'NO_XMD_MAIN', msg: 'No XMD Main'}, null);
                        }            
                    }
                } else {
                    if (callback !== null && typeof callback !== 'undefined') {
    	                callback({err: 'NO_XMDS', msg: 'No XMDs'}, null);
                    }
                }
            });
        }        
    },
    
    parseXMD: function(component, xmd) {
        let fields = {};
        
        if (xmd !== null && typeof xmd !== 'undefined') {
            
            xmd.dimensions.forEach(function(dimension) {
                //console.warn('dimension: ', dimension);
                fields[dimension.field] = {type: "dimension", dimension: dimension};
            });
            xmd.derivedDimensions.forEach(function(dimension) {
                //console.warn('derived dimension: ', dimension);
                fields[dimension.field] = {type: "derivedDimension", derivedDimension: dimension};
            });
            xmd.measures.forEach(function(measure) {
                //console.warn('measure: ', measure);
                fields[measure.field] = {type: "measure", measure: measure};
            });
            xmd.derivedMeasures.forEach(function(measure) {
                //console.warn('derived measure: ', measure);
                fields[measure.field] = {type: "derivedMeasure", derivedMeasure: measure};
            });
            xmd.dates.forEach(function(date) {
                //console.warn('date: ', date);
                for (var key in date.fields) {
                    fields[date.fields[key]] = {type: "date", name: key, date: date}; 
                }
            });
        }
        //console.warn('fields: ', fields);
        return fields;
    },
    
    describeDataset: function(component, datasetId, callback) {
        //console.warn('describeDataset: ', datasetId);
        let sdk = component.find("sdk");
        let apiVersion = component.get('v.apiVersion');
        let context = {apiVersion: apiVersion.version};        
        let methodName = "describeDataset";
        let methodParameters = {
            datasetId: datasetId
        };
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            //console.warn('describeDataset returned: ', err, data);
            if (err !== null) {
                //console.error("describeDataset error: ", err);
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
    
    describeDashboard: function(component, dashboardId, callback) {
        let sdk = component.find("sdk");
        let apiVersion = component.get('v.apiVersion');
        let context = {apiVersion: apiVersion.version};
        let methodName = "describeDashboard";
        let methodParameters = {
            dashboardId: dashboardId
        };
        //console.warn('calling sdk.invokeMethod: ', context, methodName, methodParameters);
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            //console.warn('describeDashboard returned: ', err, data)
;            if (err !== null) {
                //console.error("describeDashboard error: ", err);
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
    
    listAssets: function(component, methodName, methodParameters, callback) {
        let sdk = component.find("sdk");
        let apiVersion = component.get('v.apiVersion');
        let context = {apiVersion: apiVersion.version};
        console.warn('calling sdk.invokeMethod: ', methodName, methodParameters);
        methodParameters = methodParameters || {};
        methodParameters.pageSize = methodParameters.pageSize || 100;
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

    getReplicatedDatasetFields: function(component, url, callback) {
        let self = this;
        let proxy = component.find('proxy');
        
        let config = null;
        
        if (proxy.get('v.ready') !== true) {
            setTimeout(function() {
                self.getReplicatedDatasetFields(component, url, callback);
            }, 500);
        } else {
        
            proxy.exec(url, 'GET', config, function(response) {
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(null, response.body.fields);
                } else {
                    return null;
                }            
            });
        }        
    },
    
    listReplicatedDatasets: function(component, callback) {
        let self = this;
        let proxy = component.find('proxy');
        let url = self.getAssetTypeUrl(component, 'replicatedDatasets');
        let config = null;
        
        if (proxy.get('v.ready') !== true) {
            setTimeout(function() {
                self.listReplicatedDatasets(component, callback);
            }, 500);
        } else {
        
            proxy.exec(url, 'GET', config, function(response) {
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(null, response.body.replicatedDatasets);
                } else {
                    return null;
                }            
            });
        }
    },
    
    listDatasets: function(component, callback) {
        let self = this;
        let proxy = component.find('proxy');
        let url = self.getAssetTypeUrl(component, 'datasets');
        let config = null;
        
        console.warn('url: ', url);
        
        if (proxy.get('v.ready') !== true) {
            setTimeout(function() {
                self.listDatasets(component, callback);
            }, 500);
        } else {
        
            console.warn('exec: ', url, config);
            proxy.exec(url, 'GET', config, function(response) {
                console.warn('response: ', response);
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(null, response.body.datasets);
                } else {
                    return null;
                }            
            });
        }
    },
    

/*    
    loadRecipefile: function(component, url, callback) {

        var options = {
            headers: {
                "Accept": "image/png",
                "Authorization": token_type + " " + token
            },
            decoding: 'binary'
    
        };
    
        opts = options;
        opts.url = url;
    
        rest.get(url, options).on('complete', function(result, response) {
            
            var buffer = new Buffer(result, 'binary');
            //_imageData[type + '_' + id] = buffer;
    
            if (typeof next === 'function') {
                next(buffer);
            }
        });
    },
*/
    
    getRecipeFile: function(component, url, callback) {
        let self = this;
        let proxy = component.find('proxy');
        let config = {
            headers: {
                "Accept": "text/javascript"
            },
            decoding: 'binary'
        };
        
        if (proxy.get('v.ready') !== true) {
            setTimeout(function() {
                self.getRecipeFile(component, url, callback);
            }, 500);
        } else {
        
            proxy.exec(url, 'GET', config, function(response) {
                console.warn('GET recipe file returned: ', response);
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(null, response.body);
                } else {
                    return null;
                }            
            });
        }        
    },
    
    listRecipes: function(component, callback) {
        let self = this;
        let proxy = component.find('proxy');
        let url = self.getAssetTypeUrl(component, 'recipes');
        let config = null;
        
        if (proxy.get('v.ready') !== true) {
            setTimeout(function() {
                self.listRecipes(component, callback);
            }, 500);
        } else {
        
            proxy.exec(url, 'GET', config, function(response) {
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(null, response.body.recipes);
                } else {
                    return null;
                }            
            });
        }
    },
    
    listDataflows: function(component, callback) {
        let self = this;
        let proxy = component.find('proxy');
        let url = self.getAssetTypeUrl(component, 'dataflows');
        let config = null;

        if (proxy.get('v.ready') !== true) {
            setTimeout(function() {
                self.listDataflows(component, callback);
            }, 500);
        } else {
        
            proxy.exec(url, 'GET', config, function(response) {
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(null, response.body.dataflows);
                } else {
                    return null;
                }            
            });
        }
    },
    
    listDashboards: function(component, methodParameters, callback) {
        this.listAssets(component, "listDashboards", methodParameters, function(err, data) {
            callback(err, data ? data.dashboards : null); 
        });
    },
    
    describeDashboard: function(component, dashboardId, callback) {
        var sdk = component.find("sdk");
        
        var context = {apiVersion: "46"};
        var methodName = "describeDashboard";
        var methodParameters = {
            dashboardId: dashboardId
        };

        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            if (err !== null) {
                console.error("describeDashboard error: ", err);
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
    
/*    
    listDatasets: function(component, methodParameters, callback) {
        this.listAssets(component, "listDatasets", methodParameters, function(err, data) {
            callback(err, data ? data.datasets : null); 
        });
    },
*/    
    listLenses: function(component, methodParameters, callback) {
        this.listAssets(component, "listLenses", methodParameters, function(err, data) {
            callback(err, data ? data.lenses : null); 
        });
    },
    
    listFolders: function(component, methodParameters, callback) {
        this.listAssets(component, "listFolders", methodParameters, function(err, data) {
            callback(err, data ? data.folders : null); 
        });
    },
    
    listTemplates: function(component, methodParameters, callback) {
        this.listAssets(component, "listTemplates", methodParameters, function(err, data) {
            callback(err, data ? data.templates : null); 
        });
    }        
})