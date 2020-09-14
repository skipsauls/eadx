({
    generateSAQL: function(component) {
        
        //console.warn('analyticsDatasetViewerHelper.generateSAQL')
        var autoExecute = component.get('v.autoExecute');
        var datasetDetails = component.get('v.datasetDetails');
        var fieldMap = component.get('v.fieldMap');
        var fieldList = component.get('v.fields');
        var xmd = component.get('v.xmd');
        
        //console.warn('datasetDetails: ', datasetDetails);
        //console.warn('fieldMap: ', fieldMap);
        //console.warn('xmd: ', xmd);
        
        if (datasetDetails && fieldMap && fieldList && xmd) {
            
            var saql = '';
            saql += 'q = load "' + datasetDetails.id + '/' + datasetDetails.currentVersionId + '";\n';
            
            var groups = [];
            if (groups && groups.length > 0) {
                saql += 'q = group q by (';
                groups.forEach(function(group) {
                    saql += "'" + group + "'";
                });
                saql += ');\n';
            }
            
            var field = null;
            var fieldDetails = null;
            
            var delim = ' ';
            saql += 'q = foreach q generate'
            var i = 0;
            var label = null;
            var name = null;
            fieldList.forEach(function(field) {
                if (field.selected === true) {
                    
                    fieldDetails = fieldMap[field.name][field.type];

                    if (fieldDetails.field) {
                        name = fieldDetails.field;
                        label = fieldDetails.label;
                    } else if (fieldDetails.fields) {
                        for (var key in fieldDetails.fields) {
                            if (fieldDetails.fields[key] === field.name) {
		                        name = field.name; //fieldDetails.fields[fieldDetails.name];
        		                label = fieldDetails.label + ' (' + key + ')';                                
                            }
                        }
                    }
	                saql += delim + "'" + name + "' as '" + label + "'";
    	            delim = ', ';            
                }
            });
            
            saql += ";\n";
            
            var limit = component.get('v.limit');
            
            saql += "q = limit q " + limit + ";";
            
            //console.warn('saql: ', saql);
            component.set('v.editSaql', saql);
            if (autoExecute === true) {
	            component.set('v.saql', saql);            
            }
        
        }

    },

    
    showDataset: function(component, datasetId) {
        
        var self = this;
        
        if (datasetId !== null) {
            component.set('v.saql', null);
            self.describeDataset(component, datasetId, function(err, datasetDetails) {
                //console.warn('describeDataset returned: ', datasetDetails);
                component.set('v.datasetDetails', datasetDetails);
                
                self.getDatasetFields(component, datasetDetails.id, datasetDetails.currentVersionId, function(err, xmd) {
                    //console.warn('getDatasetFields returned: ', err, xmd);
                    component.set("v.xmd", xmd);
                    //console.warn(JSON.stringify(xmd, null, 2));
                    var fieldMap = self.parseXMD(component, xmd);
                    //console.warn('fieldMap: ', fieldMap);
                    
                    component.set("v.fieldMap", fieldMap);

                    var fieldList = [];
                    var shownFields = {};
                    
					var field = null;
                    var fieldDetails = null;
                    
                    var max = 10;
                    
                    // First use fields that have labels
                    var i = 0;
                    for (var name in fieldMap) {
                        field = fieldMap[name];

                        fieldDetails = field[field.type];
                        //console.warn(name, fieldDetails.label, field.type);
                        if (field.type === 'dimension' && fieldDetails.showInExplorer === true) {
                            fieldList.push({
                                name: name,
                                label: fieldDetails.label,
                                type: field.type,
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
                                selected: i < max,
                                hasLabel: fieldDetails.label !== name
                            });
                            if (fieldDetails.label !== name) {
	                            i++;
                            }
                        }
                    }

                    component.set('v.fields', fieldList);
                    
                    self.generateSAQL(component);

                });
                
            });
        }
    },
    
    getDatasetFields: function(component, datasetId, versionId, callback) {
        var sdk = component.find("sdk");
        
        var context = {apiVersion: "47"};
        var methodName = "getDatasetFields";
        var methodParameters = {
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
        
        var context = {apiVersion: "45"};
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
    }
})