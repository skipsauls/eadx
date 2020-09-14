({
    // Maps EA types to those for lightning:datatable
    typeMap: {
        "dimension": "text",
        "measure": "number",
        "numeric": "number",
        "date": "date"
    },
    
    setup: function(component) {
        console.warn("--------------- setup");
        this.refresh(component);
    },
    
    sortData: function (component, fieldName, sortDirection) {
        console.warn("sortData: ", component, fieldName, sortDirection);
        var data = component.get("v.results");
        var reverse = sortDirection !== 'asc';
        console.warn("reverse: ", reverse);
        //sorts the rows based on the column header that's clicked
        data.sort(this.sortBy(fieldName, reverse))
        component.set("v.results", data);
    },
    
    sortBy: function (field, reverse, primer) {
        console.warn("sortBy: ", field, reverse, primer);
        var key = primer ?
            function(x) {return primer(x[field])} :
        function(x) {return x[field]};
        //checks if the two rows should switch places
        reverse = !reverse ? 1 : -1;
        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        }
    },
    
    refresh: function(component, event, helper) {
        var self = this;
        this.listLenses(component, function(err, lenses) {
            //console.warn('listLenses returned: ', err, lenses);
            
            if (lenses !== null && typeof lenses !== 'undefined') {
                
                component.set('v.lenses', lenses);
                
                var c = 'allowPreview,assetSharingUrl,createdBy,createdDate,dataset,files,filesUrl,folder,id,label,lastAccessedDate,lastModifiedBy,lastModifiedDate,name,namespace,permissions,refreshDate,type,url,visualizationType';
                
                var actions = [
                    { label: 'Show details', name: 'show_details' },
                    { label: 'Run Query', name: 'run_query' }
                ];
                
                var columns = [
                    {label: 'Label', fieldName: 'label', type: 'text'},
                    {label: 'Id', fieldName: 'id', type: 'text'},
                    {label: 'Namespace', fieldName: 'namespace', type: 'text'},
                    {label: 'Name', fieldName: 'name', type: 'text'},
                    {label: 'Visualization', fieldName: 'visualizationType', type: 'text'},
                    {type: 'action', typeAttributes: {rowActions: actions}}
                ];
                
                var data = lenses;
                
                component.set('v.columns', columns);
                component.set('v.lenses', data);
            }
            
        });
    },
    
    listLenses: function(component, callback) {
        var sdk = component.find("sdk");
        
        var context = {apiVersion: "44"};
        var methodName = "listLenses";
        var methodParameters = {
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
                    callback(null, data.lenses);
                } else {
                    return data.lenses;
                }
            }
        }));		
    },
    
    getLensDetails: function(component, lens, callback) {
        console.warn('getLensDetails: ', lens);
        var sdk = component.find("sdk");
        
        var context = {apiVersion: "44"};
        var methodName = "describeLens";
        var methodParameters = {
            lensId: lens.id
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
            console.warn('getDatasetFields returned: ', err, data);
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
        console.warn('fields: ', fields);
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
    },
    
    
    handleAction: function(component, action, lens) {
        console.warn('handleAction: ', action, lens);
        var self = this;
        if (action.name === 'show_details') {
            self.getLensDetails(component, lens, function(err, lensDetails) {
                console.warn('getLensDetails returned: ', err, lensDetails);
                console.warn('JSON: ', JSON.stringify(lendDetails, null , 2));
            });
        } else if (action.name === 'run_query') {
            component.set('v.saql', null);
            self.getLensDetails(component, lens, function(err, lensDetails) {
                console.warn('getLensDetails returned: ', err, lensDetails);

                var datasetId = lensDetails.datasets ? lensDetails.datasets[0].id : lensDetails.dataset.id;
				self.describeDataset(component, datasetId, function(err, datasetDetails) {
					console.warn('describeDataset returned: ', datasetDetails);
                    
                    self.getDatasetFields(component, datasetDetails.id, datasetDetails.currentVersionId, function(err, xmd) {
                        console.warn('getDatasetFields returned: ', err, xmd);
                        component.set("v.xmd", xmd);
                        //console.warn(JSON.stringify(xmd, null, 2));
                        var fieldMap = self.parseXMD(component, xmd);
                        console.warn('fieldMap: ', fieldMap);

                        component.set("v.fieldMap", fieldMap);
	                    var steps = lensDetails.state.steps;

                        if (steps.aggregateflex) {
                            self.getLensSAQL(component, lens, $A.getCallback(function(err, saql) {
                                console.warn('getLensSQAL returned: ', err, saql);
                                component.set('v.saql', saql);
                            }));                    
                        } else if (steps.saql && steps.saql.query) {
                            var saql = steps.saql.query;
                            console.warn('saql: ', saql);
                            var datasetId = lensDetails.dataset.id;
                            var namespace = datasetDetails.namespace;
                            var name = datasetDetails.name;
                            var id = datasetDetails.id;
                            var currentVersionId = datasetDetails.currentVersionId;
                            var exp = new RegExp(namespace + '__' + name, 'g');
                            saql = saql.replace(exp, id + '/' + currentVersionId);
                            //console.warn('saql: ', saql);
                            component.set('v.saql', saql);
                        }
                        
                    });
    
            	});
        	});
        }
    }
    
    
})