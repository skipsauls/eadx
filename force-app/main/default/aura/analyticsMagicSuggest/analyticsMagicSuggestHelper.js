({
    steps: [
        { label: 'Initial', value: 'initial', message: ''},
        { label: 'Get Datasets', value: 'datasets', message: '' },
        { label: 'Match Datasets', value: 'matchedDatasets', message: '' },
        { label: 'Get Dashboards', value: 'dashboards', message: '' },
        { label: 'Match Dashboards', value: 'matchedDashboards', message: '' },
        { label: 'Get Lenses', value: 'lenses', message: '' },
        { label: 'Match Lenses', value: 'matchedLenses', message: '' },
        { label: 'Complete', value: 'complete', message: '' }
    ],

    stepsText: [
    	'initial', 'datasets', 'matchedDatasets', 'dashboards', 'matchedDashboards', 'lenses', 'matchedLenses', 'complete'
    ],    
    
    setup: function(component) {
        console.warn('setup - steps: ', this.steps);
        this.steps.forEach(function(step) {
            step.shown = false;
        });
        this.steps[0].shown = true;
        component.set('v.steps', this.steps);
    },
    
    updateProgress: function(component) {
        
    },    

    setStep: function(component, step) {
        console.warn('setStep: ', step);
    	component.set('v.step', step);
    },

    showCard: function(component, name) {
        var card = component.find(name + '-tile');
        $A.util.removeClass(card, 'hide');
    },

    addMessage: function(component, type, icon, text) {
    	var messages = component.get('v.messages');
        messages.push({
            type: type,
            icon: icon,
            text: text
        });
        component.set('v.messages', messages);
    },
        
    getSuggestions: function(component) {
        //console.warn('analyticsMagicSuggestHelper.getSuggestions');
        
        var self = this;
                
        self.setStep(component, 'initial');
        self.addMessage(component, 'dataset', 'info', 'Einstein is checking your org for relevant Analytics assets');
        
        var record = component.get('v.record');
        var simpleRecord = component.get('v.simpleRecord');
        //console.warn('record: ', record);
        //console.warn('simpleRecord: ', simpleRecord);
        
        // De-LightningLockerize the objects
        record = JSON.parse(JSON.stringify(record, null, 2));
        simpleRecord = JSON.parse(JSON.stringify(simpleRecord, null, 2));
        console.warn('record: ', record);
        console.warn('simpleRecord: ', simpleRecord);
        
        var apiName = record.apiName;
        //console.warn('apiName: ', record.apiName);
        
        
        var datasets = component.get('v.datasets') || [];
        var matchedDatasets = component.get('v.matchedDatasets') || [];

        //console.warn('datasets: ', datasets, datasets.length);
        //console.warn('matchedDatasets: ', matchedDatasets, datasets.length);
        
        self.setStep(component, 'datasets');

        self.listDatasets(component, function(err, datasets) {
            component.set('v.datasets', datasets);
            self.addMessage(component, 'dataset', 'info', 'Einstein found ' + datasets.length + ' total datasets');
        	self.setStep(component, 'matchedDatasets');
            
	        self.showCard(component, 'datasets');
            
            ///console.warn('datasets: ', datasets);
            var matchedDatasets = [];
            var datasetIds = [];
            var matchedDatasetIds = [];
            var count = datasets.length;
            datasets.forEach(function(dataset) {
                datasetIds.push(dataset.id);
                component.set('v.datasetIds', datasetIds.join());
            	/*
                self.getDatasetDetails(component, dataset.id, function(err, details) {
                    console.warn('details: ', JSON.parse(JSON.stringify(details)));
                });
                self.describeDataset(component, dataset.id, function(err, describe) {
                    console.warn('describe: ', JSON.parse(JSON.stringify(describe)));
                });
                */
                self.getDatasetFields(component, dataset.id, dataset.currentVersionId, function(err, fields) {
                    count--;
                    dataset.fields = fields;
                    //console.warn('fields: ', JSON.parse(JSON.stringify(fields)));
                    //console.warn('fields.dataset.fullyQualifiedName: ', fields.dataset.fullyQualifiedName);
                    if (fields.dataset && fields.dataset.connector && fields.dataset.connector === 'API') {
                        if (fields.dataset.fullyQualifiedName === record.apiName) {
                            //console.warn('dataset ' + dataset.label + ' has matching object ' + record.apiName);
                            matchedDatasets.push(dataset);
                            matchedDatasetIds.push(dataset.id);

                            component.set('v.matchedDatasets', matchedDatasets);
                            component.set('v.matchedDatasetIds', matchedDatasetIds.join());

                        }
                    }
                    if (count === 0) {
                        self.addMessage(component, 'dataset', 'info', 'Einstein found ' + matchedDatasets.length + ' matching datasets');
                        self.getSuggestedDashboards(component, function(err, dashboards) {
                            
                            self.getSuggestedLenses(component, function(err, leneses) {
                                
                            });
                        });
                    }
                });
            });
        });
        
    },
    
    getSuggestedDashboards: function(component, callback) {
        var self = this;
        self.showCard(component, 'dataset');

        self.setStep(component, 'dashboards');
        var datasets = component.get('v.datasets');
        var matchedDatasets = component.get('v.matchedDatasets');
        var matchedDatasetMap = {};
        matchedDatasets.forEach(function(dataset) {
           matchedDatasetMap[dataset.id] = dataset;
        });
        self.listDashboards(component, function(err, dashboards) {
            self.addMessage(component, 'dashboard', 'info', 'Einstein found ' + dashboards.length + ' total dashboards');

            self.showCard(component, 'dashboards');
            
            //console.warn('dashboards: ', JSON.parse(JSON.stringify(dashboards)));
			component.set('v.dashboards', dashboards);
            var matchedDashboards = [];
            var dashboardIds = [];
            var matchedDashboardIds = [];
        	self.setStep(component, 'matchedDashboards');
            dashboards.forEach(function(dashboard) {
				dashboardIds.push(dashboard.id);
                component.set('v.dashboardIds', dashboardIds.join());
                if (dashboard.datasets) {
                    dashboard.datasets.forEach(function(dataset) {
                        if (matchedDatasetMap[dataset.id]) {
                            matchedDashboards.push(dashboard);
                            matchedDashboardIds.push(dashboard.id);
                            component.set('v.matchedDashboards', matchedDashboards);
			                component.set('v.matchedDashboardIds', matchedDashboardIds.join());
                        } 
                    });
                }
            });
            self.addMessage(component, 'dashboard', 'info', 'Einstein found ' + matchedDashboards.length + ' matching dashboards');
            if (typeof callback === 'function') {
                callback(err, dashboards);
            }
        });
    }, 

    getSuggestedLenses: function(component, callback) {
        var self = this;
        self.showCard(component, 'dataset');
        
        self.setStep(component, 'lenses');        
        var datasets = component.get('v.datasets');
        var matchedDatasets = component.get('v.matchedDatasets');
        var matchedDatasetMap = {};
        matchedDatasets.forEach(function(dataset) {
           matchedDatasetMap[dataset.id] = dataset;
        });
        self.listLenses(component, function(err, lenses) {
            console.warn('lenses: ', JSON.parse(JSON.stringify(lenses)));
            self.addMessage(component, 'lens', 'info', 'Einstein found ' + lenses.length + ' total lenses');
            
            self.showCard(component, 'lenses');

			component.set('v.lenses', lenses);
            var matchedLenses = [];
            var lensIds = [];
            var matchedLensIds = [];
            self.setStep(component, 'matchedLenses');        
            lenses.forEach(function(lens) {
                lensIds.push(lens.id);
                component.set('v.lensIds', lensIds.join());
                if (lens.dataset) {
                    if (matchedDatasetMap[lens.dataset.id]) {
                        matchedLenses.push(lens);
                        matchedLensIds.push(lens.id);
                        component.set('v.matchedLenses', matchedLenses);
                        component.set('v.matchedLensIds', matchedLensIds.join());
                    }                     
                } else if (lens.datasets) {
                    lens.datasets.forEach(function(dataset) {
                        if (matchedDatasetMap[dataset.id]) {
                            matchedLenses.push(lens);
                            matchedLensIds.push(lens.id);
                            component.set('v.matchedLenses', matchedLenses);
                			component.set('v.matchedLensIds', matchedLensIds.join());
                        } 
                    });
                }
            });
            self.addMessage(component, 'lens', 'info', 'Einstein found ' + matchedLenses.length + ' matching lenses');            
            self.setStep(component, 'complete'); 
            if (typeof callback === 'function') {
                callback(err, lenses);
            }
            
        });
    }, 
    
    listAssets: function(component, methodName, callback) {
        var sdk = component.find('sdk');
        
        var context = {apiVersion: '42'};
        var methodName = methodName;
        var methodParameters = {
            pageSize: 200
        };
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            if (err !== null) {
                console.error('listAssets error: ', err);
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
    
    listDashboards: function(component, callback) {
        this.listAssets(component, 'listDashboards', function(err, data) {
            callback(err, data ? data.dashboards : null); 
        });
    },
    
    listDatasets: function(component, callback) {
        this.listAssets(component, 'listDatasets', function(err, data) {
            callback(err, data ? data.datasets : null); 
        });
    },
    
    listLenses: function(component, callback) {
        this.listAssets(component, 'listLenses', function(err, data) {
            callback(err, data ? data.lenses : null); 
        });
    },
    
    getAssetDetails: function(component, assetType, assetId, callback) {        
        var sdk = component.find('sdk');
        
        /*
        var dashboardId = assetType === 'dashboard' ? assetId : null;
        var datasetId = assetType === 'dataset' ? assetId : null;
        var lensId = assetType === 'lens' ? assetId : null;
        
        component.set('v.dashboardId', dashboardId);
        component.set('v.datasetId', datasetId);
        component.set('v.lensId', lensId);
        */
        
        var context = {apiVersion: '42'};
        var camelTypeName = assetType.substring(0, 1).toUpperCase() + assetType.substring(1);
        component.set('v.assetCamelType', camelTypeName);
        
        var methodName = 'describe' + camelTypeName;
        var methodParameters = {

        };
        methodParameters[assetType + 'Id'] = assetId;
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            if (err !== null) {
                console.error('listAssets error: ', err);
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
    
    getDashboardDetails: function(component, id, callback) {
        this.getAssetDetails(component, 'dashboard', id, function(err, data) {
			callback(err, data); 
        });
    },

    getDatasetDetails: function(component, id, callback) {
        this.getAssetDetails(component, 'dataset', id, function(err, data) {
			callback(err, data); 
        });
    },

    getLensDetails: function(component, id, callback) {
        this.getAssetDetails(component, 'lens', id, function(err, data) {
			callback(err, data); 
        });
    },
    
    describeDataset: function(component, datasetId, callback) {
        var sdk = component.find('sdk');
        
        var context = {apiVersion: '42'};
        var methodName = 'describeDataset';
        var methodParameters = {
            datasetId: datasetId
        };
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            if (err !== null) {
                console.error('describeDataset error: ', err);
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
        //console.warn('getDatasetFields: ', datasetId, versionId);
        var sdk = component.find('sdk');
        
        var context = {apiVersion: '42'};
        var methodName = 'getDatasetFields';
        var methodParameters = {
            datasetId: datasetId,
            versionId: versionId
        };
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            if (err !== null) {
                console.error('getDatasetFields error: ', err);
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