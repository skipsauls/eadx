({
    assetTypes: {
        'workbooks': {
            label: 'Workbooks',
            name: 'workbooks'
        },
        'views': {
            label: 'Views',
            name: 'views'
        },
        'datasources': {
            label: 'Datasources',
            name: 'datasources'
        },
        'tables': {
            label: 'Tables',
            name: 'tables'
        }
        
    },

    checkAuth: function(component, callback) {
        let proxy = component.find('proxy');
        
        let methodName = 'authenticate';        
        let name = 'XXXXXXXX';
        let password = 'XXXXXXXX';

        //let serverUrl = 'us-west-2b.online.tableau.com';
        //let serverUrl = '10ay.online.tableau.com';

        //let siteName = 'einsteinsandbox';
        //let siteName = 'eadx';

        //let siteName = 'gzanollisf';

        
        let siteName = component.get('v.siteName');
        console.warn('siteName: ', siteName);
        
        let sites = component.get('v.sites');
        let site = null;
        sites.forEach(function(s) {
            if (s.contentUrl === siteName) {
                site = s;
            }
        });
        
        let config = {};
        
        let url = '/services/apexrest/eadx/tableau?methodName=' + methodName;
        
        url += '&serverUrl=' + site.serverUrl;
        url += '&siteName=' + site.contentUrl;  
        url += '&name=' + name;
        url += '&password=' + password;  
        
        proxy.exec(url, 'GET', config, function(response) {
            console.warn(methodName + ' response: ', response);
            let val = JSON.parse(response.body);
            console.warn('val: ', val);
            if (typeof callback === 'function') {
                callback(null, val);
            }
        });            
    },
    
    setup: function(component, callback) {
        let self = this;
        
        console.warn('------------------------------------------------------> setup');

        let sites = [
            {
                name: 'eadx',
                contentUrl: 'eadx',
                serverUrl: 'us-west-2b.online.tableau.com'
            },
            {
                name: 'gzanolli-SF',
                contentUrl: 'gzanollisf',
                serverUrl: 'us-west-2b.online.tableau.com'                    
            },
            {
                name: 'Einstein Sandbox',
                contentUrl: 'einsteinsandbox',
                serverUrl: 'us-west-2b.online.tableau.com'                    
            }
            
        ];

        component.set('v.sites', sites);
        
        
        let siteName = component.get('v.siteName');
        let site = null;
        sites.forEach(function(s) {
            if (s.contentUrl === siteName) {
                site = s;
            }            
        });
        
        component.set('v.site', site);

        
        self.refreshTree(component, function(err, resp) {
			
        });
/*
        self.checkAuth(component, function(err, resp) {
            
            //console.warn('checkAuth returned: ', err, resp);
            
            self.refreshTree(component, function(err, resp) {
                
            });
        });
*/

    },
    
    refreshTree: function(component, callback) {
        let self = this;
        
        self.checkAuth(component, function(err, resp) {
            
            let assetTypes = component.get('v.assetTypes');
            
            // Support using * for all
            if (assetTypes.length === 1 && assetTypes[0] === '*') {
                assetTypes = [];
                for (var key in self.assetTypes) {
                    assetTypes.push(key)
                }
            }
            
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
                    console.warn('calling: ' + 'list' + capName);
                    //
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
        });
        
    },
    
    assetTypeSingularMap: {
        'workbooks': 'workbook',
        'views': 'view',
        'datasources': 'datasource',
        'tables': 'table'
    },

    assetTypePluralMap: {
        'workbook': 'workbooks',
        'view': 'views',
        'datasource': 'datasources',
        'table': 'tables'
    },
    
    selectItem: function(component, name) {
        var self = this;
        var items = component.get('v.items');
        var itemMaps = component.get('v.itemMaps');
        
        var itemMap = null;
        var item = null;
        
        //console.warn('selectItem - name: ', name);

		var assetItemMap = component.get('v.assetItemMap') || {};
        
        item = assetItemMap[name];
        
        //console.warn('item: ', item);
        
        if (item !== null && typeof item !== 'undefined') {
            
            //console.warn('item.name: ', item.name);
            //console.warn('item.label: ', item.label);
            //console.warn('item.asset: ', item.asset);
            //console.warn('item.asset.type: ', item.asset.type);
            
            //console.warn('v.selectedItem: ', component.get('v.selectedItem'));
            
            if (item && item.asset) {
                
                component.set('v.selectedItem', item);
                
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
        }
        
    },
    
    createAssetDetailItem: function(component, key, label, value, resType, asset) {
       	let self = this;
        
        //console.warn('createAssetDetailItem asset.type: ', asset.type);
        
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
        console.warn('addAssetItems: ', nodeLabel, assets);
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
        var nodeType = null;
        
        if (parent !== null) {
            
            assets.forEach(function(asset) {
                //console.warn('asset: ', asset);
                //name = asset.type + ':' + (asset.namespace ? asset.namespace + '__' + asset.name : asset.name);
                //name = (asset.namespace ? asset.namespace + '__' + asset.name : asset.name);
                //name = asset.id;
                nodeType = self.assetTypeSingularMap[nodeLabel];
                //console.warn('nodeType: ', nodeType);
                // Add the type to the asset
                asset.type = nodeType;
                name = nodeType + ':' + ((asset.project && asset.project.name) ? asset.project.name + '__' + asset.viewUrlName : asset.viewUrlName);
                //console.warn('name: ', name);

                var assetItem = { 
                    label: asset.name,
                    name: name, //asset.id,
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
                
                //console.warn('assetItem: ', assetItem);
                
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

    listTableauAssets: function(component, methodName, callback) {
        //console.warn('listTableauAssets: ', methodName);
       	let self = this;
        let pageSize = component.get('v.pageSize');
        var proxy = component.find('proxy');
        
        // Construct/generate this!!!!!!!!!!!!!!!!
        //var url = '/services/apexrest/eadx/tableau?methodName=' + methodName;
        
        let site = component.get('v.site');
        if (site !== null && typeof site !== 'undefined') {
            
            //let serverUrl = 'us-west-2b.online.tableau.com';
            let name = 'ssauls@salesforce.com';
            //let siteName = 'einsteinsandbox';
            //let siteName = 'eadx';
            
            let url = '/services/apexrest/eadx/tableau?methodName=' + methodName;
            
            url += '&serverUrl=' + site.serverUrl;
            url += '&siteName=' + site.contentUrl;
            url += '&name=' + name;
            
            var config = null;
            
            if (proxy.get('v.ready') !== true) {
                setTimeout(function() {
                    self.listTableauAssets(component, callback);
                }, 500);
            } else {
                
                proxy.exec(url, 'GET', config, function(response) {
                    //console.warn(methodName + ' response: ', response);
                    let val = JSON.parse(response.body);
                    //console.warn('val: ', val);
                    if (callback !== null && typeof callback !== 'undefined') {
                        callback(null, val);
                    } else {
                        return null;
                    }            
                });
            }
        } else {
            console.warn('No site selected!');
        }
    },

    listSites: function(component,callback) {
        //console.warn('listSites');
       	let self = this;
        self.listTableauAssets(component, 'list_sites', callback);
    },

    listWorkbooks: function(component,callback) {
        //console.warn('listWorkbooks');
       	let self = this;
        self.listTableauAssets(component, 'list_workbooks', callback);
    },

    listViews: function(component, callback) {
        //console.warn('listViews');
       	let self = this;
        self.listTableauAssets(component, 'list_views', callback);  
    },

    listDatasources: function(component, callback) {
        //console.warn('listDatasources');
       	let self = this;
        self.listTableauAssets(component, 'list_datasources', callback);
    },
    
    listTables: function(component, callback) {
        //console.warn('listTables');
       	let self = this;
        self.listTableauAssets(component, 'list_tables', callback);
    }
    
    
})