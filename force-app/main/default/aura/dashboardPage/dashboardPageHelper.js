({
    setup: function(component) {
        var self = this;
        self.getDashboard(component, function(err, dashboard) {
            //console.warn('dashboard: ', dashboard);
            component.set('v.dashboard', dashboard);
            self.describeDashboard(component, dashboard.id, function(err, details) {
                //console.warn('details: ', details);
	            component.set('v.dashboardDetails', details);
                var state = details.state;
                var layout = state.gridLayouts[0];
				var pages = layout.pages;
                var pageMap = {};
                pages.forEach(function(page) {
                   	pageMap[page.label] = page; 
                });
                component.set('v.pageMap', pageMap);
                //self.updatePage(component);
            });
        })
    },
    
    updatePage: function(component) {
        //console.warn('--------------------------------------------------------------------------------------- updatePage');
        var self = this;
        var record = component.get('v.record');
        var fields = component.get('v.recordFields');       
        var dashboardDetails = component.get('v.dashboardDetails');
        
        try {
            var keyField = fields[0];
            var keyValue = '' + record.fields[keyField].value;
            //console.warn('keyValue: ', keyValue);
            
            var pageFieldMap = component.get('v.pageFieldMap');
            var pageLabel = pageFieldMap[keyValue];
            var pageMap = component.get('v.pageMap');
            var page = pageMap[pageLabel];
            
            var initialized = component.get('v.initialized');
            if (initialized === false) {
                setTimeout(function() {
                    component.set('v.pageId', null);           
                    component.set('v.pageId', page.name);           
                    //component.set('v.initialized', true);
                }, 3000);
            } else {
                component.set('v.pageId', null);           
                component.set('v.pageId', page.name);
                //component.set('v.initialized', true);
            }
        } catch (e) {
            setTimeout(function() {
                self.updatePage(component);
            }, 1000);            
        }        
    },
    
    changePage: function(component) {
        //console.warn('dashboardPageHelper.changePage');
        var pageId = component.get('v.pageId');
        //console.warn('pageId: ', pageId);
        if (pageId) {
            component.set('v.initialized', true);            
            var developerName = component.get('v.developerName');
            //console.warn("developerName: ", developerName);
            //console.warn("pageId: ", pageId);
            var evt = $A.get('e.wave:pageChange');
            //console.warn('evt: ', evt);
            evt.setParams({
                devName: developerName,
                pageid: pageId
            });
            //console.warn('evt: ', evt, JSON.stringify(evt));
            //console.warn('params: ', evt.getParams());
            evt.fire();
        } else {
            //console.error('No pageId');
        }        
    },
    
	getDashboard: function(component, callback) {
        var developerName = component.get('v.developerName');
        var sdk = component.find("sdk");
        var context = {apiVersion: "44"};
        var methodName = "listDashboards";
        var methodParameters = {
            pageSize: 200
        };
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            //console.warn('listDashboards returned: ', err, data);
            if (typeof callback === 'function') {
                var match = null;
                if (data && data.dashboards) {
                    var dashboards = [];
                    var devName = null;
                    data.dashboards.forEach(function(dashboard) {
                        devName = dashboard.namespace ? dashboard.namespace + '__' + dashboard.name : dashboard.name;
                        if (devName === developerName) {
                            match = dashboard;
                        }  
                    });
                }
                callback(err, match);
            }
        }));		
	},
    
    getDashboardDetails: function(component) {
        var dashboardId = component.get("v.dashboardId");
        //console.warn('sdkTabHelper.getDashboardDetails: ', dashboardId);
        
        var self = this;
        
        var datasets = [];
        component.set("v.datasets", datasets);
        var datasetsMap = {};
        component.set("v.datasetsMap", datasetsMap);
        
        var datasetFieldsMap = {};
        component.set(("v.datasetFieldsMap"), datasetFieldsMap);
        
        self.describeDashboard(component, dashboardId, $A.getCallback(function(err, dashboard) {
            if (err !== null) {
                console.warn('describeDashboard error: ', err);
            } else {
                //console.warn('dashboard: ', dashboard);
                component.set('v.developerName', dashboard.namespace ? dashboard.namespace + '__' + dashboard.name : dashboard.name);
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
    
    describeDashboard: function(component, dashboardId, callback) {
        var sdk = component.find("sdk");
        //console.warn('sdk: ', sdk);
        
        var context = {apiVersion: "44"};
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

})