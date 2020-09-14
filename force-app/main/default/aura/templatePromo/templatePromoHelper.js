({
    setup: function(component) {
        console.warn('setup');
        
        var templateDeveloperName = component.get('v.templateDeveloperName');
        var self = this;
        
        var appName = component.get('v.appName');
        
        component.set('v.assetSharingUrl', null);        
        component.set('v.upgradable', false);
        
        // See if the specified folder/app already exists
        self.listFolders(component, {q: appName}, function(err, folders) {
            console.warn('folders: ', folders);
            var folder = null;
            if (folders.length > 0) {
                console.warn('app exists');
                folder = folders[0];
                component.set('v.folder', folder);
                component.set('v.assetSharingUrl', folder.assetSharingUrl);
                component.set('v.mode', 'installed');
            } else {
                component.set('v.mode', 'install');
            }
            
            self.listTemplates(component, {}, function(err, templates) {
                console.warn('templates: ', templates);
                var devName = null;
                var currentTemplate = null;
                templates.forEach(function(template) {
                    devName = (template.namespace ? template.namespace + '__' : '') + template.name;
                    if (devName === templateDeveloperName) {
                        currentTemplate = template;
                    }
                });
                console.warn('currentTemplate: ', currentTemplate);
                component.set('v.template', currentTemplate);
                
                if (folder && currentTemplate) {
                    if (folder.templateVersion !== currentTemplate.releaseInfo.templateVersion) {
                        console.warn('Versions do not match!');
                        component.set('v.upgradable', true);
                    }
                }
            });
        });
        
        self.setupStreaming(component);
    },
    
    setupStreaming: function(component) {
        console.warn('setupStreaming');
        
        var self = this;
        var empApi = component.find("empApi");

        var channel = '/event/WaveAssetEvent';
        var replayId = -2;
        
        // Callback function to be passed in the subscribe call.
        // After an event is received, this callback prints the event
        // payload to the console.
        var callback = function (message) {

            console.log("Received [" + message.channel +
                        " : " + message.data.event.replayId + "] payload=" +
                        JSON.stringify(message.data.payload));

            var payload = message.data.payload;
            payload = JSON.parse(JSON.stringify(payload));
            console.warn('payload: ', payload);
            component.set('v.status', payload);
            if (payload.EventType === 'Application' && payload.Status === 'Success') {
                component.set('v.mode', 'installed');
                component.set('v.status', null);
                // Call setup to update the UI
                self.setup(component);
            }
            
        }.bind(this);
        
        var errorHandler = function (message) {
            console.log("Received error ", message);
        }.bind(this);
        
        empApi.onError(errorHandler);
        
        empApi.subscribe(channel, replayId, callback).then(function(value) {
            console.log("Subscribed to channel " + channel);
            component.set("v.sub", value);
        });        
    },
    
    installApp: function(component) {
        console.warn('helper.installApp');
        var self = this;
        self.getTemplateConfig(component, function(err, config) {            
            if (config !== null && typeof config !== 'undefined') {
                console.warn('config: ', config);
                self.createApp(component, function(err, result) {
                    console.warn('createApp returned: ', err, result);
                    if (result) {
                        component.set('v.assetSharingUrl', result.assetSharingUrl);
                        if (result.applicationStatus === 'inprogressstatus') {
                            component.set('v.mode', 'installing');
                        }
                    }
                });
            }
        });
    },
    
    upgradeApp: function(component) {
        console.warn('helper.upgradeApp');
        var self = this;
        var folder = component.get('v.folder');
        
        if (folder !== null && typeof folder !== 'undefined') {
            var sdk = component.find('sdk');
            
            var context = {apiVersion: '43'};        
            var methodName = 'upgradeFolder';
            var methodParameters = {
                folderId: folder.id
            };
            
            sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, result) {
                if (err !== null) {
                    console.error(methodName + ' error: ', err);
                    
                } else {
                    console.warn('update successful: ', result);
                    if (result) {
                        component.set('v.assetSharingUrl', result.assetSharingUrl);
                        if (result.applicationStatus === 'inprogressstatus') {
                            component.set('v.mode', 'installing');
                        }
                    }
                }
            }));        
            
        }
    },
    
    removeApp: function(component) {
        console.warn('helper.removeApp');
        var self = this;
        var folder = component.get('v.folder');
        
        if (folder !== null && typeof folder !== 'undefined') {
            var sdk = component.find('sdk');
            
            var context = {apiVersion: '43'};        
            var methodName = 'deleteFolder';
            var methodParameters = {
                folderId: folder.id
            };
            
            sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, result) {
                if (err !== null) {
                    console.error(methodName + ' error: ', err);
                    
                } else {
                    console.warn('delete successful: ', result);
                    // Call setup to refresh the UI
                    self.setup(component);
                }
            }));        
            
        }
    },
    
    createApp: function(component, callback) {
        console.warn('helper.createApp');
        var self = this;
        var template = component.get('v.template');
        
        if (template !== null && typeof template !== 'undefined') {
            var sdk = component.find('sdk');
            
            var appName = component.get('v.appName');
            var appLabel = component.get('v.appLabel');
            var appDescription = component.get('v.appDescription');
            
            var templateValues = component.get('v.templateValues');
            
            var context = {apiVersion: '43'};        
            var methodName = 'createFolder';
            var methodParameters = {
                name: appName,
                label: appLabel,
                description: appDescription,
                templateSourceId: template.id,
                templateValues: templateValues
            };
            
            sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
                if (err !== null) {
                    console.error(methodName + ' error: ', err);
                    if (typeof callback === 'function') {
                        callback(err, null);
                    } else {
                        return err;
                    }
                } else {
                    if (typeof callback === 'function') {
                        callback(null, data);
                    } else {
                        return data;
                    }
                }
            }));        
            
        } else {
            if (typeof callback === 'function') {
                callback({error: 'No template'}, null);
            }
        }
    },
    
    listFolders: function(component, methodParameters, callback) {
        var self = this;
        var sdk = component.find('sdk');
        
        var context = {apiVersion: '43'};        
        var methodName = 'listFolders';
        
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            if (err !== null) {
                console.error(methodName + ' error: ', err);
                if (typeof callback === 'function') {
                    callback(err, null);
                } else {
                    return err;
                }
            } else {
                if (typeof callback === 'function') {
                    callback(null, data.folders);
                } else {
                    return data.folders;
                }
            }
        }));        
    },
    
    listTemplates: function(component, methodParameters, callback) {
        var self = this;
        var sdk = component.find('sdk');
        
        var context = {apiVersion: '43'};        
        var methodName = 'listTemplates';
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            if (err !== null) {
                console.error(methodName + ' error: ', err);
                if (typeof callback === 'function') {
                    callback(err, null);
                } else {
                    return err;
                }
            } else {
                if (typeof callback === 'function') {
                    callback(null, data.templates);
                } else {
                    return data.templates;
                }
            }
        }));        
    },
    
    getTemplateConfig: function(component, callback) {
        var self = this;
        var template = component.get('v.template');
        if (template !== null && typeof template !== 'undefined') {
            var sdk = component.find('sdk');
            
            var context = {apiVersion: '43'};        
            var methodName = 'getTemplateConfig';
            var methodParameters = {
                templateId: template.id
            };
            sdk.invokeMethod(context, methodName, methodParameters, function(err, data) {
                if (err !== null) {
                    console.error(methodName + ' error: ', err);
                    if (typeof callback === 'function') {
                        callback(err, null);
                    } else {
                        return err;
                    }
                } else {
                    var config = JSON.parse(JSON.stringify(data));
                    if (typeof callback === 'function') {
                        callback(null, config);
                    } else {
                        return config;
                    }
                }
            });
        } else {
            if (typeof callback === 'function') {
                callback({error: 'No template'}, null);
            }
        }
    }
})