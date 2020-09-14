({
    
    requestActions: [    
        {
            label: 'Get Info',
            name: 'get_info'
        },        
    ],
 
    templateActions: [
        {
            label: 'Get Info',
            name: 'get_info'
        },        
        {
            label: 'Create App',
            name: 'create_app'
        }        
    ],

    appActions: [    
        {
            label: 'Get Info',
            name: 'get_info'
        },        
        {
            label: 'Delete App',
            name: 'delete_app'
        }        
    ],
    
    requestColumns: [
        { label: 'Folder', fieldName: 'Folder', type: 'text' },
        { label: 'Request Type', fieldName: 'RequestType', type: 'text' },
        { label: 'Request Status', fieldName: 'RequestStatus', type: 'text' },
        { label: 'Reason', fieldName: 'FailedReason', type: 'text' },
        { label: 'Created By', fieldName: 'CreatedBy', type: 'text' },
        { label: 'Created Date', fieldName: 'CreatedDate', type: 'date' }
    ],
    
    templateColumns: [
        { label: 'Label', fieldName: 'MasterLabel', type: 'text' },
        { label: 'Namespace', fieldName: 'NamespacePrefix', type: 'text' },
        { label: 'Developer Name', fieldName: 'DeveloperName', type: 'text' },
        { label: 'Version', fieldName: 'AssetVersion', type: 'text' },
        { label: 'Created By', fieldName: 'CreatedBy', type: 'text' },
        { label: 'Created Date', fieldName: 'CreatedDate', type: 'date' }
    ],

    appColumns: [
        { label: 'Name', fieldName: 'Name', type: 'text' },
        { label: 'Namespace', fieldName: 'NamespacePrefix', type: 'text' },
        { label: 'Developer Name', fieldName: 'DeveloperName', type: 'text' },
        { label: 'Read Only', fieldName: 'IsReadOnly', type: 'boolean' },
        { label: 'Created By', fieldName: 'CreatedBy', type: 'text' },
        { label: 'Created Date', fieldName: 'CreatedDate', type: 'date' }
    ],
    
    setupSubscriptions: function(component) {
        
        let self = this;
        const empApi = component.find('empApi');        
        const replayId = -1;
            
		let topic = '/event/WaveAssetEvent';
        
        let callback = function (message) {
            let json = JSON.stringify(message, null, 2);
            console.warn('emp callback message: ', json);
        }
        
        empApi.subscribe(topic, replayId, callback).then(function(value) {	
            console.warn('subscribe returned: ', value);
        });          
    },
    
	getAutoInstallRequests: function(component) {
		
        let self = this;
        
        let apiController = component.get('c.listAutoInstallRequests');
        /*
        apiController.setParams({
            autoInstallRequestId: requestId
        });
        */

        apiController.setCallback(component, $A.getCallback(function(response){
            
            if (response.getState() === 'SUCCESS') {
                
                let rv = response.getReturnValue();
                
                let previousStatusJson = component.get('v.previousStatusJson');                
                
                if (previousStatusJson.indexOf(rv) === 0) {
                    //console.warn('same, do nothing');
                } else {
                    component.set('v.previousStatusJson', rv);
                
                    let data = JSON.parse(rv);
                    data.forEach(function(row) {
                        for (var key in row) {
                            if (row[key].Name) {
                                row[key] = row[key].Name;
                            }
                        }
                    });
                    
	                console.warn('request data: ', data);
                    
                    component.set('v.requestData', data);
                }
            } else {
                console.warn('Not successful');
            }
            
        }));
        $A.enqueueAction(apiController);        
	},
    
    
	getEmbeddedAppTemplates: function(component) {
		
        let self = this;
        
        let apiController = component.get('c.listEmbeddedAppTemplates');
        /*
        apiController.setParams({
            autoInstallRequestId: requestId
        });
        */

        apiController.setCallback(component, $A.getCallback(function(response){
            
            if (response.getState() === 'SUCCESS') {
                
                let rv = response.getReturnValue();
                
                let data = JSON.parse(rv);
                
                data.forEach(function(row) {
                    for (var key in row) {
                        if (row[key].Name) {
                            row[key] = row[key].Name;
                        }
                    }
                });
                
                console.warn('template data: ', data);
                
                component.set('v.templateData', data);

            } else {
                console.warn('Not successful');
            }
            
        }));
        $A.enqueueAction(apiController);        
	},
    
	getEmbeddedApps: function(component) {
		
        let self = this;
        
        let apiController = component.get('c.listEmbeddedApps');
        /*
        apiController.setParams({
            autoInstallRequestId: requestId
        });
        */

        apiController.setCallback(component, $A.getCallback(function(response){
            
            if (response.getState() === 'SUCCESS') {
                
                let rv = response.getReturnValue();
                
                let data = JSON.parse(rv);
                
                data.forEach(function(row) {
                    for (var key in row) {
                        if (row[key].Name) {
                            row[key] = row[key].Name;
                        }
                    }
                });
                
                console.warn('app data: ', data);
                
                component.set('v.appData', data);

            } else {
                console.warn('Not successful');
            }
            
        }));
        $A.enqueueAction(apiController);        
	},
    
    
    iconTypeMapping: {
        'WaveAutoInstallRequest': 'outcome',
        'EmbeddedApp': 'template',
        'Folder': 'app',
        'default': 'default'        
    },
    
    getInfo: function(component, def) {
        let self = this;
        
        let json = JSON.stringify(def, null, 2);
        
        component.set('v.selectedAsset', def);
        component.set('v.selectedAssetJson', json);
        
        console.warn('getInfo: ', JSON.parse(json));
        
        if (def.attributes && def.attributes.type) {
            if (def.attributes.type === 'WaveAutoInstallRequest') {
                def.Icon = self.iconTypeMapping[def.RequestType];
            } else if (def.attributes.type === 'WaveTemplate') {
            	def.Icon = self.iconTypeMapping[def.TemplateType];
            } else if (def.attributes.type === 'Folder') {
                def.Icon = self.iconTypeMapping['Folder']
            } else {
                def.Icon = self.iconTypeMapping[def.attributes.type];
            }
        } 
        
      	def.Icon = def.Icon || self.iconTypeMapping['default'];
        
        console.warn('def.Icon: ', def.Icon);
        
        if (def.Type === 'Insights') {
            self.listAppAssets(component, def);
        } else {
            component.set('v.selectedAssetDashboards', null);
        }

    },
    
    listAppAssets: function(component, appDef) {
        let self = this;
        
        console.warn('listAppAssets: ', JSON.parse(JSON.stringify(appDef)));

        // For embedded apps we typically would only show dashboards
        // Other assets aren't accessible to most users
        let apiController = component.get('c.listEmbeddedAppDashboards');

       	// Get the app/folder ID
       	let folderId = appDef.Id;
        console.warn('folderId: ', folderId);
        
        // The API name is the app namespace prefix and developer name in ns__name format
        let apiName = appDef.NamespacePrefix ? appDef.NamespacePrefix + '__' : '';
        apiName += appDef.DeveloperName;
        
        console.warn('apiName: ', apiName);
        
        
        // Get the app name
      	let name = appDef.Name;
        console.warn('name: ', name);
        
        
        // Set the parameters for the API call
        apiController.setParams({
            folderId: folderId,
            name: name,
            apiName: apiName
        });

        apiController.setCallback(component, $A.getCallback(function(response){
            
            if (response.getState() === 'SUCCESS') {
                
                let rv = response.getReturnValue();
                console.warn('rv: ', rv);
                let data = JSON.parse(rv);
                console.warn('data": ', data);
                
                data.forEach(function(row) {
                    for (var key in row) {
                        if (row[key].Name) {
                            row[key] = row[key].Name;
                        }
                    }
                });
                
                component.set('v.selectedAssetDashboards', data);

            } else {
                console.warn('Not successful');
            }
            
        }));
        $A.enqueueAction(apiController);        
    	
    
	},
    
    deleteApp: function(component, appDef) {
        let self = this;
        
        console.warn('deleteApp: ', JSON.parse(JSON.stringify(appDef)));

        let apiController = component.get('c.deleteEmbeddedApp');

       	// Get the app/folder ID
       	let folderId = appDef.Id;
        console.warn('folderId: ', folderId);
        
        // The API name is the app namespace prefix and developer name in ns__name format
        let apiName = appDef.NamespacePrefix ? appDef.NamespacePrefix + '__' : '';
        apiName += appDef.DeveloperName;
        
        console.warn('apiName: ', apiName);
        
        
        // Get the app name
      	let name = appDef.Name;
        console.warn('name: ', name);
        
        
        // Set the parameters for the API call
        apiController.setParams({
            folderId: folderId,
            name: name,
            apiName: apiName
        });

        apiController.setCallback(component, $A.getCallback(function(response){
            
            if (response.getState() === 'SUCCESS') {
                
                let rv = response.getReturnValue();
                console.warn('rv: ', rv);
                let data = JSON.parse(rv);
                

            } else {
                console.warn('Not successful');
            }
            
        }));
        $A.enqueueAction(apiController);        
    	
    
	},
    
    createApp: function(component, templateDef) {
        let self = this;
        
        console.warn('createApp: ', JSON.parse(JSON.stringify(templateDef)));
        
        let apiController = component.get('c.createEmbeddedApp');

        // The template API name is the template namespace prefix and developer name in ns__name format
        // Typically templates will use the package name space
        let templateApiName = templateDef.NamespacePrefix ? templateDef.NamespacePrefix + '__' : '';
        templateApiName += templateDef.DeveloperName;
        
        console.warn('templateApiName: ', templateApiName);
        
        
        // Use the template master label for the app name
        // Not typically user-settable in embedded apps?
      	let name = templateDef.MasterLabel;
        
        console.warn('name: ', name);
        
        
        // Assign any variable values
        let values = {
            'myVariableName1': 'someValue'
        };
        
		// Create the appConfiguration with desired settings
		// See docs for complete listing
        let appConfiguration = {
            deleteAppOnConstructionFailure: true,
            autoShareWithLicensedUsers: true,
            autoShareWithOriginator: true,
            values: values
        };

        console.warn('appConfiguration: ', appConfiguration);
        
        
        // Set the parameters for the API call
        apiController.setParams({
            templateApiName: templateApiName,
            name: name,
            appConfiguration: appConfiguration
        });

        apiController.setCallback(component, $A.getCallback(function(response){
            
            if (response.getState() === 'SUCCESS') {
                
                let rv = response.getReturnValue();
                console.warn('rv: ', rv);
                let data = JSON.parse(rv);
                

            } else {
                console.warn('Not successful');
            }
            
        }));
        $A.enqueueAction(apiController);        
    	
    
	}
    
    
})