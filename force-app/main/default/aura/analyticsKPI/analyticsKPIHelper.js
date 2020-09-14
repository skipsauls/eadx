({
    handleKPIChange: function(component) {
        var kpi = component.get('v.kpi');
        //console.warn('kpi: ', kpi);
        if (kpi !== null && typeof kpi !== 'undefined') {

            var records = component.get('v.records');
            if (records && records.length > 0) {
                component.set('v.count', records.length);
                var index = component.get('v.index');
                //component.set('v.index', 0);
	            var value = records[index][kpi];
    	        component.set('v.value', value);                
            }
        }
	},

    handleFieldNameChange: function(component) {
        var fieldName = component.get('v.fieldName');
        //console.warn('fieldName: ', fieldName);
        var fieldMap = component.get('v.fieldMap');
        //console.warn('fieldMap: ', fieldMap);
        if (typeof fieldMap !== 'undefined' && fieldMap !== null) {
            var field = fieldMap[fieldName];
            //console.warn('field: ', field);
            var details = field[field.type];
            if (details.format) {
                for (var f in details.format) {
                    //console.warn(f + ': ', details.format[f]);
                    if (details.format.decimalDigits) {
                        component.set('v.decimalDigits', parseInt(details.format.decimalDigits));
                    } else {
		                component.set('v.decimalDigits', 0);                
                    }
                    if (details.format.customFormat) {
                        component.set('v.format', details.format.customFormat);
                    } else {
		                component.set('v.format', null);                        
                    }
                }
            } else {
                component.set('v.format', null);
                component.set('v.decimalDigits', 0);
            }
            if (details.members && details.members.length > 0) {
                //console.warn('------------> field:', fieldName, ', members: ');
                details.members.forEach(function(member) {
                    console.warn('member: ', member); 
                });
                component.set('v.fieldMembers', details.members);
                //component.set('v.style', null)
            }
        }
    },
    
    changeLens: function(component) {
        //console.warn('------------------------> changeLens');
        var t1 = Date.now();
        var self = this;
        var lensDevName = component.get('v.lensDevName');
        
        component.set('v.kpi', '');
        component.set('v.value', '');
        
        self.listLenses(component, function(err, lenses) {
            if (lenses) {
                var devName = null;
                var lens = null;
                for (var i = 0; i < lenses.length; i++) {
                    lens = lenses[i];   
                    //console.warn('lens: ', lens);
                    devName = (lens.namespace ? lens.namespace + '__' : '') + lens.name;
                    if (devName === lensDevName) {
                        break;
                    } else {
                        lens = null;
                    }
                }
                if (lens !== null && typeof lens !== 'undefined') {
                    self.getLensDetails(component, lens, function(err, lensDetails) {
                        //console.warn('getLensDetails returned: ', JSON.parse(JSON.stringify(lensDetails)));
                        var datasetId = lensDetails.dataset.id;
                        self.describeDataset(component, datasetId, function(err, datasetDetails) {
                            //console.warn('describeDataset returned: ', JSON.parse(JSON.stringify(datasetDetails)));
                            
                            self.getDatasetFields(component, datasetDetails.id, datasetDetails.currentVersionId, function(err, xmd) {
                                //console.warn('getDatasetFields returned: ', JSON.parse(JSON.stringify(xmd)));
                                component.set("v.xmd", xmd);
                                var fieldMap = self.parseXMD(component, xmd);
                                //console.warn('fieldMap: ', fieldMap);

                                component.set("v.fieldMap", fieldMap);
                                
                                var field = null;
                                var fields = [];
                                var details = null;
                                var i = 0;
                                for (var name in fieldMap) {
                                    field = fieldMap[name];
                                    //console.warn(i, ' - field name: ', name, ', field: ', field);
                                    details = field[field.type];
                                    details.type = field.type;
                                    details.name = name;
                                    details.displayName = name;
                                    //console.warn(i, ' - field name: ', name, ', details: ', details);
                                    if (details.showInExplorer === true) {
                                        fields.push(details);
                                    }
                                    if (details.members && details.members.length > 0) {
                                        //console.warn(name, ' - members: ');
                                        details.members.forEach(function(member) {
                                            //console.warn('member: ', member);
                                        });
                                    }
                                    i++;
                                }
                                
                                //console.warn('modified fields: ', fields.length, fields);
                                
                                component.set("v.fields", fields);
                                
                                var steps = lensDetails.state.steps;
                                
                                if (steps.aggregateflex) {
                                    self.getLensSAQL(component, lens, $A.getCallback(function(err, saql) {
                                        //console.warn('getLensSQAL returned: ', err, saql);
	                                    var t2 = Date.now();
    	                                //console.warn('timing: ', t2 - t1);
                                        component.set('v.saql', saql);
	                                    self.execQuery(component);
                                    }));                    
                                } else if (steps.saql && steps.saql.query) {
                                    var saql = steps.saql.query;
                                    //console.warn('saql: ', saql);
                                    var datasetId = lensDetails.dataset.id;
                                    var namespace = datasetDetails.namespace;
                                    var name = datasetDetails.name;
                                    var id = datasetDetails.id;
                                    var currentVersionId = datasetDetails.currentVersionId;
                                    var exp = new RegExp(namespace + '__' + name, 'g');

                                    saql = saql.replace(exp, id + '/' + currentVersionId);
                                    //console.warn('saql: ', saql);

                                    var t2 = Date.now();
                                    //console.warn('timing: ', t2 - t1);

                                    
                                    component.set('v.saql', saql);
                                    self.execQuery(component);
                                    
                                }
                                
                            });
                            
                        });
                        
                        
                        
                        
                    });
                    
                }
            }
            
        });
        
    },
    
    listLenses: function(component, callback) {
        var sdk = component.find("sdk");
        
        var context = {apiVersion: "42"};
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
        //console.warn('getLensDetails: ', lens);
        var sdk = component.find("sdk");
        
        var context = {apiVersion: "42"};
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
    
    describeDataset: function(component, datasetId, callback) {
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
        //console.warn('fields: ', fields);
        return fields;
    },
    
    getLensSAQL: function(component, lens, callback) {
        console.warn('getLensSAQL: ', lens);
        var sdk = component.find("sdk");
        
        var context = {apiVersion: "42"};
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
    
    execQuery: function(component) {
        var t1 = Date.now();
        var query = component.get('v.saql');
        

        if (typeof query !== 'undefined' && query !== null) {
            //console.warn('query: ', query);
            query = query.replace(new RegExp('\\"', 'g'), '"');
            //console.warn('query: ', query);
            var action = component.get("c.execQuery");
            var self = this;
            action.setParams({query: query});
            action.setCallback(this, function(response) {
                //console.warn('response: ', response);
                var state = response.getState();
                //console.warn('state: ', state);
                if (state === "SUCCESS") {
                    var json = response.getReturnValue();
                    var val = JSON.parse(json);
                    var t2 = Date.now();
                    console.warn('val: ', val);
                    if (val.results) {
                        if (val.results.metadata) {
                            val.results.metadata.forEach(function(metadata) {
								if (metadata.columns) {
									console.warn('setting columns: ', metadata.columns);
                            		component.set('v.columns', metadata.columns);
                               	} 
                            });
                        }
                        if (val.results.records) {
                            component.set('v.records', val.results.records);
                        }
                    }
                    
                    //console.warn('execQuery timing: ', (t2 - t1));
                }
                else if (state === "INCOMPLETE") {
                    // do something
                } else if (state === "ERROR") {
                    var err = response.getError();
                    console.error('error: ', err);
                }            
            });
            $A.enqueueAction(action);            
        }
    }
})