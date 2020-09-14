({
    selectDashboard: function(component) {
		var self = this;
        this.getDashboardDetails(component);
    },

    generateQueryFromPayload: function(component, payload) {
        let self = this;
        // Clean the payload object
        payload = JSON.parse(JSON.stringify(payload));
        console.warn('extractorHelper.generateQueryFromPayload: ', payload);
        let dashboard = component.get('v.dashboardObj');
        let datasetsMap = component.get("v.datasetsMap");
		
        if (dashboard) {
            
            console.warn('payload.step: ', payload.step);
            console.warn('payload.data: ', payload.data);
            
            payload.data.forEach(function(obj) {
                for (var k in obj) {
	                console.warn(k + ': ' + obj[k]);
                }
            });
            
            let step = dashboard.state.steps[payload.step];
            step = JSON.parse(JSON.stringify(step));
            console.warn('step: ', step);
            let query = step.query;
            console.warn('query: ', query);
            if (typeof query === 'string') {
                console.warn('query is SAQL');
            } else {
                query = JSON.parse(query.query);
                console.warn('query is short form: ', query);
                
                
                step.datasets.forEach(function(dataset, i) {
                    console.warn('dataset: ', dataset);
                    let datasetDetails = datasetsMap[dataset.id];
                    datasetDetails = JSON.parse(JSON.stringify(datasetDetails));
                    console.warn('datasetDetails: ', datasetDetails);
                    
	
                    let statements = [];
	        		let statement = null;
        
                    // Generate the load statement
                    statement = 'q = load "' + datasetDetails.id + '/' + datasetDetails.currentVersionId + '";';
                    statements.push(statement);

                    // Generate the filter statement(s)
                    // NEED SPECIAL CASE(S) for <=>=, etc.
                    console.warn('handle filters: ', query.filters);
                    if (query.filters) {
                        query.filters.forEach(function(filter, j) {
                            console.warn('filter: ', filter);
                            let fieldName = filter[0];
                            let values = filter[1];
                            let operators = filter[2];
                            let operator = operators; // ????
                            statement = 'q = filter q by ';
                            let sep = ' ';
                            values.forEach(function(value, k) {
                                if (typeof value === 'string') {
                                    value = '\'' + value + '\'';
                                }
                                statement += sep + '\'' + fieldName + '\' ' + operator + ' ' + value;
                                sep = '&';
                            });
                            statement += ';';
                            statements.push(statement);
                            
                        });
                    }

                    // Map for labels
                    let labelMap = {};
                    
                    // What should default be here?
                    let limit = 2000;
                    
                    console.warn('handle groups: ', query.groups);
                    if (query.groups) {
                        
	                    // Generate the group statements
                        statement = 'q = group q by (';
                        let sep = '';
                        query.groups.forEach(function(group, g) {
                            statement += sep + '\'' + group + '\'';
                            sep = ', ';
                        });
                        statement += ');'
                        statements.push(statement);
                        
                        // Generate the foreach/generate statements                    
                        statement = 'q = foreach q generate ';
                        sep = '';
                        query.groups.forEach(function(group, g) {
                            let name = group;
                            let label = group; // Lookup in XMD?
                            labelMap[name] = label;
                            statement += sep + '\'' + name + '\' as \'' + label + '\'';
                            sep = ', ';
                        });
                        statement += ';';
                        statements.push(statement);
                        
	                    // Generate the order statements
                        statement = 'q = order q by (';
                        sep = '';
                        let dir = 'asc';
                        query.groups.forEach(function(group, g) {
                            statement += sep + '\'' + group + '\' ' + dir;
                            sep = ', ';
                        });
                        statement += ');'
                        statements.push(statement);
                        
                        // Generate the limit statement
                        statement = 'q = limit q ' + limit + ';';
                        
                        statements.forEach(function(statement, i) {
                        	console.warn(i, ': ', statement);
                    	});
                        
                        let saql = statements.join('\n');
                        console.warn('SAQL:');
                        console.warn(saql);
                        
                        self.execQuery(component, saql, function(err, results) {
                            console.warn('execQuery returned: ', err, results);
                        });
                        
                    }
                });
            }
        }
    },
    
    execQuery: function(component, saql, callback) {
        var action = component.get("c.execQuery");
        action.setParams({query: saql});
        var self = this;
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                let results = response.getReturnValue();
                console.warn('query results: ', results);
                console.warn('sobjectNameMap: ', self.sobjectNameMap);
                if (typeof callback === 'function') {
                    callback(null, results);
                }
            }
            else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var err = response.getError();
                console.error('error: ', err);
                if (typeof callback === 'function') {
                    callback(err, null);
                }
            }            
        });
        $A.enqueueAction(action);
    },
    
    getDashboardDetails: function(component) {
        var dashboardId = component.get("v.dashboardId");
        if (dashboardId === null || typeof dashboardId === 'undefined') {
            return;
        }
        
        console.warn('extractorHelper.getDashboardDetails: ', dashboardId);
        
        var self = this;
        
        var datasets = [];
        component.set("v.datasets", datasets);
        var datasetsMap = {};
        component.set("v.datasetsMap", datasetsMap);
        
        var datasetFieldsMap = {};
        component.set(("v.datasetFieldsMap"), datasetFieldsMap);
        
        self.describeDashboard(component, dashboardId, $A.getCallback(function(err, dashboard) {
            console.warn('describeDashboard returned: ', err, dashboard);
            if (err !== null) {
                console.warn('describeDashboard error: ', err);
            } else {
                console.warn('dashboard: ', dashboard);
                component.set('v.developerName', dashboard.namespace ? dashboard.namespace + '__' + dashboard.name : dashboard.name);
                component.set("v.dashboardObj", dashboard);
                
                if (dashboard.state && dashboard.state.gridLayouts && dashboard.state.gridLayouts.length > 0 && dashboard.state.gridLayouts[0].pages) {
                    component.set('v.pages', dashboard.state.gridLayouts[0].pages);
                } else {
                    component.get('v.pages', null);
                }
                
                dashboard.datasets.forEach(function(dataset) {
                    console.warn('calling describeDataset for:', dataset);
                    
                    self.describeDataset(component, dataset.id, $A.getCallback(function(err, datasetDesc) {
                        if (err !== null) {
                            console.warn('describeDataset error: ', err);
                        } else {
                            console.warn('dataset: ', datasetDesc);
                            datasets = component.get("v.datasets");
                            datasets.push(datasetDesc);
                            component.set("v.datasets", datasets);
                            datasetsMap = component.get("v.datasetsMap");
                            datasetsMap[datasetDesc.id] = datasetDesc;
                            component.set("v.datasetsMap", datasetsMap);

                            self.getDatasetFields(component, datasetDesc.id, datasetDesc.currentVersionId, $A.getCallback(function(err, fields) {
                                if (err !== null) {
                                    console.warn('getDatasetFieldserror: ', err);
                                } else {
                                    console.warn('fields: ', fields);
                                    datasetFieldsMap = component.get(("v.datasetFieldsMap"));
                                    datasetFieldsMap[datasetDesc.id] = fields;
							        component.set(("v.datasetFieldsMap"), datasetFieldsMap);
                                }
                            }));
                        }
                    }));
                });
            }            
        }));        
    },
    
    describeDashboard: function(component, dashboardId, callback) {
        var sdk = component.find("sdk");
        //console.warn('sdk: ', sdk);
        
        var context = {apiVersion: "41"};
        var methodName = "describeDashboard";
        var methodParameters = {
            dashboardId: dashboardId
        };
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            console.warn('describeDashboard returned: ', err, data);
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

    describeDataset: function(component, datasetId, callback) {
        var sdk = component.find("sdk");
        
        //console.warn("-----------------------------------------------------> sdk: ", sdk);
        
        var context = {apiVersion: "41"};
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
    
    getDatasetFields: function(component, datasetId, versionId, callback) {
        var sdk = component.find("sdk");
        
        var context = {apiVersion: "41"};
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
    }    

})