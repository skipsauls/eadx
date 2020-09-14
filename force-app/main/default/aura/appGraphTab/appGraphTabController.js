({
    scriptsLoaded : function(component, event, helper) {
        helper.setupNetwork(component);
    },
    
    init: function (component, event, helper) {
        helper.handleRefreshTree(component);
    },
    
    handleSelect: function(component, event, helper) {
        //console.warn('analyticsExplorerController.handleSelect: ', event);
    },
    
    handleRefreshTree: function(component, event, helper) {
        helper.handleRefreshTree(component);
    },
    
    handleAssetSearchTermChange: function(component, event, helper) {
        let assetSearchTerm = component.get('v.assetSearchTerm');

       	let term = assetSearchTerm.trim().toLowerCase();
        
        let itemMap = component.get('v.itemMap');
        let items = component.get('v.items');
        let matches = [];
        let item = null;
        for (var key in itemMap) {
            item = itemMap[key];
            item.highlighted = false;
	        if (term && term.length > 2) {
                if (item.label.toLowerCase().indexOf(term) >= 0) {
                    matches.push(item);
                    item.highlighted = true;
                    item.parent.expanded = true;
                }
            }
        }
        component.set('v.isSearchingAssetTree', false);
        component.set('v.items', items);            
    },
    
    handleAssetTreeSearchKeyUp: function(component, event, helper) {
        let isEnterKey = event.keyCode === 13;
        let queryTerm = component.find('asset_tree_search').get('v.value');
       	let term = queryTerm.trim().toLowerCase();
        if (isEnterKey) {
            component.set('v.isSearchingAssetTree', true);
            let itemMap = component.get('v.itemMap');
            let items = component.get('v.items');
            let matches = [];
            let item = null;
            for (var key in itemMap) {
                item = itemMap[key];
                item.highlighted = false;
                if (item.label.toLowerCase().indexOf(term) >= 0) {
                    matches.push(item);
                    item.highlighted = true;
                }
            }
            component.set('v.isSearchingAssetTree', false);
            component.set('v.items', items);
        }
    },
    
    handleClearNetwork: function(component, event, helper) {
        helper.handleClearNetwork(component);
    },

    handleFitNetwork: function(component, event, helper) {
        helper.handleFitNetwork(component);
    },
    
    handleToggleInspector: function(component, event, helper) {
        
       	let showInspector = component.get('v.showInspector');
        component.set('v.showInspector', !showInspector);
        
		helper.handleResize(component);        
    },

    handleSetHierarchicalLayout: function(component, event, helper) {
        let direction = event.getSource().get('v.name');
        
        let options = component.get('v.options');
        
        options.layout.hierarchical.enabled = true;
        options.layout.hierarchical.direction = direction;
        options.physics.enabled = false;
        
        component.set('v.options', options);
    },

    handleSetLayout: function(component, event, helper) {
        let solver = event.getSource().get('v.name');
        
        let options = component.get('v.options');
        
        options.layout.hierarchical.enabled = false;
		options.physics.solver = solver;
        options.physics.enabled = true;

        component.set('v.options', options);
    },
    
    handleTogglePhysics: function(component, event, helper) {
        let options = component.get('v.options');
        options.physics.enabled = !options.physics.enabled;
        component.set('v.options', options);
    },
    
    handleShowDependencies: function(component, event, helper) {
        helper.handleShowDependencies(component)
    },
    
    handleOptionsChange: function(component, event, helper) {
        //console.warn('handleOptionsChange');
        let options = component.get('v.options');
        //console.warn('options: ', options);
        //console.warn('options JSON: ', JSON.stringify(options, null, 2));
        
        // Weird slider behavior setting values as strings
        /*
        options.layout.hierarchical.levelSeparation = parseInt(options.layout.hierarchical.levelSeparation);
        options.layout.hierarchical.nodeSpacing = parseInt(options.layout.hierarchical.nodeSpacing);
        options.layout.hierarchical.treeSpacing = parseInt(options.layout.hierarchical.treeSpacing);
        options.physics.minVelocity = parseInt(options.physics.minVelocity);
        options.physics.maxVelocity = parseInt(options.physics.maxVelocity);
        */

        let network = component.get('v.network');
        //console.warn('network: ', network);
        let nodes = component.get('v.nodes');
        //console.warn('nodes: ', nodes);
        if (network) {
            
            let opts = Object.assign({}, options);
            //console.warn('opts: ', opts);
            //console.warn('opts JSON: ', JSON.stringify(opts, null, 2));
            
            network.setOptions(opts);
        }
    },
    
    handleSelectedAssetChange: function(component, event, helper) {
        //console.warn('appGraphTabContoller.handleSelectedAssetChange');
        helper.handleSelectedAssetChange(component);
    },
    
    handleSelectedAssetChildChange: function(component, event, helper) {
        //console.warn('handleSelectedAssetChildChange: ', component, event);
        let name = null;
        let label = null;
        let checked = null;
        
        if (event.getSource) {
	        let source = event.getSource();
    	    name = source.get('v.name');
        	label = source.get('v.label');
            checked = source.get('v.checked');            
        } else if (event.target) {
	        let target = event.target;
            //console.warn('target: ', target);
    	    name = target.getAttribute('name');
        	label = target.getAttribute('value');
            checked = target.checked;
        }
        
        helper.updateSelectedChildren(component, name, label, checked);
    },
    
    test: function(component, event, helper) {
        helper.listDashboards(component, {folderId: '00lB0000000snNtIAI'}, function(err, dashboards) {
            //console.warn('dashboards: ', dashboards); 
        });        
    }
})