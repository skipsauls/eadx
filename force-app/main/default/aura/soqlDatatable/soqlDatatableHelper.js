({
    
    camelCaseToSpace: function(str) {
		var camelCaseRegex = new RegExp('(?<!^)(?=[A-Z])', 'g');
		return str.replace(camelCaseRegex, ' ')    
    },
    
    listObjects: function(component) {
        //console.warn('officeDatatableHelper.listObjects');
        var self = this;
        
        var objectApiName = component.get('v.objectApiName');
       	//console.warn('objectApiName: ', objectApiName, typeof objectApiName);

        var fields = component.get('v.fields');
       	//console.warn('fields: ', fields, typeof fields);
        
        var fieldArray = fields.split(',');
        var fieldMap = {};
        fieldArray.forEach(function(field) {
            //console.warn('field: ', field);
            fieldMap[field] = 1;
        });

        //console.warn('fieldMap: ', fieldMap);
        
        var rows = component.get('v.rows');
       	//console.warn('rows: ', rows, typeof rows);
        
        var query = 'SELECT ' + fields;
        query += ' FROM ' + objectApiName;
        
        var selectedSteps = component.get('v.selectedSteps');
        
        var selectedFieldsMap = component.get('v.selectedFields') || {};
        
        var whereClause = '';
        var delim = ' WHERE (';
        var stepCount = 0;
        
        for (var stepName in selectedSteps) {
            //console.warn('stepName: ', stepName);
            stepCount = selectedSteps[stepName];
            //console.warn('stepCount: ', stepCount);
            if (stepCount > 0) {
		        var selectedFields = selectedFieldsMap[stepName] || {};
                //console.warn('selectedFields: ', selectedFields);
                if (selectedFields) {            
                    var fieldValues = null;
                    for (var fieldName in selectedFields) {
                        //console.warn('fieldName: ', fieldName);
                        fieldValues = selectedFields[fieldName];
                        for (var fieldValue in fieldValues) {
                            //console.warn('fieldValue: ', fieldValue);
                            whereClause += delim + " " + fieldName + " = '" + fieldValue + "'";
                            delim = ' OR';
                        }
                        delim = ' AND (';
                    }
                    if (whereClause.length > 0) {
                        whereClause += ')';
                    }
                }    
                
	            
            }
            
            
            //console.warn('whereClause: ', whereClause);
            
        }

        query += whereClause;

        if (rows && rows > 0) {
            query += ' LIMIT ' + rows;
        }
        
        //console.warn('query: ', query);

        var action = component.get('c.execQuery');
        action.setParams({query: query, fields: fieldArray});
        action.setCallback(this, function(response) {
            var state = response.getState();
            //console.warn('state: ', state);
            if (state === "SUCCESS") {
                var records = response.getReturnValue();
                //console.warn('records: ', records);
                
                var columns = [];
                var record = records[0];
                var label = null;
                var value = null;
                var regex = new RegExp('[\_\.]', 'g');
                for (var key in record) {
                    //console.warn('key: ', key);
                    value = record[key];
                    if (fieldMap[key] === 1) {
                        label = key.replace('__c', '');
                        label = label.replace(regex, ' ');
                        //console.warn('label: ', label);
                        label = self.camelCaseToSpace(label);
                        //console.warn('label: ', label);
                        columns.push({
                            label: label,
                            fieldName: key,
                            type: typeof record[key]
                        });                        
                    }
                }
    
                var records2 = [];
                var record2 = null;
                records.forEach(function(record) {
                    record2 = {};
                    for (var key in record) {                        
	                    if (fieldMap[key] === 1) {
                            record2[key] = record[key];
                        }
                    }                                
                    records2.push(record2);
				});

                //console.warn('records2: ', records2);

                //console.warn('columns: ', columns);
                component.set('v.columns', columns);
                component.set('v.data', records2);
            }
            else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.error("Error message: " + errors[0].message);
                    }
                } else {
                    console.error("Unknown error");
                }
            }            
        });
        $A.enqueueAction(action);
    },
    
    handleSelectionChanged: function(component, id, stepName, data) {
        //console.warn('handleSelectionChanged: ', id , stepName, data);
		var self = this;
        self.describeDashboard(component, id, function(err, dashboard) {
            //console.warn('dashboard: ', dashboard);
            if (dashboard.state && dashboard.state.steps && dashboard.state.steps[stepName]) {
                var step = dashboard.state.steps[stepName];
                if (step.datasets && step.datasets.length >= 1) {
	                var dataset = step.datasets[0];
                    //console.warn('dataset: ', dataset);
                    self.describeDataset(component, dataset.id, function(err, datasetDetails) {
                       	//console.warn('datasetDetails: ', datasetDetails);
                        self.getDatasetFields(component, datasetDetails.id, datasetDetails.currentVersionId, function(err, fields) {
                            //console.warn('fields: ', fields);
                            
                            if (fields.dataset && fields.dataset.connector && fields.dataset.connector === 'API') {
                                var objectApiName = component.get('v.objectApiName');
                                //console.warn('objectApiName: ', objectApiName);
                                //console.warn('fields.dataset.fullyQualifiedName: ', fields.dataset.fullyQualifiedName);
                                // Only applicable if we have matchins source object
                                if (fields.dataset.fullyQualifiedName === objectApiName) {
                                    var selectedFieldsMap = component.get('v.selectedFields') || {};
                                    var selectedFields = selectedFieldsMap[stepName] || {};
                                    
                                    for (var name in selectedFields) {
                                        selectedFields[name] = {};
                                    }
                                    
                                    var match = false;
                                    data.forEach(function(obj) {
                                        for (var k in obj) {
                                            fields.dimensions.forEach(function(dimension) {
                                                if (dimension.field === k) {
                                                    match = true;
                                                    selectedFields[dimension.origin] = selectedFields[dimension.origin] || {};
                                                    selectedFields[dimension.origin][obj[k]] = 1;
                                                }
                                            });
                                        }
                                    });
                                    
                                    selectedFieldsMap[stepName] = selectedFields;
                                    component.set('v.selectedFields', selectedFieldsMap);
                                    
                                    var selectedSteps = component.get('v.selectedSteps');
                                    var stepCount = selectedSteps[stepName];
                                    
                                    if (stepCount === 0) {
    	                                selectedFieldsMap[stepName] = null;
	                                    component.set('v.selectedFields', selectedFieldsMap);                                
                                    }
                                    
                                    if (match === true || stepCount === 0) {
    	                                self.listObjects(component);                                
                                    }
                                }
                            }
                        });
                    });
                }
            }

        });
    },
    
    describeDashboard: function(component, dashboardId, callback) {
        
        var dashboards = component.get('v.dashboards') || {};
        var dashboard = dashboards[dashboardId];
        if (dashboard !== null && typeof dashboard !== 'undefined') {
            dashboard = JSON.parse(JSON.stringify(dashboard));
            callback(null, dashboard);
        } else {

            var sdk = component.find("sdk");
            //console.warn('sdk: ', sdk);
            
            var context = {apiVersion: "42"};
            var methodName = "describeDashboard";
            var methodParameters = {
                dashboardId: dashboardId
            };
            sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
                //console.warn('describeDashboard returned: ', err, data);
                if (err !== null) {
                    console.error("describeDashboard error: ", err);
                    if (callback !== null && typeof callback !== 'undefined') {
                        callback(err, null);
                    } else {
                        return err;
                    }
                } else {
                    var dashboard = JSON.parse(JSON.stringify(data));
                    dashboards[dashboardId] = dashboard;
                    component.set('v.dashboards', dashboards);
                    if (callback !== null && typeof callback !== 'undefined') {
                        callback(null, dashboard);
                    } else {
                        return data;
                    }
                }
            }));
        }
    },

    describeDataset: function(component, datasetId, callback) {
        var datasets = component.get('v.datasets') || {};
        var dataset = datasets[datasetId];
        if (dataset !== null && typeof dataset !== 'undefined') {
            dataset = JSON.parse(JSON.stringify(dataset));
            callback(null, dataset);
        } else {
            
            var sdk = component.find("sdk");
            
            var context = {apiVersion: "42"};
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
                    var dataset = JSON.parse(JSON.stringify(data));
                    datasets[datasetId] = dataset;
                    component.set('v.datasets', datasets);
                    if (callback !== null && typeof callback !== 'undefined') {
                        callback(null, dataset);
                    } else {
                        return data;
                    }
                }
            }));
        }
    },
    
    getDatasetFields: function(component, datasetId, versionId, callback) {
        var datasetFields = component.get('v.datasetFields') || {};
        var fields = datasetFields[datasetId + '_' + versionId];
        if (fields !== null && typeof fields !== 'undefined') {
            fields = JSON.parse(JSON.stringify(fields));
            callback(null, fields);
        } else {
        
            var sdk = component.find("sdk");
            
            var context = {apiVersion: "42"};
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
                    var fields = JSON.parse(JSON.stringify(data));
                    datasetFields[datasetId + '_' + versionId] = fields;
                    component.set('v.datasetFields', datasetFields);                    
                    if (callback !== null && typeof callback !== 'undefined') {
                        callback(null, fields);
                    } else {
                        return data;
                    }
                }
            }));
        }
    }
    
 })