({
    
    assetTypes: {
        'dashboards': {
            label: 'Dashboards',
            name: 'dashboards'
        },
        'lenses': {
            label: 'Lenses',
            name: 'lenses'
        },
        'datasets': {
            label: 'Datasets',
            name: 'datasets'
        },        
        'dataflows': {
            label: 'Dataflows',
            name: 'dataflows'
        },            
        'folders': {
            label: 'Apps',
            name: 'folders'
        },
        'templates': {
            label: 'Templates',
            name: 'templates'
        },
        'analyses': {
            label: 'Stories',
            name: 'analyses'
        }
    },
    
    refreshTree: function(component, callback) {
        let self = this;
        let assetTypes = component.get('v.assetTypes');
        
        // Support using * for all
        if (assetTypes.length === 1 && assetTypes[0] === '*') {
            assetTypes = [];
            for (var key in self.assetTypes) {
                assetTypes.push(key)
            }
        }
        
        //var items = component.get('v.items') || [];

        //var itemMap = component.get('v.itemMap') || {};
        
        //var itemMaps = component.get('v.itemMaps') || {};
        
        //var assetItemMap = component.get('v.assetItemMap') || {};
        
        let items = [];
        let itemMap = {};
        let itemMaps = {};
        let assetItemMap = {};
        
        component.set('v.items', items);
        component.set('v.itemMap', itemMap);
        component.set('v.itemMaps', itemMaps);
        component.set('v.assetItemMap', assetItemMap);
        
		let capName = null;
        let item = null;
        assetTypes.forEach(function(assetType) {
            item = self.assetTypes[assetType];
            item.items = [];
            item.expanded = false;
            item.disabled = false;
            if (item) {
                items.push(item);
                itemMap[item.name] = item;
                capName = assetType.substring(0,1).toUpperCase() + assetType.substring(1).toLowerCase();
                self['list' + capName](component, function(err, assets) {
                    self.addAssetItems(component, assetType, assets); 
                });
            } else {
                console.error(assetType + ' is not a valid asset type');
            }
        });
        
        component.set('v.items', items);
        component.set('v.itemMap', itemMap);
        component.set('v.itemMaps', itemMaps);
        component.set('v.assetItemMap', assetItemMap);
        
    },
    
    assetTypeSingularMap: {
        'dashboards': 'dashboard',
        'lenses': 'lens',
        'datasets': 'dataset',
        'dataflows': 'dataflow',
        'stories': 'story',
        'recipes': 'recipe',
        'folders': 'folder',
        'templates': 'template',
        'fields': 'field'
    },

    assetTypePluralMap: {
        'dashboard': 'dashboards',
        'lens': 'lenses',
        'dataset': 'datasets',
        'dataflow': 'dataflows',
        'story': 'stories',
        'recipe': 'recipes',
        'folder': 'folders',
        'template': 'templates',
        'field': 'fields'
    },
    
    selectItem: function(component, name) {
        var self = this;
        var items = component.get('v.items');
        var itemMaps = component.get('v.itemMaps');
        
        var itemMap = null;
        var item = null;
        

		var assetItemMap = component.get('v.assetItemMap') || {};
        
        item = assetItemMap[name];
        /*
        var tokens = name.split(':');
        var nodeType = self.assetTypePluralMap[tokens[0]];
        console.warn('nodeType: ', nodeType);
        var nodeName = tokens[1];
        console.warn('nodeName: ', nodeName);
        
        if (nodeType) {
	        var itemMap = itemMaps[nodeType];
	        item = itemMap[name];
        }
        */
        /*
        for (var nodeLabel in itemMaps) {
            itemMap = itemMaps[nodeLabel];
            if (itemMap[name]) {
                item = itemMap[name];
            }
        }
        */
        
        if (item && item.asset) {
            component.set('v.assetType', item.asset.type);
            component.set('v.assetId', item.asset.id);
            component.set('v.asset', item.asset);
            
            // Fire the event
            var params = {
                assetType: item.asset.type,
                assetId: item.asset.id,
                asset: item.asset
            };
            var evt = $A.get('e.c:analyticsTreeSelection');
            evt.setParams(params);
            evt.fire();            
        } else {
            component.set('v.assetType', null);
            component.set('v.assetId', null);
            component.set('v.asset', null);
        }
        
    },
    
    createAssetDetailItem: function(component, key, label, value, resType, asset) {
       	let self = this;    
        if (typeof value === "object") {
            //var label = key + (typeof value !== 'object' ? ': ' + value : '');
            var item = { 
                label: label + (typeof value !== 'object' ? ': ' + value : ''),
                name: key,
                asset: asset,
                expanded: false,
                selected: false,
                highlighted: false,
                disabled: false,
                items: []
            };
            
            var child = null;                
            if (value instanceof Array) {
                for (var i  = 0; i < value.length; i++) {
                    child = self.createAssetDetailItem(component, key + "[" + i + "]", '' + i, value[i], resType, asset);
                    item.items.push(child);
                }                    
            } else {
                for (var k in value) {
                    child = self.createAssetDetailItem(component, key + "." + k, k, value[k], resType, asset);
                    item.items.push(child);
                }                    
            }
            return item;
        } else {
            //var label = key + (typeof value !== 'object' ? ': ' + value : '');
            var item = {
                label: label + (typeof value !== 'object' ? ': ' + value : ''),
                name: key,
                asset: asset,
                expanded: false,
                selected: false,
                highlighted: false,
                disabled: false,
                items: []
            };
            return item;   
        }
    },
    
    addAssetItems: function(component, nodeLabel, assets) {
        if (assets === null || typeof assets === 'undefined') {
            return;
        }

        let showDetails = component.get('v.showDetails');
        
        var items = component.get('v.items') || [];

        var itemMap = component.get('v.itemMap') || {};
        
        var itemMaps = component.get('v.itemMaps') || {};
        
        var assetItemMap = component.get('v.assetItemMap') || {};
        
        var self = this;
        var parent = null;
        items.forEach(function(item) {
            if (item.name === nodeLabel) {
                parent = item;
            } 
        });
        
        var assetMap = itemMaps[nodeLabel] || {};
        var name = null;
        
        if (parent !== null) {
            
            assets.forEach(function(asset) {
                //name = asset.type + ':' + (asset.namespace ? asset.namespace + '__' + asset.name : asset.name);
                //name = (asset.namespace ? asset.namespace + '__' + asset.name : asset.name);
                name = asset.id;

                var assetItem = { 
                    label: asset.label,
                    name: name,
                    asset: asset,
                    parent: parent,
                    expanded: false,
                    selected: false,
                    highlighted: false,
                    disabled: false,
                    items: []
                };
                
                if (showDetails === true) {
                    var assetItems = [];
                    var value = null;
                    var item = null;
                    for (var key in asset) {
                        value = asset[key];
                        item = self.createAssetDetailItem(component, asset.name + '.' + key, key, value, nodeLabel, asset);
                        assetItems.push(item);
                    }
                    assetItem.items = assetItems;
                }
                
                parent.items.push(assetItem);
                
                assetMap[name] = assetItem;
                                
                assetItemMap[name] = assetItem;
                
		        itemMap[name] = assetItem;
                
            });
        }
        itemMaps[nodeLabel] = assetMap;
        
        component.set('v.itemMaps', itemMaps);

        component.set('v.assetItemMap', assetItemMap);

        component.set('v.itemMap', itemMap);
        
        component.set('v.items', items);
    },
    
    listAssets: function(component, methodName, callback) {
       	let self = this;
        let pageSize = component.get('v.pageSize');
        var sdk = component.find("sdk");
        var context = {apiVersion: "46"};
        var methodName = methodName;
        var methodParameters = {
            pageSize: pageSize
        };
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            if (err !== null) {
                console.error("listAssets error: ", err);
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
    
    listDataflows: function(component, callback) {
       	let self = this;
        let pageSize = component.get('v.pageSize');
        var proxy = component.find('proxy');
        
        // Construct/generate this!!!!!!!!!!!!!!!!
        var url = '/services/data/v47.0/wave/dataflows?pageSize=' + pageSize;
        var config = null;
        
        if (proxy.get('v.ready') !== true) {
            setTimeout(function() {
                self.listDataflows(component, callback);
            }, 500);
        } else {
        
            proxy.exec(url, 'GET', config, function(response) {
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(null, response.body.dataflows);
                } else {
                    return null;
                }            
            });
        }
    },

    listAnalyses: function(component, callback) {
       	let self = this;
        let pageSize = component.get('v.pageSize');
        var proxy = component.find('proxy');
        
        // Construct/generate this!!!!!!!!!!!!!!!!
        var url = '/services/data/v47.0/smartdatadiscovery/analyses?pageSize=' + pageSize;
        var config = null;
        
        if (proxy.get('v.ready') !== true) {
            setTimeout(function() {
                self.listAnalyses(component, callback);
            }, 500);
        } else {
        
            proxy.exec(url, 'GET', config, function(response) {
                if (callback !== null && typeof callback !== 'undefined') {
                    let analyses = response.body.analyses;
                    if (analyses) {
                        analyses.forEach(function(analysis) {
                            analysis.type = 'analysis'; 
                        });
                    }
                    callback(null, analyses);
                } else {
                    return null;
                }            
            });
        }
    },
    
    listDashboards: function(component, callback) {
        this.listAssets(component, "listDashboards", function(err, data) {
            callback(err, data ? data.dashboards : null); 
        });
    },
    
    listDatasets: function(component, callback) {
        this.listAssets(component, "listDatasets", function(err, data) {
            callback(err, data ? data.datasets : null); 
        });
    },
    
    listLenses: function(component, callback) {
        this.listAssets(component, "listLenses", function(err, data) {
            callback(err, data ? data.lenses : null); 
        });
    },
    
    listFolders: function(component, callback) {
        this.listAssets(component, "listFolders", function(err, data) {
            callback(err, data ? data.folders : null); 
        });
    },
    
    listTemplates: function(component, callback) {
        this.listAssets(component, "listTemplates", function(err, data) {
            if (data && data.templates) {
                data.templates.forEach(function(template) {
                   	template.type = 'template'; 
                });
            }
            callback(err, data ? data.templates : null); 
        });
    }
    
})