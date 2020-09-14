({
    doInit: function(component, event, helper) {
        helper.getSObjectNames(component);
        helper.selectDashboard(component);
    },
    
    handleSelectionChanged: function(component, event, helper) {
        var params = event.getParams();
        console.warn('params: ', JSON.stringify(params));
        var id = params.id;
        component.set("v.dashboardId", id);
        var payload = params.payload;
        console.warn("payload: ", payload);
        var row = null;        
        if (payload) {                
            var step = payload.step;
            console.warn("step: ", step);
            var data = payload.data;
            console.warn("data: ", data);
            var idx = 0;
            data.forEach(function(obj) {
                for (var k in obj) {
	                console.warn(k + ': ' + obj[k]);
                }
            });
        }
    },
    
    handleWaveUpdateBolt: function(component, event, helper) {
        console.warn('sdkTabController.handleWaveUpdateBolt: ', JSON.stringify(event.getParams(), null, 2));
        var params = event.getParams();
        var evt = null;
        if (params.pageid !== null && typeof params.pageid !== 'undefined') {
            evt = $A.get('e.wave:pageChange');
            evt.setParams({
                devName: params.devName,
                pageid: params.pageid
            })
            
        } else {
	        evt = $A.get('e.wave:update');
            console.warn('evt: ', evt);
    	    evt.setParams(event.getParams());    
        }
        console.warn('firing event with payload: ', JSON.stringify(evt.getParams(), null, 2));
        helper.animateBolt(component, evt);
        evt.fire();
    },
    
    addAllFieldOptions: function(component, event, helper) {
	    var selectedFieldOptions = component.get("v.selectedFieldOptions");
        //console.warn("selectedFieldOptions: ", selectedFieldOptions);
		var selectedFieldValues = [];
        selectedFieldOptions.forEach(function(option) {
            //console.warn("option: ", option);
            selectedFieldValues.push(option.label);
        });
        //console.warn("selectedFieldValues: ", selectedFieldValues);
        component.set("v.selectedFieldValues", selectedFieldValues);        
    },
    
    removeAllFieldValues: function(component, event, helper) {
        component.set("v.selectedFieldValues", []);
    },

    changeOperator: function(component, event, helper) {
        helper.updateOperator(component);
    },
    
    changeDate: function(component, event, helper) {
        helper.updateSelectedDates(component);
    },

    changeNumber: function(component, event, helper) {
        helper.updateSelectedNumbers(component);
    },
    
    changeType: function(component, event, helper) {
        var isFilter = component.get('v.isFilter') || false;
        console.warn('isFilter: ', isFilter);

        if (isFilter) {
            
        } else {
            
        }     
    },
    
    selectDashboard: function(component, event, helper) {
        helper.selectDashboard(component);
    },

    selectPage: function(component, event, helper) {
        //var dashboardId = component.get('v.dashboardId');
        var pageId = component.get('v.pageId');
        var developerName = component.get('v.developerName');
        
        try {
            
	        var evt = $A.get('e.wave:pageChange');
            var params = {
                devName: developerName,
                pageid: pageId
            };
            evt.setParams(params);
            evt.fire();
            
        } catch (e) {
            console.warn("Exception: ", e);
            //helper.showToast(component, "Error", "The selection JSON is invalid JSON, please check and try again.", "error", null);
        }        
    },
    
    /*
     * LATEST 10/24
     * 
     * - Add option to let users see all fields
     * - Add detection of single vs multi select & UI
     * 
     */
    selectDataset: function(component, event, helper) {
		var datasetFieldsMap = component.get("v.datasetFieldsMap");
        var datasetId = component.get("v.datasetId");
        var datasetsMap = component.get("v.datasetsMap");
        var dataset = datasetsMap[datasetId];
        //console.warn('dataset: ', dataset);
        if (dataset === null || typeof dataset === "undefined") {
            return;
        }
        var datasetName = "";
        if (dataset.namespace !== null && typeof dataset.namespace !== "undefined" && dataset.namespace !== "") {
            datasetName += dataset.namespace + "__";
        }
        datasetName += dataset.name;
        component.set("v.datasetName", datasetName);
        
        var dashboard = component.get("v.dashboardObj");
        var query = null;
        var groupFields = {};
        var step = null;
        var widget = null;
        var groups = null;
        for (var stepName in dashboard.state.steps) {
            step = dashboard.state.steps[stepName];
            //console.warn('step: ', step);

            // Filter out any steps that don't have widgets
			for (var widgetName in dashboard.state.widgets) {
				widget = dashboard.state.widgets[widgetName];
                if (widget.parameters.step && widget.parameters.step === stepName) {
             
                    if (step.query && step.query.query) {
                        query = JSON.parse(step.query.query);
                        //console.warn('query: ', query);
                        if (query.groups !== null && typeof query.groups !== 'undefined') {
                            if (query.groups.forEach) {
                                query.groups.forEach(function(group) {
                                    //console.warn('group: ', group);
                                    groupFields[group] = true;
                                });                            
                            }
                        }
                    }
                    
                }
            }
        }
        //console.warn('groupFields: ', groupFields);

        
		var fields = datasetFieldsMap[datasetId];
        console.warn('fields: ', fields);
        
        if (fields) {
            var dimensions = fields.dimensions;
            var dimensionsOptions = [];
            dimensions.forEach(function(dimension) {
                if (dimension.showInExplorer === true) {
                    if (groupFields[dimension.fullyQualifiedName] || groupFields[dimension.field]) {
		                dimensionsOptions.push({label: dimension.label, value: dimension.fullyQualifiedName || dimension.field});                    
                    }
                }
            });
            //console.warn('dimensions: ', dimensions);
            component.set("v.dimensions", dimensions);
            component.set("v.dimensionsOptions", dimensionsOptions);
            
            var measures = fields.measures;
            var measuresOptions = [];
            measures.forEach(function(measure) {
                if (measure.showInExplorer === true) {
	                measuresOptions.push({label: measure.label, value: measure.fullyQualifiedName || measure.field});                
                }
            });
            //console.warn('measures: ', measures);
            component.set("v.measures", measures);
            component.set("v.measuresOptions", measuresOptions);
            
            var dates = fields.dates;
            var datesOptions = [];
            dates.forEach(function(date) {
                if (date.showInExplorer === true) {                
	                datesOptions.push({label: date.label, value: date.fullyQualifiedName || date.field});
                }
            });
            //console.warn('dates: ', dates);
            component.set("v.dates", dates);
            component.set("v.datesOptions", datesOptions);
            
        }
    },
	    
    selectDimension: function(component, event, helper) {
        helper.hideOptionEditors(component);
        component.set("v.measureName", '');
        component.set("v.dateName", '');
        
        var filterDimensionOperators = component.get("v.filterDimensionOperators");
        component.set('v.operator', filterDimensionOperators[0].value);
        
        var dimensionName = component.get("v.dimensionName")
       	console.warn('dimensionName: ', dimensionName);
		var datasetFieldsMap = component.get("v.datasetFieldsMap");
		var datasetId = component.get("v.datasetId");        
		var fields = datasetFieldsMap[datasetId];
        //console.warn('fields: ', fields);
        component.set('v.selectedFieldOptions', []);
        component.set('v.selectedFieldValues', []);
        
        // Rather than getting picklist values, try to get the values from the records
        var r = new RegExp('[\._]', 'g');
        var names = dimensionName.split(r);
        var name = null;
        for (var i = names.length - 1; i >= 0; i--) {
            name = names[i];
            if (helper.isSObjectName(name)) {
                break;
            }
        }
        
        var sobjectName = name;
        
        console.warn('sobjectName: ', sobjectName, ', index: ', i);
        var fieldName = '';
        var delim = '';
        for (var j = i + 1; j < names.length; j++) {
            fieldName += delim + names[j];
            delim = '.';
        }
        
        console.warn('fieldName: ', fieldName);
        
        component.set('v.selectedFieldName', fieldName);
        
        // Query will be in the form:
        // SELECT fieldName FROM sobjectName GROUP BY fieldName
        helper.getFieldValues(component, sobjectName, fieldName, $A.getCallback(function(err, values) {
            if (err) {
                console.error('getFieldValues error: ', err);
            } else {
                console.warn('values: ', values);
                var picklistValues = [];
                var value = null;
                for (var key in values) {
                    value = values[key];
                    picklistValues.push({label: value, value: value});
                }
                console.warn('picklistValues: ', picklistValues);
                component.set('v.selectedFieldOptions', picklistValues);
            }
        }));          
        
        $A.util.removeClass(component.find('dimension_options'), 'hidden');
        
        return;

        
        
        /* OLDER - REMOVE? */
        
        
        if (fields.dataset.connector === 'API') {
            var names = dimensionName.split('.');
            var sobjectName = names[names.length - 2];
            var fieldName = names[names.length - 1];
            console.warn('sobjectName: ', sobjectName);
            console.warn('fieldName: ', fieldName);
			component.set('v.selectedFieldName', fieldName);
            
            if (fieldName === 'Owner') {
                helper.getUsers(component, $A.getCallback(function(err, values) {
                    if (err) {
                        console.error('getPicklistValues error: ', err);
                    } else {
                        console.warn('picklist values: ', values);
                        var picklistValues = [];
                        for (var label in values) {
                            picklistValues.push({label: label, value: values[label]});
                        }
                        //console.warn('picklistValues: ', picklistValues);
                        component.set('v.selectedFieldOptions', picklistValues);
                    }                    
                }));                
            } else {
                helper.getPicklistValues(component, sobjectName, fieldName, $A.getCallback(function(err, values) {
                    if (err) {
                        console.error('getPicklistValues error: ', err);
                    } else {
                        //console.warn('picklist values: ', values);
                        var picklistValues = [];
                        for (var label in values) {
                            picklistValues.push({label: label, value: values[label]});
                        }
                        //console.warn('picklistValues: ', picklistValues);
                        component.set('v.selectedFieldOptions', picklistValues);
                    }
                }));            
            }
            
        } else if (fields.dataset.connector === 'CSV' && fields.dataset.fullyQualifiedName === 'Trailhead_DTC_Opportunities_csv') {
            // SPECIAL DEMO CASE FOR TRAILHEAD SAMPLE!!!!!!!!!!!!!!!!!!!!
            var names = dimensionName.split('_');
            var sobjectName = null;
            var fieldName = null;
            if (names.length > 1) {
                sobjectName = names[names.length - 2];
                fieldName = names[names.length - 1];                
            } else {
				sobjectName = 'Opportunity';
                fieldName = dimensionName;
            }

            console.warn('sobjectName: ', sobjectName);
            console.warn('fieldName: ', fieldName);
			component.set('v.selectedFieldName', fieldName);            
        }
        
        $A.util.removeClass(component.find('dimension_options'), 'hidden');
        
    },
    
    selectMeasure: function(component, event, helper) {
        helper.hideOptionEditors(component);
        component.set("v.dimensionName", '');
        component.set("v.dateName", '');
        
        var filterMeasureOperators = component.get("v.filterMeasureOperators");
        component.set('v.operator', filterMeasureOperators[0].value);
        
        var measureName = component.get("v.measureName")
        console.warn('measureName: ', measureName);
		var datasetFieldsMap = component.get("v.datasetFieldsMap");
		var datasetId = component.get("v.datasetId");        
		var fields = datasetFieldsMap[datasetId];
        console.warn('fields: ', fields);
        component.set('v.selectedFieldOptions', []);
        component.set('v.selectedFieldValues', []);
        if (fields.dataset.connector === 'API') {
            var names = measureName.split('.');
            var sobjectName = names[names.length - 2];
            var fieldName = names[names.length - 1];
            console.warn('sobjectName: ', sobjectName);
            console.warn('fieldName: ', fieldName);
			component.set('v.selectedFieldName', fieldName);            
            helper.getPicklistValues(component, sobjectName, fieldName, $A.getCallback(function(err, values) {
                if (err) {
                    console.error('getPicklistValues error: ', err);
                } else {
                    console.warn('picklist values: ', values);
                    var picklistValues = [];
                    values.forEach(function(value) {
                        picklistValues.push({label: value, value: value});
                    });
                    component.set('v.selectedFieldOptions', picklistValues);
                }
            }));
        } else {
			component.set('v.selectedFieldName', measureName);
            
        }
        
        $A.util.removeClass(component.find('measure_options'), 'hidden');
    },

    selectDate: function(component, event, helper) {
        helper.hideOptionEditors(component);
        component.set("v.measureName", '');
        component.set("v.dimensionName", '');
        
        var filterDateOperators = component.get("v.filterDateOperators");
        component.set('v.operator', filterDateOperators[0].value);
        
        var dateName = component.get("v.dateName")
        console.warn('dateName: ', dateName);
		var datasetFieldsMap = component.get("v.datasetFieldsMap");
		var datasetId = component.get("v.datasetId");        
		var fields = datasetFieldsMap[datasetId];
        console.warn('fields: ', fields);
        component.set('v.selectedFieldOptions', []);
        component.set('v.selectedFieldValues', []);
        if (fields.dataset.connector === 'API') {
            var names = dateName.split('.');
            var sobjectName = names[names.length - 2];
            var fieldName = names[names.length - 1];
            console.warn('sobjectName: ', sobjectName);
            console.warn('fieldName: ', fieldName);
			component.set('v.selectedFieldName', fieldName);            
            helper.getPicklistValues(component, sobjectName, fieldName, $A.getCallback(function(err, values) {
                if (err) {
                    console.error('getPicklistValues error: ', err);
                } else {
                    console.warn('picklist values: ', values);
                    var picklistValues = [];
                    for (var label in values) {
                        picklistValues.push({label: label, value: values[value]});
                    };
                    component.set('v.selectedFieldOptions', picklistValues);
                }
            }));
        } else {
			component.set('v.selectedFieldName', dateName);
        }
        
        $A.util.removeClass(component.find('date_options'), 'hidden');

    },

    handleSelectedFieldValuesChange: function(component, event, helper) {
		//console.warn('handleSelectedFieldValuesChange');        
        var values = event.getParam("value");
        //console.warn('values: ', values);
        values.forEach(function(value) {
            //console.warn('value: ', value);
        });
    },
    
    /* OLDER BELOW - REMOVE */
    
    handleDimensionsChange: function(component, event, helper) {
        /*
		var datasetFieldsMap = component.get("v.datasetFieldsMap");
        var datasetId = component.get("v.datasetId");
        var datasetsMap = component.get("v.datasetsMap");
        var dataset = datasetsMap[datasetId];
        console.warn('dataset: ', dataset);
		var fields = datasetFieldsMap[datasetId];
        console.warn('fields: ', fields);

        var dimensionsOptions = component.get("v.dimensionsOptions");
        var dimensionsValues = component.get("v.dimensionsValues");
        var values = event.getParam("value");
        var fieldName = null;
        var sobjectName = null;
        var names = null;
        values.forEach(function(value) {
            console.warn('value: ', value);
            if (fields.dataset.connector === 'API') {
                names = value.split('.');
                sobjectName = names[names.length - 2];
                fieldName = names[names.length - 1];
                //sobjectName = fields.dataset.fullyQualifiedName;
                //fieldName = value.replace(new RegExp(sobjectName + '.'), '');
                console.warn('getPickListValues for: ', sobjectName, fieldName);
                helper.getPicklistValues(component, sobjectName, fieldName, $A.getCallback(function(err, values) {
                    if (err) {
                        console.error('getPicklistValues error: ', err);
                    } else {
	                    console.warn('picklist values: ', values);                    
                    }
                }));
            }
        });
        */
    },

    handleMeasuresChange: function(component, event, helper) {
        var measuresOptions = component.get("v.measuresOptions");
        var measuresValues = component.get("v.measuresValues");
        var values = event.getParam("value");
        values.forEach(function(value) {
        });
    },
    
    handleDatesChange: function(component, event, helper) {
        var datesOptions = component.get("v.datesOptions");
        var datesValues = component.get("v.datesValues");
        var values = event.getParam("value");
        values.forEach(function(value) {
        });
    },
    
    test: function(component, event, helper) {
        helper.animateBolt(component, null);
    }    
})