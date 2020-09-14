({
    showLens: function(component, lensId) {
        
        var self = this;
        
        if (lensId !== null) {
            component.set('v.saql', null);
            self.getLensDetails(component, lensId, function(err, lensDetails) {
                //console.warn('getLensDetails returned: ', err, lensDetails);

                var datasetId = lensDetails.datasets ? lensDetails.datasets[0].id : lensDetails.dataset.id;
				self.describeDataset(component, datasetId, function(err, datasetDetails) {
					//console.warn('describeDataset returned: ', datasetDetails);
                    
                    self.getDatasetFields(component, datasetDetails.id, datasetDetails.currentVersionId, function(err, xmd) {
                        //console.warn('getDatasetFields returned: ', err, xmd);
                        component.set("v.xmd", xmd);
                        //console.warn(JSON.stringify(xmd, null, 2));
                        var fieldMap = self.parseXMD(component, xmd);
                        //console.warn('fieldMap: ', fieldMap);

                        component.set("v.fieldMap", fieldMap);
	                    var steps = lensDetails.state.steps;

                        if (steps.aggregateflex) {
                            self.getLensSAQL(component, lensDetails, $A.getCallback(function(err, saql) {
                                //console.warn('getLensSQAL returned: ', err, saql);
                                component.set('v.saql', saql);
	                            component.set('v.editSaql', saql);
                            }));                    
                        } else if (steps.saql && steps.saql.query) {
                            var saql = steps.saql.query;
                            //console.warn('saql: ', saql);
                            var dataset = lensDetails.datasets ? lensDetails.datasets[0] : lensDetails.dataset;
                            var datasetId = dataset.id;
                            var namespace = datasetDetails.namespace;
                            var name = datasetDetails.name;
                            var id = datasetDetails.id;
                            var currentVersionId = datasetDetails.currentVersionId;
                            var exp = new RegExp(namespace + '__' + name, 'g');
                            saql = saql.replace(exp, id + '/' + currentVersionId);
                            //console.warn('saql: ', saql);
                            component.set('v.saql', saql);
                            component.set('v.editSaql', saql);
                        }
                        
                    });
    
            	});
        	});
        }
    },
    
    getLensDetails: function(component, lensId, callback) {
        //console.warn('getLensDetails: ', lensId);
        var sdk = component.find("sdk");
        
        var context = {apiVersion: "44"};
        var methodName = "describeLens";
        var methodParameters = {
            lensId: lensId
        };
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            if (err !== null) {
                console.error("listLenses error: ", err);
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
        var sdk = component.find("sdk");
        
        var context = {apiVersion: "44"};
        var methodName = "getDatasetFields";
        var methodParameters = {
            datasetId: datasetId,
            versionId: versionId
        };
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
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
    
    parseXMD: function(component, xmd) {
        var fields = {};
        
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
        var sdk = component.find("sdk");
        
        var context = {apiVersion: "44"};
        var methodName = "describeDataset";
        var methodParameters = {
            datasetId: datasetId
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
    
    getLensSAQL: function(component, lens, callback) {
        console.warn('getLensSAQL: ', lens);
        var sdk = component.find("sdk");
        
        var context = {apiVersion: "44"};
        var methodName = "convertShortFormToSAQL";
        var methodParameters = {
            lensId: lens.id
        };
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            if (err !== null) {
                console.error("convertShortFormToSAQL error: ", err);
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