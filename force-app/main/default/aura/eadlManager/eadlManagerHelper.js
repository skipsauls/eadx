({
    createApp: function(component) {
        let self = this;
        
        let apiController = component.get('c.createEmbeddedApp');

        let templateApiName = component.get('v.templateApiName');
        
      	let name = component.get('v.appName');
        
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
            failOnDuplicateNames: true,
            values: values
        };

        // Set the parameters for the API call
        apiController.setParams({
            templateApiName: templateApiName,
            name: name,
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
                
                for (var key in data) {
                    if (data[key].Name) {
                        data[key] = data[key].Name;
                    }
                }
                
                component.set('v.status', data);
                
                if (typeof callback === 'function') {
                    callback(data);
                }
                
            } else {
                console.warn('Not successful');
            }
            
        }));
        $A.enqueueAction(apiController);        
	},
    
    monitor: function(component) {
        let self = this;
        let timeout = component.get('v.timeout') || 1000;
        timeout = timeout < 500 ? 500 : timeout;
        let timer = component.get('v.timer');
        
        timer = setInterval($A.getCallback(function() {
            self.checkStatus(component, function(data) {
                if (data) {
                    
                    if (data.RequestStatus === 'Success' || data.RequestStatus === 'Failed') {
                        clearInterval(timer);
                        component.set('v.timer', null);
                        self.listDashboards(component);
                        self.testDashboard(component, null);
                    }

                	if (data.RequestStatus === 'Success') {
                        // Show success popup?
                    } else if (data.RequestStatus === 'Failed') {
                        // Show failure popup?
                    }

                }
            });
        }), timeout);
        
        component.set('v.timer', timer);        
    },
    
    listDashboards: function(component) {
        let sdk = component.find('sdk');
        
        let context = {apiVersion: "49"};
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
    }
    
})