({
    test: function(component, event, helper) {
        console.warn('test');    
    },
    
    scriptsLoaded: function(component, event, helper) {
        //console.warn('scriptsLoaded - jsondiffpatch: ', jsondiffpatch);    
    },
    
    doDiff: function(component, event, helper) {
        helper.doDiff(component);
    },
    
	handleAssetChange: function(component, event, helper) {
        console.warn('handleAssetChange:');
        helper.getAssetDetails(component, function(err, assetDetails) {
            console.warn('assetDetails: ', assetDetails);

            //var json = JSON.stringify(assetDetails, null, 4);
            //component.set('v.json', json);
            component.set('v.assetDetails', assetDetails);
            
            var type = null;
            type = assetDetails.type === 'dashboard' ? 'dashboards' : type;
            type = assetDetails.type === 'dataset' ? 'datasets' : type;
            type = assetDetails.type === 'lens' ? 'lenses' : type;
            
            console.warn('asset type: ', type);
            
            helper.getVersions(component, type, assetDetails.id, function(err, versions) {
                console.warn('versions: ', versions);
                component.set('v.versions', versions);
            });
        });
	},
    
    listDashboards: function(component, event, helper) {
        helper.listDashboards(component, function(err, dashboards) {
            //console.warn(err, dashboards);
        });        
    },

    handleSelectLeftVersion: function(component, event, helper) {
        var asset = component.get('v.asset');
        var assetDetails = component.get('v.assetDetails');
        var leftVersionId = component.get('v.leftVersionId');
        console.warn('leftVersionId: ', leftVersionId);
        if (leftVersionId !== null && typeof leftVersionId !== 'undefined'  && leftVersionId !== '') {
            if (leftVersionId === 'CURRENT') {
                component.set('v.leftVersion', assetDetails);
                var assetJSON = JSON.stringify(assetDetails, null, 2);
                component.set('v.leftVersionJSON', assetJSON);
            } else {
                var type = null;
                type = assetDetails.type === 'dashboard' ? 'dashboards' : type;
                type = assetDetails.type === 'dataset' ? 'datasets' : type;
                type = assetDetails.type === 'lens' ? 'lenses' : type;
                
            	console.warn('asset type: ', type);
                
                helper.getVersion(component, type, assetDetails.id, leftVersionId, function(err, version) {
                    console.warn('getVersion returned: ', err, version);
	                var versionJSON = JSON.stringify(version, null, 2);
    	            component.set('v.leftVersionJSON', versionJSON);                    
                });
            } 
        }
    },
    

     handleSelectRightVersion: function(component, event, helper) {
        var asset = component.get('v.asset');
        var assetDetails = component.get('v.assetDetails');
        var rightVersionId = component.get('v.rightVersionId');
        console.warn('rightVersionId: ', rightVersionId);
        if (rightVersionId !== null && typeof rightVersionId !== 'undefined'  && rightVersionId !== '') {
            if (rightVersionId === 'CURRENT') {
                component.set('v.rightVersion', assetDetails);
                var assetJSON = JSON.stringify(assetDetails, null, 2);
                component.set('v.rightVersionJSON', assetJSON);
            } else {
                var type = null;
                type = assetDetails.type === 'dashboard' ? 'dashboards' : type;
                type = assetDetails.type === 'dataset' ? 'datasets' : type;
                type = assetDetails.type === 'lens' ? 'lenses' : type;
                
            	console.warn('asset type: ', type);
                
                helper.getVersion(component, type, assetDetails.id, rightVersionId, function(err, version) {
                    console.warn('getVersion returned: ', err, version);
	                var versionJSON = JSON.stringify(version, null, 2);
    	            component.set('v.rightVersionJSON', versionJSON);                    
                });
            } 
        }
    },
    
	handleSelectDashboard: function(component, event, helper) {
        var dashboardId = component.get('v.dashboardId');
        if (dashboardId !== null && typeof dashboardId !== 'undefined') {
            helper.getDashboard(component, dashboardId, function(err, dashboard) {
                component.set('v.dashboard', dashboard);                
                var json = JSON.stringify(dashboard, null, 2);
                //console.warn('dashboard json: ', json);
                component.set('v.dashboardJSON', json);
                var selectedDashboard = component.find('selectedDashboard');
                selectedDashboard.set('v.title', dashboard.label);
                
                helper.getDashboardVersions(component, dashboardId, function(err, versions) {
                    //var container = component.find('dashboard1');
                    //helper.showDashboard(component, dashboardId, container);
                });  
            });  
        }
    },
    
    getDashboard: function(component, event, helper) {
        var dashboardId = component.get('v.dashboardId');
        helper.getDashboard(component, dashboardId, function(err, dashboard) {
            //console.warn(err, dashboard);
            component.set('v.dashboard', dashboard);
        });        
    },
    
    handleSelectVersion: function(component, event, helper) {
        var dashboardId = component.get('v.dashboardId');
        var versionId = component.get('v.versionId');
        if (dashboardId !== null && typeof dashboardId !== 'undefined') {
            if (versionId !== null && typeof versionId !== 'undefined') {
                
                var versions = component.get('v.versions');
                var version = null;
                versions.forEach(function(v) {
                    if (v.id === versionId) {
                        version = v
                    }
                });
                
                helper.getDashboardVersion(component, dashboardId, versionId, function(err, dashboardVersion) {
                    component.set('v.version', dashboardVersion);
                    var json = JSON.stringify(dashboardVersion, null, 2);
                    //console.warn('version json: ', json);
                    //console.warn('version: ', dashboardVersion.id, dashboardVersion.name, json.length);
                    component.set('v.versionJSON', json);
                    
                    helper.doDiff(component);
                    
                    var diff = component.get('v.diff');
                    var annotatedDiff = component.get('v.annotatedDiff');
                    
                    var selectedDashboard = component.find('selectedDashboard');
	                selectedDashboard.set('v.diff', diff);


/*                    
                    var textareas = component.find('json');
                    //console.warn('textareas: ', textareas);
                    
                    textareas = textareas instanceof Array ? textareas : [textareas];
                    
                    textareas.forEach(function(textarea) {
                        //console.warn('textarea: ', textarea, textarea.get('v.name'));
                        
                        if (textarea.get('v.name') === 'json_' + versionId) {                            
	                        textarea.set('v.value', json);
                        }
                    });
*/

                    var previews = component.find('preview');
                    //console.warn('previews: ', previews);
                    
                    previews = previews instanceof Array ? previews : [previews];
                    
                    previews.forEach(function(preview) {
                        //console.warn('preview: ', preview, preview.get('v.name'));
                        
                        if (preview.get('v.name') === 'preview_' + versionId) {                            
                            
                            helper.previewChangedDashboard(component, dashboardId, versionId, function(err, dashboard) {
                                //console.warn('previewChangedDashboard returned: ', err, dashboard);
                                if (dashboard) {
                                    preview.set('v.dashboardId', dashboard.id);
                                    preview.set('v.title', dashboardVersion.label + ' - ' + version.name);
                                    preview.set('v.dashboardJSON', json);
                                    preview.set('v.diff', diff);
                                    	
                                    //helper.showDashboard(component, dashboard.id, preview);            
                                }
                            });                    
                            
                        }
                    });
                });  
            }
        }
    },
    
    getDashboardVersions: function(component, event, helper) {
        var dashboardId = '0FKB00000009UEsOAM';
        helper.getDashboardVersions(component, dashboardId, function(err, versions) {
            console.warn(err, versions);
        });
        
    },
    
    getDashboardVersion: function(component, event, helper) {
        var dashboardId = component.get('v.dashboardId');
        var versionId = component.get('v.versionId');
        helper.getDashboardVersion(component, dashboardId, versionId, function(err, dashboard) {
            console.warn(err, dashboard);
        });        
    },
    
    previewChangedDashboard: function(component, event, helper) {
        var dashboardId = component.get('v.dashboardId');
        var versionId = component.get('v.versionId');
        helper.previewChangedDashboard(component, dashboardId, versionId, function(err, dashboard) {
            //console.warn('previewChangedDashboard returned: ', err, dashboard);
            if (dashboard) {
	            helper.showDashboard(component, dashboard.id, 'dashboard2');            
            }
        });
    },
    
    handleRefreshVersions: function(component, event, helper) {
        var dashboardId = component.get('v.dashboardId');
        helper.getDashboardVersions(component, dashboardId, function(err, versions) {
            console.warn(err, versions);
        });
    },
    
    handleCleanupPreviews: function(component, event, helper) {
        var dashboardId = component.get('v.dashboardId');
        helper.cleanupTempDashboards(component, dashboardId, function(err, dashboard) {
            console.warn(err, dashboard); 
        });
    },
    
    activateTab: function(component, event, helper) {
        console.warn('activateTab: ', event, JSON.parse(JSON.stringify(event)));
        return;
        var tabset = component.find('previewTabset'); 
        console.warn('tabset: ', tabset);
        var versionId = tabset.get('v.selectedTabId');
        if (versionId !== 'intro') {
	        component.set('v.versionId', versionId);
        }
    },
     
    selectTab: function(component, event, helper) {
        console.warn('selectTab: ', event, JSON.parse(JSON.stringify(event)));
        var tabset = component.find('previewTabset'); 
        console.warn('tabset: ', tabset);
        var versionId = tabset.get('v.selectedTabId');
        if (versionId !== 'intro') {
	        component.set('v.versionId', versionId);
        }
    }
    
})