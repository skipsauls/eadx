({
    handleProxyReady: function(component, event, helper) {
    	let proxy = component.find('proxy');
        let url = '/services/data';
        proxy.exec(url, 'GET', null, function(response) {
            let apiVersion = response.body[response.body.length - 1];
            console.warn('apiVersion', apiVersion);
            component.set('v.apiVersion', apiVersion);
            
            proxy.exec(apiVersion.url + '/wave', 'GET', null, function(response) {
               	let waveUrls = response.body;
                console.warn('waveUrls: ', waveUrls);
                component.set('v.waveUrls', waveUrls);
                
                component.set('v.ready', true);
            });
        })
    },
    
	getAsset: function(component, event, helper) {
        let params = event.getParam('arguments');
        if (params) {
            if (params.config) {
                let config = params.config;
                if (config.id) {
                    if (config.type) {
                        helper.getAssetByType(component, config.id, config.type, function(err, asset) {
                            if (typeof params.callback === 'function') {
                                params.callback(err, asset);
                            } 
                        });
                    }
                }
            }
        }
	},
    
    getDataset: function(component, event, helper) {
        let params = event.getParam('arguments');
        if (params) {
            helper.getAssetByType(component, params.id, 'dataset', function(err, asset) {
                if (typeof params.callback === 'function') {
                    params.callback(err, asset);
                } 
            });
        }
    },

    getDatasetDetails: function(component, event, helper) {
        let params = event.getParam('arguments');
        if (params) {
            helper.getDatasetDetails(component, params.dataset, function(err, details) {
                if (typeof params.callback === 'function') {
                    params.callback(err, details);
                } 
            });
        }
    },

    getRecipeFile: function(component, event, helper) {
        let params = event.getParam('arguments');
        if (params) {
            helper.getRecipeFile(component, params.url, function(err, file) {
                if (typeof params.callback === 'function') {
                    params.callback(err, file);
                } 
            });
        }        
    },
    
    listDashboards: function(component, event, helper) {
        let params = event.getParam('arguments');
        if (params) {
            helper.listDashboards(component, null, function(err, dashboards) {
                if (typeof params.callback === 'function') {
                    params.callback(err, dashboards);
                } 
            });
        }
    },
    
    describeDashboard: function(component, event, helper) {
        let params = event.getParam('arguments');
        if (params) {
            helper.describeDashboard(component, params.id, function(err, dashboard) {
                if (typeof params.callback === 'function') {
                    params.callback(err, dashboard);
                } 
            });
        }
    },
    
    listRecipes: function(component, event, helper) {
        let params = event.getParam('arguments');
        if (params) {
            helper.listRecipes(component, function(err, recipes) {
                if (typeof params.callback === 'function') {
                    params.callback(err, recipes);
                } 
            });
        }
    },

    listDatasets: function(component, event, helper) {
        let params = event.getParam('arguments');
        console.warn('assetManagerController.listDatasets: ', params);
        if (params) {
            helper.listDatasets(component, function(err, datasets) {
                console.warn('calling callback: ', params.callback, ', with datasets: ', datasets);
                if (typeof params.callback === 'function') {
                    params.callback(err, datasets);
                } 
            });
        }
    },
    
    listReplicatedDatasets: function(component, event, helper) {
        let params = event.getParam('arguments');
        if (params) {
            helper.listReplicatedDatasets(component, function(err, replicatedDatasets) {
                if (typeof params.callback === 'function') {
                    params.callback(err, replicatedDatasets);
                } 
            });
        }
    },

    getReplicatedDatasetFields: function(component, event, helper) {
        let params = event.getParam('arguments');
        if (params) {
            helper.getReplicatedDatasetFields(component, params.url, function(err, fields) {
                if (typeof params.callback === 'function') {
                    params.callback(err, fields);
                } 
            });
        }
    },
    
   
    
})