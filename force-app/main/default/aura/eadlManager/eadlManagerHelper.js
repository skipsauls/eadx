({
    templateConfig: {
        "ui": {
            "displayMessages" : [],            
            "pages": [
                {
                    "title": "Mortgage Calculator Loan Information",
                    "variables": [
                        {
                            "name": "FinancingAmount"
                        },
                        {
                            "name": "LoanTermYears"
                        },
                        {
                            "name": "AnnualPercentageRate"
                        }
                    ]
                },
                {
                    "title": "Mortgage Calculator Chart Customization",
                    "variables": [
                        {
                            "name": "AmortizedChartType"
                        }
                    ]
                }
            ]
        },
        "variables": {
            "AppName": {
                "label": "The name of the app",
                "description": "The name of the app",
                "defaultValue": null,
                "required": false,
                "variableType": {
                    "type": "StringType"
                }
            },
            "AppLabel": {
                "label": "The label of the app",
                "description": "The label of the app",
                "defaultValue": "Mortgage Calculator",
                "required": false,
                "variableType": {
                    "type": "StringType"
                }
            },
            "AmortizedChartType": {
                "label": "What kind of chart would you like to use?",
                "description": "The chart to use when representing the amortized loan.",
                "defaultValue": "line",
                "required": true,
                "variableType": {
                    "type": "StringType",
                    "enums": [
                        "line",
                        "stackvbar",
                        "stackhbar",
                        "combo",
                        "heatmap"
                    ]
                }
            },
            "LoanTermYears": {
                "label": "Enter the number of years for the loan",
                "description": "This will be the total number of years for the loan.",
                "defaultValue": 10,
                "required": true,        
                "variableType": {
                    "type": "NumberType"
                }
            },
            "AnnualPercentageRate": {
                "label": "Enter the annual percentage rate",
                "description": "This will be the annual percentage rate for the loan.",
                "defaultValue": 3.5,
                "required": true,        
                "variableType": {
                    "type": "NumberType"
                }
            },
            "FinancingAmount": {
                "label": "Enter the amount to finance",
                "description": "This will be the amount to finance for the loan.",
                "defaultValue": 100000,
                "required": true,        
                "variableType": {
                    "type": "NumberType"
                }
            }
        }
    },
    
    templateTypeToInputType: {
        'StringType': 'input',
        'BooleanType': 'checkbox',
        'NumberType': 'number',
        'SObjectType': 'input',
        'SObjectFieldType': 'input',
        'ArrayType': 'input'
    },
    
    setupTemplateConfig: function(component, callback) {
        let self = this;
      	let config = self.templateConfig;
        
        //let templateVariables = [];
        let tv = null;
/*        
        for (var name in config.variables) {
            console.warn('name: ', name);
            if (config.variables[name]) {
                tv = config.variables[name];
                tv.name = name;
                tv.value = tv.defaultValue || '';
            } else {
                tv = {
                    name: name,
                    value: '',
                    defaultValue: '',
                    variableType: {
                        type: 'StringType'
                    }
                };
            }
            templateVariables.push(tv);
        }
        
        component.set('v.templateVariables', tv);
*/
        
        let templateConfig = {
            displayMessages: config.ui.displayMessages,
            pages: []
        };
        
        let page = null;
        config.ui.pages.forEach(function(p) {
            page = {
                title: p.title,
                variables: []
            };
            p.variables.forEach(function(v) {
                if (config.variables[v.name]) {
                    tv = config.variables[v.name];
                    tv.name = v.name;
                    tv.value = tv.defaultValue || '';
                    tv.inputType = self.templateTypeToInputType[tv.variableType.type || 'input'];
                } else {
                    tv = {
                        name: v.name,
                        value: '',
                        defaultValue: '',
                        variableType: {
                            type: 'StringType'
                        }                        
                    };
                }
                page.variables.push(tv);
            });
            templateConfig.pages.push(page);
        });
        
        console.warn('templateConfig: ', templateConfig);
        
        component.set('v.templateConfig', templateConfig);
        
        if (typeof callback === 'function') {
            callback();
        }
    },
    
    updateStatus: function(component, callback) {
        let self = this;
        self.listFolders(component, function(err, folders) {
            if (typeof callback === 'function') {
                callback(null, null);
            }
        });
    },
    
    createApp: function(component) {
        let self = this;
        
        let apiController = component.get('c.createEmbeddedApp');

        let templateApiName = component.get('v.templateApiName');
        
      	let appName = component.get('v.appName');
        
        let values = {};
        
        /*
        let templateVariables = component.get('v.templateVariables');
        
        templateVariables.forEach(function(v) {
            if (v.value !== null && typeof v.value !== 'undefined' && v.value !== '') {
                values[v.name] = v.value;
            }
            if (v.name === 'AppName') {
                appName = values[v.name];
            }
        });
        */

        let templateConfig = component.get('v.templateConfig');
        
        templateConfig.pages.forEach(function(page) {
            page.variables.forEach(function(v) {
                console.warn('v: ', v, ', v.value: ', v.value, ', typeof v.value: ', typeof v.value);
                if (v.value !== null && typeof v.value !== 'undefined' && v.value !== '') {
                    if (v.variableType.type === 'NumberType') {
	                    values[v.name] = new Number(v.value).valueOf();
                    } else if (v.variableType.type === 'BooleanType') {
                        values[v.name] = new Boolean(v.value).valueOf();
                    } else {
                        values[v.name] = v.value;
                    }
                }
            });
        });
        
		// Create the appConfiguration with desired settings
		// See docs for complete listing
        let appConfiguration = {
            deleteAppOnConstructionFailure: true,
            autoShareWithLicensedUsers: true,
            autoShareWithOriginator: true,
            failOnDuplicateNames: true,
            values: values
        };

        console.warn('appConfiguration: ', appConfiguration);

        
        // Set the parameters for the API call
        apiController.setParams({
            templateApiName: templateApiName,
            name: appName,
            appConfiguration: appConfiguration
        });

        apiController.setCallback(component, $A.getCallback(function(response){
            
            if (response.getState() === 'SUCCESS') {
                
                let rv = response.getReturnValue();
                let data = JSON.parse(rv);
                
                self.monitor(component);

            } else {
                console.warn('Not successful');
            }
            
        }));
        $A.enqueueAction(apiController);        
    
	},
    
    deleteApp: function(component, appDef) {
        let self = this;
        
        let apiController = component.get('c.deleteEmbeddedApp');

        let templateApiName = component.get('v.templateApiName');
        
        // Set the parameters for the API call
        apiController.setParams({
            templateApiName: templateApiName
        });

        apiController.setCallback(component, $A.getCallback(function(response){
            
            if (response.getState() === 'SUCCESS') {
                
                let rv = response.getReturnValue();
                let data = JSON.parse(rv);
                
                self.monitor(component);

            } else {
                console.warn('Not successful');
            }
            
        }));
        $A.enqueueAction(apiController);        
	},
    
	checkStatus: function(component, callback) {
		
        let self = this;
        
        let apiController = component.get('c.getAutoInstallRequestsByTemplateApiName');

        let templateApiName = component.get('v.templateApiName');
        
        apiController.setParams({
            templateApiName: templateApiName
        });
        
        apiController.setCallback(component, $A.getCallback(function(response){
            
            if (response.getState() === 'SUCCESS') {
                
                let rv = response.getReturnValue();
                
                let data = JSON.parse(rv);
                
                console.warn('apiController.response: ', data);
                
                for (var key in data) {
                    if (data[key].Name) {
                        data[key] = data[key].Name;
                    }
                }
                
                if (typeof callback === 'function') {
                    callback(null, data);
                }
                
            } else {
                console.error('apiController error: ', response.getError());
            }
            
        }));
        $A.enqueueAction(apiController);        
	},
    
    monitor: function(component) {
        let self = this;
        let timeout = component.get('v.timeout') || 1000;
        timeout = timeout < 100 ? 100 : timeout;
        let timer = component.get('v.timer');
        
        timer = setInterval($A.getCallback(function() {
            self.checkStatus(component, function(err, data) {
                if (data) {
                    
                    if (data.RequestStatus === 'Success' || data.RequestStatus === 'Failed') {
                        clearInterval(timer);
                        component.set('v.timer', null);
                        
                        self.updateStatus(component, function() {
                            component.set('v.status', data);
                            
                            self.listDashboards(component);
                            
                            self.testDashboard(component, null);
                            
                        });
                        
                        
                    } else {
                        
                        component.set('v.status', data);

                    }

                	if (data.RequestStatus === 'Success') {
                        // Show success popup?
                        
                    } else if (data.RequestStatus === 'Failed') {
                        // Show failure popup?
                        // 
                    }

                }
            });
        }), timeout);
        
        component.set('v.timer', timer);        
    },
    
    listDashboards: function(component) {
        let sdk = component.find('sdk');
        
        let context = {apiVersion: "50"};
        let methodName = 'listDashboards';

        let templateApiName = component.get('v.templateApiName');
        
        let methodParameters = {
            'templateApiName': templateApiName
        };
        
        sdk.invokeMethod(context, methodName, methodParameters,
                         $A.getCallback(function (err, data) {
                             if (err !== null) {
                                 console.error("SDK error", err);
                             } else {
                                 if (data && data.dashboards && data.dashboards.length > 0) {
                                     component.set('v.dashboards', data.dashboards);
                                 } else {
                                     component.set('v.dashboards', null);
                                 }
                             }
                         }));
    },
    
    testDashboard: function(component, index) {
        let dashboards = component.get('v.dashboards');
        if (dashboards && dashboards.length > 0 && index >= 0) {
            let dashboard = dashboards[index];
            component.set('v.selectedDashboard', dashboard);
        } else {
            component.set('v.selectedDashboard', null);            
        }
    },

    listFolders: function(component, callback) {
        let sdk = component.find('sdk');
        
        let context = {apiVersion: "50"};
        let methodName = 'listFolders';

        let templateApiName = component.get('v.templateApiName');
        let queryName = templateApiName.indexOf('__') >= 0 ? templateApiName.split('__')[1] : templateApiName;
        
        let methodParameters = {
            'q': queryName
        };
        
        sdk.invokeMethod(context, methodName, methodParameters,
                         $A.getCallback(function (err, data) {
                             if (err !== null) {
                                 console.error("SDK error", err);
                             } else {
                                 component.set('v.folders', data.folders);
                             }
                             if (typeof callback === 'function') {
                                 callback(err, data.folders);
                             }
                         }));
    },
    
    listTemplates: function(component, callback) {
        console.warn('listTemplates');
        let self = this;
        let sdk = component.find('sdk');
        
        let context = {apiVersion: "50"};
        let methodName = 'listTemplates';
        let methodParameters = {};
        
        sdk.invokeMethod(context, methodName, methodParameters,
                         $A.getCallback(function (err, data) {
                             if (err !== null) {
                                 console.error("SDK error", err);
                                 if (typeof callback === 'function') {
                                     callback(err, null);
                                 }
                             } else {
                                 console.warn('' + methodName + ' returned: ', data);
                                 if (typeof callback === 'function') {
                                     callback(null, data.templates);
                                 }
                             }
                         }));
        
    },
    
    getTemplateConfig: function(component, templateId, callback) {
        console.warn('getTemplateConfig');
        let self = this;
        let sdk = component.find('sdk');
        
        let context = {apiVersion: "50"};
        let methodName = 'getTemplateConfig';
        let methodParameters = {
            templateId: templateId
        };
        
        sdk.invokeMethod(context, methodName, methodParameters,
                         $A.getCallback(function (err, data) {
                             if (err !== null) {
                                 console.error("SDK error", err);
                                 if (typeof callback === 'function') {
                                     callback(err, null);
                                 }
                             } else {
                                 console.warn('config for templateId: ', templateId);
                                 console.warn('' + methodName + ' returned: ', data);
                                 if (typeof callback === 'function') {
                                     callback(null, data);
                                 }
                             }
                         }));
    }
    
    
    
})