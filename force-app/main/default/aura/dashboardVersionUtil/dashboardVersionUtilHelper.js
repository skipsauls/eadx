({
    setup: function(component) {
        var proxy = component.find('proxy');
        var ready = proxy.get('v.ready');
        var self = this;
        if (ready === false) {
            setTimeout(function() {
                self.setup(component);
            }, 100);
        } else {
            self.listDashboards(component, function(err, dashboards) {
                component.set('v.dashboards', dashboards);            
            });
        }
    },
    
    getAssetDetails: function(component, callback) {        
        var sdk = component.find('sdk');
        
        var asset = component.get('v.asset');
        if (asset === null || typeof asset === 'undefined') {
            callback(null, null);
        } else {
            console.warn('asset: ', JSON.stringify(asset, null, 2));
            var assetType = asset.type;
            var assetId = asset.id;
            
            var dashboardId = asset.type === 'dashboard' ? assetId : null;
            var datasetId = asset.type === 'dataset' ? assetId : null;
            var lensId = asset.type === 'lens' ? assetId : null;
            
            component.set('v.dashboardId', dashboardId);
            component.set('v.datasetId', datasetId);
            component.set('v.lensId', lensId);
            
            var context = {apiVersion: '42'};
            var camelTypeName = assetType.substring(0, 1).toUpperCase() + assetType.substring(1);
            component.set('v.assetCamelType', camelTypeName);
            
            var methodName = 'describe' + camelTypeName;
            var methodParameters = {};
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
        }
    },
    
    doDiff: function(component) {
    	var dashboard = component.get('v.dashboard');
        var version = component.get('v.version');
        
        //console.warn('dashboard: ', dashboard);
        //console.warn('version: ', version);
        
        var delta = jsondiffpatch.diff(version, dashboard);
        //console.warn('delta: ', delta);
        
        var diff = jsondiffpatch.formatters.html.format(delta, version);
        var annotatedDiff = jsondiffpatch.formatters.annotated.format(delta, version);

        console.warn('diff: ', diff);
        console.warn('annotatedDiff: ', annotatedDiff);
        
        component.set('v.diff', diff);
        component.set('v.annotatedDiff', annotatedDiff);
        
    },
    
    listDashboards: function(component, callback) {
        //console.warn('listDashboards');
        
        var proxy = component.find('proxy');
        var self = this;
        var url = '/services/data/v43.0/wave/dashboards';
        var method = 'GET';
        
        var body = null;
        
        proxy.exec(url, method, body, function(response) {
            response = JSON.parse(JSON.stringify(response));
            if (response && response.body) {
                var dashboards = response.body.dashboards;
                
                // Filter out the previews
                var filteredDashboards = [];
                dashboards.forEach(function(dashboard) {
                    if (dashboard.name.indexOf('_preview') < 0) {
                        filteredDashboards.push(dashboard);
                    }
                });
                
                component.set('v.dashboards', filteredDashboards);
                
                component.set('v.filteredDashboards', filteredDashboards);
                
                if (typeof callback === 'function') {
                    callback(null, dashboards);
                }
            }
        });
    },
    
    getDashboard: function(component, dashboardId, callback) {
        //console.warn('getDashboard: ', dashboardId);
        
        var proxy = component.find('proxy');
        var self = this;
        var url = '/services/data/v43.0/wave/dashboards/' + dashboardId;
        var method = 'GET';
        
        var body = null;
        
        proxy.exec(url, method, body, function(response) {
            response = JSON.parse(JSON.stringify(response));
            if (response && response.body) {
                if (typeof callback === 'function') {
                    callback(null, response.body);
                }
            }
        });
    },
    
    getVersions: function(component, type, id, callback) {
        console.warn('getVersions:', type, id);
                
        var proxy = component.find('proxy');
        var self = this;
        var url = '/services/data/v43.0/wave/' + type + '/' + id + '/versions';
        var method = 'GET';
        
        var body = null;
        
        proxy.exec(url, method, body, function(response) {
            //console.warn('response: ', response);
            response = JSON.parse(JSON.stringify(response));
            //console.warn('JSON response: ', response);
            if (response && response.body) {
                var versions = response.body.versions;
                
                // Note: What order is best? May need to sort on last modified date?
                //versions.reverse();
                
                // Make the dates ready for display
                versions.forEach(function(version) {
                    if (typeof version.lastModifiedDate === 'undefined' || version.lastModifiedDate === null) {
                        version.lastModifiedDate = version.createdDate;
                    }
                    version.formattedLastModifiedDate = new Date(version.lastModifiedDate).toLocaleString();
                });
                
                component.set('v.versions', versions);
                if (typeof callback === 'function') {
                    callback(null, versions);
                }
            }
        });
    },

    getDashboardVersions: function(component, dashboardId, callback) {
		this.getVersions(component, 'dashboard', dashboardId, callback);                
    },
    
    getDatasetVersions: function(component, datasetId, callback) {
		this.getVersions(component, 'dataset', datasetId, callback);        
    },
    
    getVersion: function(component, type, id, versionId, callback) {
        console.warn('getVersion:', type, id, versionId);
                
        var proxy = component.find('proxy');
        var self = this;
        var url = '/services/data/v43.0/wave/' + type + '/' + id + '/versions/' + versionId;
        var method = 'GET';
        
        console.warn('url: ', url);
        
        var body = null;
        
        proxy.exec(url, method, body, function(response) {
            console.warn('response: ', response);
            response = JSON.parse(JSON.stringify(response));
            console.warn('JSON response: ', response);
            if (response && response.body) {
                if (typeof callback === 'function') {
                    callback(null, response.body);
                }
            }
        });
    },
    
    getDashboardVersion: function(component, dashboardId, versionId, callback) {
        //console.warn('getDashboardVersion: ', dashboardId, versionId);
        
        var proxy = component.find('proxy');
        var self = this;
        var url = '/services/data/v43.0/wave/dashboards/' + dashboardId + '/versions/' + versionId;
        var method = 'GET';
        
        var body = null;
        
        proxy.exec(url, method, body, function(response) {
            response = JSON.parse(JSON.stringify(response));
            //console.warn('getDashboardVersion response: ', response);
            if (response && response.body) {
                if (typeof callback === 'function') {
                    callback(null, response.body);
                }
            }
        });
    },
    
    showDashboard: function(component, dashboardId, container) {
        //console.warn('showDashboard: ', dashboardId, cmp);
        var self = this;
        
        if (typeof dashboardId !== 'undefined' && dashboardId !== null && dashboardId !== ''){
            var config = {
                dashboardId: dashboardId,
                height: "700",
                openLinksInNewWindow: true,
                showHeader: false,
                showTitle: false,
                showSharing: false
            };
            $A.createComponent("wave:waveDashboard", config, $A.getCallback(function(cmp, msg, err) {
                
                //var dashboard = component.find(auraId);

                if (err) {
                    console.warn("error: ", err);
                } else {
                    container.set("v.body", [cmp]);
                }            
            }));
        }
        
    },
    
    previewChangedDashboard: function(component, dashboardId, versionId, callback) {
        //console.warn('previewChangedDashboard: ', dashboardId, versionId);
        
        var versions = component.get('v.versions');
        var version = null;
        versions.forEach(function(v) {
            if (v.id === versionId) {
                version = v;
            }    
        });
        
        //console.warn('version: ', version);
        
        var proxy = component.find('proxy');
        var self = this;
        
        self.getDashboardVersion(component, dashboardId, versionId, function(err, dashboard) {
            //console.warn('getDashboardVersion returned: ', dashboard);
            if (err) {
                console.warn('createTempDashboard error: ', err);
            } else {
                var url = '/services/data/v43.0/wave/dashboards';
                var method = 'POST';
                
                var uname = dashboard.name + '_' + version.name + '_preview';
                uname = uname.replace(new RegExp(' ', 'g'), '_');
                //console.warn('uname: ', uname);
                
                // Refresh the list of dashboards
        		self.listDashboards(component, function(err, dashboards) {
                    //console.warn('listDashboards returned: ', err, dashboards);
                    var existingDashboard = null;
                    dashboards.forEach(function(d) {
                        if (d.name === uname) {
                            existingDashboard = d;
                        }
                    });
                    //console.warn('existingDashboard: ', existingDashboard);
                    if (existingDashboard !== null) {
                        // Preview exists, so use it
                        callback(null, existingDashboard)
                    } else {
                
                        // Create a preview dashboard from the version

						// Clean the dashboard JSON up for creating a preview                        
                        if (dashboard.state && dashboard.state.steps) {
                            var step = null;
                            for(var name in dashboard.state.steps) {
                                step = dashboard.state.steps[name];
                                if (step.datasets) {
                                    step.datasets.forEach(function(dataset) {
                                        if (dataset.label) {
                                            delete dataset.label;
                                        }
                                    });
                                }
                            }
                        }
                        
                        
                        var def = {
                            description: dashboard.description,
                            label: dashboard.label + ' - ' + version.name,
                            name: uname,
                            folder: {
                                id: dashboard.folder.id
                            },
                            state: dashboard.state,
                            mobileDisabled: dashboard.mobileDisabled
                        };
                        
                        var body = JSON.stringify(def);
                        
                        // Replace &quot; with \"
                        body = body.replace(new RegExp('\&quot\;', 'g'), '\\"');
                        
                        proxy.exec(url, method, body, function(response) {
                            response = JSON.parse(JSON.stringify(response));
                            //console.warn('createTempDashboard response: ', response);
                            if (response && response.body) {
                                var newDashboard = JSON.parse(response.body);
                                if (typeof callback === 'function') {
                                    callback(null, newDashboard);
                                }
                            }
                        });                
                    }
                });
            }
        });
    },
    
    cleanupTempDashboards: function(component, dashboardId, callback) {
        console.warn('dashboardVersionUtilHelper.cleanupTempDashboards: ', dashboardId);
        
        
        var dashboard = component.get('v.dashboard');
        
        var self = this;
        var versions = component.get('v.versions');

        // Create a map with the unique names
        var unameMap = {};
        var uname = null;
        versions.forEach(function(version) {
            uname = dashboard.name + '_' + version.name + '_preview';
            uname = uname.replace(new RegExp(' ', 'g'), '_');
            unameMap[uname] = version;
            
        });
        
        console.warn('unameMap: ', unameMap);
        
        var queue = [];
        
        // Get the latest list of dashboards
        self.listDashboards(component, function(err, dashboards) {
            console.warn(err, dashboards);
            dashboards.forEach(function(dashboard) {
                console.warn('checking dashboard.name: ', dashboard.name);
                if (unameMap[dashboard.name]) {
                    console.warn('match found, deleting dashboard.id: ', dashboard.id);
                    queue.push(dashboard);
                    // OLDER id only!
                    //queue.push(dashboard.id);
                } 
            });
            
            console.warn('queue: ', queue);
            
            component.set('v.previewDashboards', queue);

            $A.createComponent("c:dashboardList", {dashboards: queue}, function(content, status) {
                console.warn('createComponent returned: ', content, status);
                if (status === "SUCCESS") {
                    component.find('overlayLib').showCustomModal({
                        body: content, 
                        showCloseButton: true,
                        cssClass: ""
                    })
                }
            });             
            
            return;
            
            self.cleanupTempDashboard(component, queue, function(err, resp) {
                console.warn('cleanupTempDashboard returned: ', err, resp);
            });
        });
    },
    
    cleanupTempDashboard: function(component, queue, callback) {
        console.warn('dashboardVersionUtilHelper.cleanupTempDashboard: ', queue, queue.length);
        
        var proxy = component.find('proxy');
        var self = this;
        
        var dashboardId = queue.pop();
        console.warn('popped ', dashboardId, ' off the queue');
        console.warn('queue length: ', queue.length);
        
        var url = '/services/data/v43.0/wave/dashboards/' + dashboardId;
        var method = 'DELETE';                
        
        proxy.exec(url, method, null, function(response) {
            response = JSON.parse(JSON.stringify(response));
            console.warn('cleanupTempDashboard response: ', response);
            if (response && response.body) {
                if (queue.length > 0) {
                    self.cleanupTempDashboard(component, queue, callback);
                } else {
	                if (typeof callback === 'function') {
    	                callback(null, 'done');
        	        }
                }
            }
        });                
    }
    
})