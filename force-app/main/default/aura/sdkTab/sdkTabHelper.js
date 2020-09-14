({
	setup: function(component) {
		var mainContent = component.find('main_content').getElement();
        var url = $A.get('$Resource.eadx__lightning_bolt');
        component.set("v.bolt_url", url);
	},
    
    animateBolt: function(component, ltngEvt) {
		var mainContent = component.find('main_content').getElement();
        var url = component.get("v.bolt_url");
        mainContent.style.backgroundImage = 'url(' + url + ')';
		mainContent.classList.add('animate');
        setTimeout($A.getCallback(function() {
	        mainContent.style.backgroundImage = '';
            mainContent.classList.remove('animate');
        }), 500);
    },
    
    clearSelections: function(component) {
        component.set("v.datasetId", '');
        component.set("v.datasets", []);
        component.set("v.dimensionsOptions", []);
        component.set("v.measuresOptions", []);
        component.set("v.datesOptions", []);
        component.set("v.selectedFieldOptions", []);
        component.set("v.selectedFieldValues", []);
        component.set("v.selectedFieldName", '');
        component.set("v.selectedNumber1", 0);
        component.set("v.selectedNumber2", 0);
        component.set("v.selectedDate1", '');
        component.set("v.selectedDate2", '');
        component.set("v.dimensionName", '');
        component.set("v.measureName", '');
        component.set("v.dateName", '');
        component.set("v.operator", '');        
    },
    
    hideOptionEditors: function(component) {
        $A.util.addClass(component.find('dimension_options'), 'hidden');
        $A.util.addClass(component.find('measure_options'), 'hidden');
        $A.util.addClass(component.find('date_options'), 'hidden');        
    },
    
    updateOperator: function(component) {
        this.updateSelectedDates(component);
    },
    
    updateSelectedDates: function(component) {
        var isFilter = component.get('v.isFilter') || false;
        //console.warn('isFilter: ', isFilter);
        
        var operator = component.get('v.operator');
        //console.warn('operator: ', operator);

        var selectedFieldValues = component.get("v.selectedFieldValues");
        selectedFieldValues = [];

        var selectedDate1 = component.get('v.selectedDate1');
        //console.warn('selectedDate1: ', selectedDate1);
        
		var timestamp1 = new Date(selectedDate1).getTime();
        //console.warn('timestamp1: ', timestamp1);
        if (timestamp1 !== null && typeof timestamp1 !== 'undefined'  && !isNaN(timestamp1)) {
	        selectedFieldValues.push(timestamp1);            
        }
        
        if (operator === '>=<=') {
            var selectedDate2 = component.get('v.selectedDate2');
            //console.warn('selectedDate2: ', selectedDate2);
            var timestamp2 = new Date(selectedDate2).getTime();
	        //console.warn('timestamp2: ', timestamp2);
	        if (timestamp2 !== null && typeof timestamp2 !== 'undefined' && !isNaN(timestamp2)) {
		        selectedFieldValues.push(timestamp2);
            }
        }
        
        component.set("v.selectedFieldValues", selectedFieldValues);        
    },

    updateSelectedNumbers: function(component) {
        var isFilter = component.get('v.isFilter') || false;
        //console.warn('isFilter: ', isFilter);
        
        var operator = component.get('v.operator');
        //console.warn('operator: ', operator);

        var selectedFieldValues = component.get("v.selectedFieldValues");
        selectedFieldValues = [];
        
        var selectedNumber1 = component.get('v.selectedNumber1');
        //console.warn('selectedNumber1: ', selectedNumber1);
        
        selectedFieldValues.push(selectedNumber1);
        
        if (operator === '>=<=') {
            var selectedNumber2 = component.get('v.selectedNumber2');
            //console.warn('selectedNumber2: ', selectedNumber2);
	        selectedFieldValues.push(selectedNumber2);
        }
        
        component.set("v.selectedFieldValues", selectedFieldValues);        
    },
    
    selectDashboard: function(component) {
        
        var self = this;
        
        // Clear the various select boxes
        this.clearSelections(component);
        this.hideOptionEditors(component);
        this.getDashboardDetails(component);
        
        var developerName = component.get("v.developerName");
        //console.warn('selectDashboard: ', dashboardId);
        
        return;
        
        // The code below is the old way of loading dashboards
        
        var outer = component.find("dashboard-outer");
        console.warn("outer: ", outer, outer.getElement());
        //$A.util.removeClass(outer, "fadein");
        //$A.util.addClass(outer, "fadeout");
        var config = {
            developerName: developerName,
            height: "800",
            openLinksInNewWindow: false,
            showHeader: false,
            showTitle: false,
            showSharing: false
        };
        $A.createComponent("wave:waveDashboard", config, function(cmp, msg, err) {
            var dashboard = component.find("dashboard");
            if (err) {
                console.warn("error: ", err);
            } else {
                $A.util.addClass(cmp, "dashboard-container");
                //$A.util.addClass(outer, "hidden");
                dashboard.set("v.body", [cmp]);
                /*
                setTimeout($A.getCallback(function() {
                    //$A.util.removeClass(outer, "hidden");
                    //$A.util.removeClass(outer, "fadeout");
                    //$A.util.addClass(outer, "fadein");
                }), 500);
                */
            }            
        });
        
    },
    
    getDashboardDetails: function(component) {
        var developerName = component.get("v.developerName");
        //console.warn('sdkTabHelper.getDashboardDetails: ', dashboardId);
        
        var self = this;
        
        var datasets = [];
        component.set("v.datasets", datasets);
        var datasetsMap = {};
        component.set("v.datasetsMap", datasetsMap);
        
        var datasetFieldsMap = {};
        component.set(("v.datasetFieldsMap"), datasetFieldsMap);
        
        self.describeDashboard(component, developerName, $A.getCallback(function(err, dashboard) {
            if (err !== null) {
                console.warn('describeDashboard error: ', err);
            } else {
                console.warn('dashboard: ', dashboard);
                //component.set('v.developerName', dashboard.namespace ? dashboard.namespace + '__' + dashboard.name : dashboard.name);
                component.set("v.dashboardObj", dashboard);
                
                if (dashboard.state && dashboard.state.gridLayouts && dashboard.state.gridLayouts.length > 0 && dashboard.state.gridLayouts[0].pages) {
                    component.set('v.pages', dashboard.state.gridLayouts[0].pages);
                } else {
                    component.get('v.pages', null);
                }
                
                dashboard.datasets.forEach(function(dataset) {
                    
                    self.describeDataset(component, dataset.id, $A.getCallback(function(err, datasetDesc) {
                        if (err !== null) {
                            console.warn('describeDataset error: ', err);
                        } else {
                            //console.warn('dataset: ', datasetDesc);
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
                                    //console.warn('fields: ', fields);
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
    
    describeDashboard: function(component, developerName, callback) {
        var sdk = component.find("sdk");
        //console.warn('sdk: ', sdk);
        
        var context = {apiVersion: "46"};
        var methodName = "describeDashboard";
        var methodParameters = {
            dashboardId: developerName
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
        
        var context = {apiVersion: "46"};
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
        
        var context = {apiVersion: "46"};
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

    getUsers: function(component, callback) {
        var action = component.get("c.getUsers");
        var self = this;
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var val = response.getReturnValue();
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(null, val);
                }
            }
            else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var err = response.getError();
                console.error('error: ', err);
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(err, null);
                }
            }            
        });
        $A.enqueueAction(action);
    },
    
    getPicklistValues: function(component, sobjectName, fieldName, callback) {
        var action = component.get("c.getPicklistValues");
        action.setParams({sobjectName: sobjectName, fieldName: fieldName});
        var self = this;
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var val = response.getReturnValue();
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(null, val);
                }
            }
            else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var err = response.getError();
                console.error('error: ', err);
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(err, null);
                }
            }            
        });
        $A.enqueueAction(action);
    },

	getFieldValues: function(component, sobjectName, fieldName, callback) {
        //console.warn("sdkTabHelper.getFieldValues: ", sobjectName, fieldName);
        var action = component.get("c.getFieldValues");
        var params = {sobjectName: sobjectName, fieldName: fieldName};
        //console.warn('params: ', params);
        action.setParams(params);
        var self = this;
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var val = response.getReturnValue();
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(null, val);
                }
            }
            else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var err = response.getError();
                console.error('error: ', err);
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(err, null);
                }
            }            
        });
        $A.enqueueAction(action);
    },

    sobjectNameMap: null,
/*    
    sobjectNameMap: {
        'Account': true,
        'Case': true,
        'Contact': true,
        'Contract': true,
        'Opportunity': true
	},
  */  
    getSObjectNames: function(component) {
        var action = component.get("c.getSObjectNames");
        var self = this;
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                self.sobjectNameMap = response.getReturnValue();
                console.warn('sobjectNameMap: ', self.sobjectNameMap);
            }
            else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var err = response.getError();
                console.error('error: ', err);
            }            
        });
        $A.enqueueAction(action);
    },
        
    isSObjectName: function(name) {
        return this.sobjectNameMap[name.toLowerCase()] ? true :  false;
    }
    
})