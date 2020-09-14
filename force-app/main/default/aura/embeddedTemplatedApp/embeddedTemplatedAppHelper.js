({
    failedStatuses: ['Failed', 'Cancelled'],
    inProgressStatuses: ['Enqueued', 'InProgress', 'AppInProgress'],
    successStatuses:['Success'],
    
    showToast : function(cmp, title, message, messageData, variant, mode) {
        cmp.find('notifyLib').showToast({
            title: title,
            message: message,
            messageData: messageData || null,
            variant: variant || 'info',
            mode: mode || 'dismissable'
        });        
    },  
     
    busy: function(cmp, busy){
      	cmp.set('v.busy', busy);  
    },
    
    isCompleted : function(requestStatus){
    	return (this.successStatuses.indexOf(requestStatus) >= 0) ||
            this.failedStatuses.indexOf(requestStatus) >= 0;
	},

    isSuccessful : function(requestStatus){
    	return (this.successStatuses.indexOf(requestStatus) >= 0);
	},

    isInProgress : function(requestStatus){
    	return (this.inProgressStatuses.indexOf(requestStatus) >= 0);
	},
    
    createGenericRequest: function(cmp, requestName, templateApiName, folderId, requestType, requestStatus, configuration){
        var wairApi = cmp.find('wairApi');
        var requestPermissions = cmp.get('v.wairPermissions');
        var templateMetadata = cmp.get('v.templateMetadata');
        if (requestPermissions && requestPermissions.canCreate){  
            var helper = this;
            helper.busy(cmp, true);
            wairApi.createInstallRequest(requestName, templateApiName, folderId, requestType, requestStatus, configuration, function(request, error){
                if (request){
                    cmp.set('v.recentWair', request);
                } else {
                    helper.showToast(cmp, 'Unable to create request ' + requestType, error, null, 'error');
                }
                helper.busy(cmp, false);
            });
        }        
    },

    createOrUpdateAppRequest : function(cmp){
        var wairApi = cmp.find('wairApi');
        var requestPermissions = cmp.get('v.wairPermissions');
        var templateMetadata = cmp.get('v.templateMetadata');
        var templateApiName = cmp.get('v.templateApiName');
        if (requestPermissions && requestPermissions.canCreate){  
            cmp.set('v.busy', true);
            var helper = this;
            var requestTypes = ['WaveAppCreate',
                'WaveAppUpdate',
                'StartDataflow'];
            var searchOptions = [
                'MostRecentOnlyByTemplateAndFolder',
                'ExcludeNonExistingApps'
            ];
            var requestStatuses = [
                'Success'
            ].concat(helper.inProgressStatuses);

            wairApi.searchInstallRequests(templateApiName, null /*folderId*/,
                null /* folderName */, 
                null /* requestName */, 
                requestStatuses, 
                requestTypes,
                searchOptions,
                null,
                1, 
                'Supplemental', 
                function(results, error){
                    var request;
                    if (results){
                        if (results.requests.length > 0){
                            request = results.requests[0];
                            if (helper.isInProgress(request.requestStatus)){
                                helper.showToast(cmp, 'Auto Install Requests', 'Requests are in progress. Please wait.', null, 'error');
                            } else {
                                helper.createGenericRequest(cmp, 'Updating folder ' + request.folderId, 
                                    templateApiName, request.folderId, 'WaveAppUpdate', 'Enqueued', 
                                    {appConfiguration: request.configuration.appConfiguration});
                            }
                        } else {
                            helper.createGenericRequest(cmp, 'No app exists, create new.', templateApiName, null, 'WaveAppCreate', 'Enqueued', {});
                        }
                    } else {
                        helper.showToast(cmp, 'Auto Install Requests', error, null, 'error');
                    }
                    helper.busy(cmp, false);
                });
        }        
    },
    
    updateAppActions: function(cmp){
        var recentWair = cmp.get('v.recentWair');
        var templateMetadata = cmp.get('v.templateMetadata');
        if (null != templateMetadata){
            var label = (null == recentWair || null == recentWair.TemplateVersion|| (templateMetadata.releaseInfo.templateVersion === recentWair.TemplateVersion)) ?
                'Reconfigure' : 'Upgrade';
            cmp.set('v.upgradeResetLabel', label);
        }        
    },
    
    createDeleteRequest : function(cmp){
        var wairApi = cmp.find('wairApi');
        var wairPermissions = cmp.get('v.wairPermissions');
        if (wairPermissions && wairPermissions.canView){            
            var recentWair = cmp.get('v.recentWair');
            var helper = this;
            helper.createGenericRequest(cmp, 'Deleting app ' + recentWair.folderId, 
                cmp.get('v.templateApiName'), recentWair.folderId, 'WaveAppDelete', 'Enqueued', 
                {});
        }        
    },

    cleanOldRequests : function(cmp, notify){
        var wairApi = cmp.find('wairApi');
        var wairPermissions = cmp.get('v.wairPermissions');
        if (wairPermissions && wairPermissions.canView){            
            var helper = this;
            helper.busy(cmp, true);
            wairApi.deleteStaleInstallRequests(cmp.get('v.templateApiName'), null, function(success, errors){
                if (success){
                    if (notify){
                        helper.showToast(cmp, 'Embedded Analytics', 'Deleted ' + deleted.length + 
                                         ' application request' + (deleted.length != 1 ? 's' : '') + '.', null, 'success');                    
                    }
                } else {
                    if (notify){
                        helper.showToast(cmp, 'Auto Install Request Cleanup', error, null, 'error');
                    }
                }
                helper.busy(cmp, false);
            });
        }
    },
    
    getTemplateMetadata : function(cmp) {
        var helper = this;
        var templateApiName = cmp.get('v.templateApiName');
        var sdk = cmp.find("wave-sdk");
        var context = {apiVersion: "49"};
        var methodParameters = {
            'templateId': templateApiName,
            'options': ['ViewOnly']
        };
        sdk.invokeMethod(context, 'getTemplate', methodParameters, $A.getCallback(function (errors, data) {
            if (errors !== null) {
                cmp.set('v.templateMetadata', null);
                helper.determineHeaderRendering(cmp);
                helper.determineViewToRender(cmp);
            } else {
                cmp.set('v.templateMetadata', data);
            }
        }));        
	},
    
	getWairPermissions : function(cmp) {
        var helper = this;
        cmp.set('v.wairPermissions', {
            canCreate: true,
            canView: true,
            canSubscribeToEvents: false
        });
        /*
        var wairApi = cmp.find('wairApi');
        helper.busy(cmp, true);
        wairApi.getWaveAutoInstallRequestPermissions(function(permissions){
            cmp.set('v.wairPermissions', permissions);
            helper.busy(cmp, false);
        }, function(error){
            helper.showToast(cmp, 'Request Permissions', error, null, 'error');
            helper.busy(cmp, false);
        });
        */
	},

    getRecentWairRequestForTemplate : function(cmp) {
        var wairApi = cmp.find('wairApi');
        var wairPermissions = cmp.get('v.wairPermissions');
        var helper = this;
        if (wairPermissions && wairPermissions.canView){            
            var templateApiName = cmp.get('v.templateApiName');
            var helper = this;
            var requestTypes = ['WaveAppCreate',
                'WaveAppUpdate',
                'WaveAppDelete',
                'StartDataflow'];
            wairApi.searchInstallRequests(templateApiName, 
                null /*folderId*/,
                null /* folderName */, 
                null /* requestName */, 
                null /* requestStatuses */, 
                requestTypes,
                ['MostRecentOnlyByTemplateAndFolder', 'ExcludeNonExistingApps'],
                ['LastModifiedDateDescending'],
                1, 
                'Supplemental', 
                function(results, error){
                    if (results){
                        cmp.set('v.recentWair', results.requests.length > 0 ? results.requests[0] : null);
                    } else {
                        helper.showToast(cmp, 'Auto Install Requests', error, null, 'error');
                    }
                    helper.busy(cmp, false);
                });
        }
	},

    startDataflowRequest : function(cmp){
        var wairPermissions = cmp.get('v.wairPermissions');
        if (wairPermissions && wairPermissions.canView){            
            var recentWair = cmp.get('v.recentWair');
            var helper = this;
            helper.busy(cmp, true);
            helper.createGenericRequest(cmp, 'Starting dataflow for app ' + recentWair.folderId, 
                cmp.get('v.templateApiName'), recentWair.folderId, 'StartDataflow', 'Enqueued', 
                {});
        }        
    },
    
    determineHeaderRendering: function(cmp){
        var recentWair = cmp.get('v.recentWair');
        var headerConfig = cmp.get('v.headerConfig');
        var wairPermissions = cmp.get('v.wairPermissions');
        var dashboards = cmp.get('v.dashboardData').data;
		headerConfig.titleEnabled = recentWair != null && 
            recentWair.folderId != null;
        headerConfig.requestActionsEnabled = wairPermissions.canCreate && 
            headerConfig.titleEnabled;
        headerConfig.dashboardActionsEnabled = (null == recentWair || this.isSuccessful(recentWair.requestStatus)) &&
            (null != dashboards && dashboards.length > 1);
        if (!headerConfig.titleEnabled && !headerConfig.requestActionsEnabled && 
            	!headerConfig.dashboardActionsEnabled){
            $A.util.addClass(cmp.find('embedded-main-card'),'hide-title');
        } else {
            $A.util.removeClass(cmp.find('embedded-main-card'),'hide-title');            
        }
        var headerConfig = cmp.set('v.headerConfig', headerConfig);        
    },

    determineViewToRender: function(cmp){
        var recentWair = cmp.get('v.recentWair');
		if (null != recentWair && this.isInProgress(recentWair.requestStatus)){
            this.renderProgressMonitor(cmp);
        } else if (null != recentWair && !this.isSuccessful(recentWair.requestStatus)){
            this.renderApplicationFailed(cmp);
        } else if (null !== cmp.get('v.dashboardData').selected && cmp.get('v.dashboardData').data.length > 0){
            this.renderDashboard(cmp);
        } else {
            this.renderTemplateWizard(cmp);
        }
        this.busy(cmp, false);
    },
    
    renderView: function(cmp, cmpName, config, viewBody){
        var viewContainer = cmp.find('view-container');
        var helper = this;
        var body = !viewBody ? [] : viewBody;
        $A.createComponent(cmpName, config, function(newCmp, status, error){
            if (status === "SUCCESS") {
                body.push(newCmp);
                viewContainer.set("v.body", body);
            }
            else if (status === "INCOMPLETE") {
                helper.showToast(cmp, 'Embedded Analytics: Render View', 
                                 'No response from server or client is offline.', 
                                 null, 'error');
            }
            else if (status === "ERROR") {
                helper.showToast(cmp, 'Embedded Analytics: Render View', 
                                     error.message, null, 'error');                    
           }                
        });        
    },
    
    renderTemplateWizard: function(cmp){
        this.renderView(cmp, 'c:embeddedTemplateWizard', {
            'aura:id': 'embeddedWizard',
            templateApiName: cmp.getReference('v.templateApiName'),
            requestPermissions: cmp.getReference('v.wairPermissions'),
            waveAutoInstallRequest: cmp.getReference('v.recentWair'),
            templateMetadata: cmp.getReference('v.templateMetadata')
        });        
    },
    
    renderProgressMonitor: function(cmp){
        this.renderView(cmp, 'c:waveAutoInstallMonitor', {
            'aura:id': 'progressMonitor',
            requestPermissions: cmp.get('v.wairPermissions'),
            waveAutoInstallRequest: cmp.getReference('v.recentWair'),
            busy: cmp.getReference('v.busy')
        });  
    },
    
    renderApplicationFailed: function(cmp){
        this.renderView(cmp, 'c:embeddedTemplatedAppError', {
            'aura:id': 'appError',
            waveAutoInstallRequest: cmp.getReference('v.recentWair')
        });  
    },
    
    renderDashboard: function(cmp){
        if (null == cmp.find('waveDashboard')){
            this.renderView(cmp, 'wave:waveDashboard', {
                'aura:id': 'waveDashboard',
                dashboardId: cmp.getReference('v.dashboardData.selected'),
                filter: cmp.getReference('v.filter'),
                height: cmp.getReference('v.dashboardHeight'),
                showHeader: false,
                showTitle: false,
                openLinksInNewWindow: false
                });            
        }
    },
    
    loadAppDashboards : function(cmp) {
        var recentWair = cmp.get('v.recentWair');   
        if (null != recentWair && this.isInProgress(recentWair.requestStatus)){
            // Let's not query if request is in progress.
            this.determineHeaderRendering(cmp);
            this.determineViewToRender(cmp);            
            return;
        }
        var templateApiName = cmp.get('v.templateApiName');        
        var dashboardTemplates = cmp.get('v.dashboardTemplates'); 
        var helper = this;
        var sdk = cmp.find("wave-sdk");
        var context = {apiVersion: "46"};
        var methodName = 'listDashboards';
        var methodParameters = {
            'templateApiName': templateApiName, 
            'sort': 'Name',
            'pageSize': 200
        };
        if (null != recentWair && null != recentWair.folderId){ 
            methodParameters.folderId = recentWair.folderId;
        } 
        if (null != dashboardTemplates && '' !== dashboardTemplates.trim()){
            methodParameters.q = dashboardTemplates;
        }
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function (errors, data) {
            if (errors !== null) {
                helper.showToast(cmp, 'Embedded Analytics', errors[0].message, null, 'error');
                cmp.set('v.dashboardData', {selected:null, data:[]});
            } else {
                cmp.set('v.dashboardData', {
                    selected:data.dashboards.length > 0 ?
                        data.dashboards[0].id : null, 
                    data:data.dashboards});
            }
        }));        
    }
})