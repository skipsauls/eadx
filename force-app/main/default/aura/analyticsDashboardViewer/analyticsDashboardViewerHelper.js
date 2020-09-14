({
    showDashboard: function(component, dashboardId, versionId) {
        
        console.warn('analyticsDashboardViewerHelper.showDashboard: ', dashboardId, versionId);
        
        //return;
        
        
        var self = this;
        
        var height = component.get('v.height');

		/*        
        //var outer = component.find("dashboard-outer");
        //$A.util.removeClass(outer, "fadein");
        //$A.util.addClass(outer, "fadeout");
        */
        
        var config = {
            dashboardId: dashboardId,
            height: height,
            openLinksInNewWindow: true,
            showHeader: false,
            showTitle: false,
            showSharing: false
        };
        $A.createComponent("wave:waveDashboard", config, function(cmp, msg, err) {
            console.warn('analyticsDashboardViewer.showDashboard createComponent returned: ', cmp, msg, err);
            var dashboard = component.find("dashboard");
            if (err) {
                console.warn("error: ", err);
            } else {
                $A.util.addClass(cmp, "dashboard-container");
                //$A.util.addClass(outer, "hidden");
               	let body = [];
                body.push(cmp);
                dashboard.set("v.body", body);
                
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
    
    getDashboard: function(component, dashboardId, callback) {
        //console.warn('analyticsDashboardViewerHelper.getDashboard: ', dashboardId);
        
        var proxy = component.find('proxy');
        var self = this;
        var url = '/services/data/v46.0/wave/dashboards/' + dashboardId;
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
    
    getDashboardVersion: function(component, dashboardId, versionId, callback) {
        //console.warn('analyticsDashboardViewerHelper.getDashboardVersion: ', dashboardId, versionId);
        
        var proxy = component.find('proxy');
        var self = this;
        var url = '/services/data/v46.0/wave/dashboards/' + dashboardId + '/versions/' + versionId;
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
    
    previewChangedDashboard: function(component, dashboardId, versionId, callback) {
        //console.warn('analyticsDashboardViewerHelper.previewChangedDashboard: ', dashboardId, versionId);
        
        var self = this;
        
        if (versionId === 'CURRENT') {
            self.getDashboard(component, dashboardId, callback);
        } else if (typeof versionId !== 'undefined' && versionId !== null && versionId !== '') {
            
            self.getDashboardVersions(component, dashboardId, function(err, versions) {
                
                //console.warn('versions: ', versions);
                
                component.set('v.versions', versions);
                
                var version = null;
                versions.forEach(function(v) {
                    if (v.id === versionId) {
                        version = v;
                    }    
                });
                
                //console.warn('version: ', version);
                
                var proxy = component.find('proxy');
                
                self.getDashboardVersion(component, dashboardId, versionId, function(err, dashboard) {
                    //console.warn('getDashboardVersion returned: ', dashboard);
                    if (err) {
                        console.warn('createTempDashboard error: ', err);
                    } else {
                        var url = '/services/data/v46.0/wave/dashboards';
                        var method = 'POST';
                        
                        var uname = dashboard.name + '_' + version.name + '_preview';
                        uname = uname.replace(new RegExp(' ', 'g'), '_');
                        console.warn('uname: ', uname);
                        
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
            });
            
        }
        
    },
    
    listDashboards: function(component, callback) {
        //console.warn('listDashboards');
        
        var proxy = component.find('proxy');
        var self = this;
        var url = '/services/data/v46.0/wave/dashboards';
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
    
    getVersions: function(component, type, id, callback) {
        console.warn('getVersions:', type, id);
        
        var proxy = component.find('proxy');
        var self = this;
        var url = '/services/data/v46.0/wave/' + type + '/' + id + '/versions';
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
        this.getVersions(component, 'dashboards', dashboardId, callback);                
    },
    
    describeDashboard: function(component, dashboardId, callback) {
        var sdk = null;
        try {            
            sdk = component.find("sdk");
            //console.warn('describeDashboard - sdk: ', sdk);
        } catch (e) {
            console.error("Exception: ", e);
            if (callback !== null && typeof callback !== 'undefined') {
                callback(e, null);
            }
            return;
        }
        
        var context = {apiVersion: "44"};
        var methodName = "describeDashboard";
        var methodParameters = {
            dashboardId: dashboardId
        };
        //sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
        sdk.invokeMethod(context, methodName, methodParameters, function(err, data) {
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
        });
        //}));
    },
    
    // Forces dashboard to redraw
    updateSelection: function(component, init, target) {
        var values = init === true ? [component.get('v.fieldValue')] : [null];
        var self = this;
        var selection = {
            datasets: {}
        };
        
        selection.datasets[component.get("v.datasetName")] = [
            {
                fields: [component.get('v.fieldName')],
                selection: values
            }
        ];
        
        
        var json = JSON.stringify(selection);
        
        var dashboardId = target; //component.get('v.dashboardId');
        var evt = $A.get('e.wave:update');
        var params = {
            value: json,
            id: dashboardId,
            type: "dashboard"
        };
        evt.setParams(params);
        evt.fire();
        
        if (init === true) {
            setTimeout($A.getCallback(function() {
                self.updateSelection(component, false, target)
            }, 50));
        }
    }
})