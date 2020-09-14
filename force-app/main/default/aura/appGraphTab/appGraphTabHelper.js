({
    handleRefreshTree: function(component) {
        var analyticsTree = component.find('analytics_tree');
        component.set('v.selectedAssetId', null);
        component.set('v.assetType', null);
        component.set('v.asset', null);
        analyticsTree.refresh(function(msg) {
            //console.warn('analyticsTree.refresh returned: ', msg);
            var spinner = component.find('spinner');
            //$A.util.toggleClass(spinner, 'slds-hide');
        });
    },

    handleResize: function(component) {
        setTimeout(function() {
            let network = component.get('v.network');
	        network.setSize('100%', '100%');
    	    network.fit();
        }, 50);        
    },
    
    handleClearNetwork: function(component) {
        let nodes = component.get('v.nodes');
        let edges = component.get('v.edges');        
		let network = component.get('v.network');

        nodes = new vis.DataSet();
        
        edges = new vis.DataSet();

        network.setData({nodes: nodes, edges: edges});
        
        component.set('v.nodes', nodes);
        component.set('v.edges', edges);
    },    

    handleFitNetwork: function(component) {
        let nodes = component.get('v.nodes');
        let edges = component.get('v.edges');        
		let network = component.get('v.network');

        network.fit({anmiation: false});
    },    
        
    setupNetwork: function(component) {
        let self = this;
        let nodes = new vis.DataSet();
        component.set('v.nodes', nodes);
        
        let edges = new vis.DataSet();
        component.set('v.edges', edges);
        
        var node = null;
        var edge = null;
        
        self.draw(component);
    },

    showSpinner: function(component) {
        let spinner = component.find('spinner');
        $A.util.removeClass(spinner, 'slds-hide');
    },
    
    hideSpinner: function(component) {
        let spinner = component.find('spinner');
        $A.util.addClass(spinner, 'slds-hide');
    },
    
    draw: function(component, config, callback) {
        let self = this;
        //var nodes = null;
        //var edges = null;
        var network = null;
        
        let nodes = component.get('v.nodes');
        let edges = component.get('v.edges');        
        
        var container = component.find('mynetwork').getElement();
        //console.warn('container: ', container);

        var data = {
            nodes: nodes,
            edges: edges
        };
        
        var direction = 'LR';
       
        var options = {
            autoResize: false,
            physics: {
                enabled: false,
                solver: 'barnesHut'
            },
            nodes: {
                scaling: {
                    min: 20,
                    max: 20
                }
            },
            layout: {
                hierarchical: {
                    enabled: true,
                    direction: direction,
                    sortMethod: 'directed',
                    levelSeparation: 150,
                    nodeSpacing: 80,
                    treeSpacing: 100
                }
            },
            interaction: {
                hover: true
            }
            
            
            /*,
            edges: {
                smooth: {
                    type: 'cubicBezier',
                    forceDirection: (direction == "UD" || direction== "DU") ? 'vertical' : 'horizontal',
                    roundness: 0.4
                }
            }*/
        };
        
        component.set('v.options', options);
        
        try {
            
    	    let opts = Object.assign({}, options);
        
	        //console.warn('creating network using opts: ', JSON.stringify(opts, null, 2));
            
            network = new vis.Network(container, data, opts);
            
            component.set('v.network', network);
            
            network.on('selectNode', function (params) {
                self.handleSelectNode(component, params);
            });
            
            network.on('deselectNode', function(params) {
                self.handleDeselectNode(component, params);
            });

            network.on('doubleClick', function (params) {
                self.handleDoubleClickNode(component, params);
            });
            
            network.on('selectEdge', function (params) {
                self.handleSelectEdge(component, params);
            });

            network.on('deselectEdge', function(params) {
                self.handleDeselectEdge(component, params);
            });
            
        } catch (e) {
            console.error(e);
        }
    },
    
    handleSelectNode: function(component, params) {
        let self = this;
        let network = component.get('v.network');
        
        let nodeId = network.getNodeAt(params.pointer.DOM);
        self.selectNode(component, nodeId);

    },
    
    selectNode: function(component, nodeId) {
        let self = this;
        let network = component.get('v.network');
        let nodes = component.get('v.nodes');
		let assetMap = component.get('v.assetMap') || {};

        component.set('v.selectedAssetId', nodeId);
        
        if (nodeId) {
        
            let node = nodes.get(nodeId);
            component.set('v.selectedNode', node);
            
			let assetMap = component.get('v.assetMap') || {};
            let asset = assetMap[nodeId];
            //console.warn('asset: ', asset);
            if (asset) {
                component.set('v.selectedAsset', asset);
                self.listChildren(component, asset, network);
            }
        }
    },

    handleDeselectNode: function(component, params) {
        let self = this;
        let network = component.get('v.network');
		let assetMap = component.get('v.assetMap') || {};

        if (params.nodes.length === 0) {
            component.set('v.selectedAssetId', null);
            component.set('v.selectedAsset', null);
            component.set('v.selectedAssetChildren', null);
            component.set('v.selectedNode', null);
        }
    },

    handleDoubleClickNode: function(component, params) {
        let self = this;
        let network = component.get('v.network');

        let nodeId = network.getNodeAt(params.pointer.DOM);
        //console.warn('double click nodeId: ', nodeId);
        
        let edgeId = network.getEdgeAt(params.pointer.DOM);
        //console.warn('double click edgeId: ', edgeId);
        
        if (nodeId) {
			let assetMap = component.get('v.assetMap') || {};
            let asset = assetMap[nodeId];
            if (asset) {
				let network = component.get('v.network');
				let nodes = component.get('v.nodes');
				let edges = component.get('v.edges');
                self.addAssetChildren(component, asset, network, nodes, edges);
            }
        }
    },
    
    handleSelectEdge: function(component, params) {
        let self = this;
        let network = component.get('v.network');
		let assetMap = component.get('v.assetMap') || {};

        let edgeId = network.getEdgeAt(params.pointer.DOM);
        //console.warn('select edgeId: ', edgeId);
    },
    
    handleDeselectEdge: function(component, params) {
        let self = this;
        let network = component.get('v.network');
		let assetMap = component.get('v.assetMap') || {};

        //console.warn('handleDeselectEdge: ', params);
        
        if (params.nodes.length === 0) {
            component.set('v.selectedAssetId', null);
            component.set('v.selectedAsset', null);
            component.set('v.selectedAssetChildren', null);
            component.set('v.selectedNode', null);
        }
    },
    
    assetTypes: [
        {
            type: 'folders',
            label: 'Folders'
        },
        {
            type: 'dashboards',
            label: 'Dashboards'
        },
        {
            type: 'datasets',
            label: 'Datasets'
        },
        {
            type: 'lenses',
            label: 'Lenses'
        },
        {
            type: 'stories',
            label: 'Stories'
        },
        {
            type: 'templates',
            label: 'Templates'
        },
        {
            type: 'dataflows',
            label: 'Dataflows'
        },
        {
            type: 'recipes',
            label: 'Recipes'
        },
        {
            type: 'fields',
            label: 'Fields'
        },
        {
            type: 'connectors',
            label: 'Connectors'
        }        
    ],
    
   	assetTypesSingular: [ 
        {
            type: 'folder',
            label: 'Folder'
        },
        {
            type: 'dashboard',
            label: 'Dashboard'
        },
        {
            type: 'dataset',
            label: 'Dataset'
        },
        {
            type: 'lens',
            label: 'Lens'
        },
        {
            type: 'story',
            label: 'Story'
        },
        {
            type: 'template',
            label: 'Template'
        },
        {
            type: 'dataflow',
            label: 'Dataflow'
        },
        {
            type: 'recipe',
            label: 'Recipe'
        },
        {
            type: 'field',
            label: 'Field'
        },
        {
            type: 'connector',
            label: 'Connector'
        }        
    ],

    appAssetTypes: [
        {
            type: 'dashboards',
            label: 'Dashboards'
        },
        {
            type: 'lenses',
            label: 'Lenses'
        },
        {
            type: 'datasets',
            label: 'Datasets'
        },
        {
            type: 'dataflows',
            label: 'Dataflows'
        },
        {
            type: 'stories',
            label: 'Stories'
        }
    ],
    
    appAssetTypesSingular: [
        {
            type: 'dashboard',
            label: 'Dashboard'
        },
        {
            type: 'lens',
            label: 'Lens'
        },
        {
            type: 'dataset',
            label: 'Dataset'
        },
        {
            type: 'dataflow',
            label: 'Dataflow'
        },
        {
            type: 'story',
            label: 'Story'
        }
    ],
    
    assetTypeSingularMap: {
        'dashboards': 'dashboard',
        'lenses': 'lens',
        'datasets': 'dataset',
        'dataflows': 'dataflow',
        'stories': 'story',
        'recipes': 'recipe',
        'folders': 'folder',
        'templates': 'template',
        'fields': 'field',
        'connectors': 'connector'
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
        'field': 'fields',
        'connector': 'connectors'
    },
    
    assetAttributes: {
        'default' : {
            level: 8,
            shape: 'dot',
            color: {
                node: {},
                edge: {}
            }
        },
        'folder': {
            level: 1,
            shape: 'image',
            image: {
                type: 'static',
				url: '/analytics/wave/static/images/WaveCommon/static/images/thumbs/thumb-application.png'
        	},
        	color: {
                node: {
                    background: '#AAAAFF',
                    border: '#0000FF'
                },
                edge: {}
            }
        },
        'dashboard': {
            level: 2,
            shape: 'image',
            image: {
                type: 'static',
				url: '/analytics/wave/static/images/WaveCommon/static/images/thumbs/thumb-dashboard.png'
        	},
        	color: {
                node: {},
                edge: {}
            }
        },
        'lens': {
            level: 2,
            shape: 'image',
        	image: {
                type: 'template',
                url: '/analytics/wave/static/images/WaveCommon/static/images/thumbs/thumb-chart-{{visualizationType}}.png',
                attrs: ['visualizationType']
            },
            color: {
                node: {},
                edge: {}
            }
        },
        'analysis': {
            level: 2,
            shape: 'image',
        	image: {
                type: 'static',
                url: '/analytics/wave/static/images/WaveCommon/static/images/EinsteinDataDiscovery/einstein.png'
            },
            color: {
                node: {},
                edge: {}
            }
        },        
        'dataset': {
            level: 3,
            shape: 'image',
            image: {
                type: 'static',
                url: '/analytics/wave/static/images/WaveCommon/static/images/thumbs/thumb-edgemart.png'
            },
            color: {
                node: {},
                edge: {}
            }
        },
        'dataset_field' : {
            level: 4,
            shape: 'dot',
            color: {
                node: {},
                edge: {}
            }
        },        
        'connector': {
            level: 5,
            shape: 'image',
        	image: {
                type: 'template',
                url: '/analytics/wave/static/images/WaveCommon/static/images/ELT/connectors/Logos/{{connectorType}}.svg',
                attrs: ['connectorType']
            },
            color: {
                node: {},
                edge: {}
            }
        },
        'origin_field' : {
            level: 6,
            shape: 'dot',
            color: {
                node: {},
                edge: {}
            }
        },        
        'replicateddataset': {
            level: 7,
            shape: 'database',
            widthConstraint: {
                minimum: 80,
                maximum: 80
            },
            image: {
                type: 'template',
                url: '/analytics/wave/static/images/WaveCommon/static/images/ELT/connectors/Logos/{{connectorType}}.svg',
                attrs: ['connectorType']
            },
            color: {
                node: {},
                edge: {}
            }
        },        
        'csv_datasource': {
            level: 7,
            shape: 'image',
        	image: {
                type: 'static',
                url: '/analytics/wave/static/images/WaveCommon/static/images/ELT/csv.png'
            },
            color: {
                node: {},
                edge: {}
            }
        },        
        
    },

    nodeTypeColorMap: {
        'dataset_field': {
            background: '#8A9A5B',
            highlight: '#708238',
            hover: '#A9BA9D',
            border: '#4B5320'
        },
        'origin_field': {
            border: '#2a4d69',
            background: '#63ace5',
            highlight: '#4b86b4',
            hover: '#adcbe3'
        },
        'connector': {
            background: '#FFFF00',
            highlight: '#00FF00',
            hover: '#0000FF'
        },
        'dataset': {
            background: '#FFFF00',
            highlight: '#00FF00',
            hover: '#0000FF'
        },
        'replicateddataset': {
            background: '#a7adba',
            highlight: '#65737e',
            hover: '#c0c5ce',
            border: '#343d46'
        }
        
        /*
        'folder': {
            color: '#FF0000',
            highlight: '#AA0000'
        },
        'dashboard': {
            color: '#00FF00',
            highlight: '#00AA00'
        }
        */
    },
    
    edgeTypeColorMap: {
        /*
        'folder': {
            color: '#FF0000',
            highlight: '#AA0000'
        },
        'dashboard': {
            color: '#00FF00',
            highlight: '#00AA00'
        }
        */
    },
    
    /*
     * dynamic - looks for icon in asset
     * static - uses the specified url
     * template - uses the specified attributes to generate url
     */
    assetImages: {
        'folder': { type: 'dynamic', url: '/analytics/wave/static/images/WaveCommon/static/images/thumbs/thumb-application.png'},
        'dashboard': { type: 'static', url: '/analytics/wave/static/images/WaveCommon/static/images/thumbs/thumb-dashboard.png'},
        'dataset': { type: 'static', url: '/analytics/wave/static/images/WaveCommon/static/images/thumbs/thumb-edgemart.png'},
        'lens': { type: 'template', url: '/analytics/wave/static/images/WaveCommon/static/images/thumbs/thumb-chart-{{visualizationType}}.png', attrs: ['visualizationType']},
        'connector': { type: 'template', url: '/analytics/wave/static/images/WaveCommon/static/images/ELT/connectors/Logos/{{connectorType}}.svg', attrs: ['connectorType']},
        'replicateddataset': { type: 'template', url: '/analytics/wave/static/images/WaveCommon/static/images/ELT/connectors/Logos/{{connectorType}}.svg', attrs: ['connectorType']},
        'analysis': { type: 'static', url: '/analytics/wave/static/images/WaveCommon/static/images/EinsteinDataDiscovery/einstein.png'},
        'cav_datasource': { type: 'static', url: '/analytics/wave/static/images/WaveCommon/static/images/ELT/csv.png'}
    },
    
    assetShapes: {
        'dashboard': 'image',
        'dataset': 'image',
        'lens': 'image',
        'step': 'diamond'
    },
    
    folderPalettes: [
        {
            background: '#AA0000',
            border: '#FF0000'            
        },
        {
            background: '#0000AA',
            border: '#0000FF'            
        }
    ],
    
    folderPaletteLookup: {},
    
    addAssetNode: function(component, asset, relatives, index, network, nodes, edges, fit, select) {
        //console.warn('addAssetNode: ', asset, asset.id);
        //console.warn('fit: ', fit);
        //console.warn('select: ', select);
        let self = this;
        
		let assetMap = component.get('v.assetMap') || {};
        assetMap[asset.id] = asset;
                
        component.set('v.assetMap', assetMap);
        
        let itemMaps = component.get('v.itemMaps') || {};
        
        let ids = [];
        let nodeId = asset.id;
        
        //console.warn('asset.type: ', asset.type);
        let assetAttributes = self.assetAttributes[asset.type] || self.assetAttributes['default'];
        //console.warn('assetAttributes: ', assetAttributes);
        //console.warn('assetAttributes.level: ', assetAttributes.level);
        
        let imageUrl = undefined;
        let assetImageType = self.assetImages[asset.type];
        //console.warn('assetImageType: ', assetImageType);
        
        if (asset.imageUrl) {
            imageUrl = asset.imageUrl;
        } else  if (assetImageType) {
            if (assetImageType.type === 'dynamic') {
                if (asset.icon && asset.icon.url) {
                    imageUrl = asset.icon.url;
                } else {
	                imageUrl = assetImageType.url;                    
                }
            } else if (assetImageType.type === 'static') {
                imageUrl = assetImageType.url;
            } else if (assetImageType.type === 'template') {
                imageUrl = assetImageType.url;
                //console.warn('imageUrl: ', imageUrl);
                var regex = null;
                var value = null;
                assetImageType.attrs.forEach(function(attr) {
                   	//console.warn('attr: ', attr);
                    //console.warn('asset[attr]: ', asset[attr]);
                    regex = new RegExp('{{' + attr + '}}', 'g')
                    //console.warn('regex: ', regex);
                    value = asset[attr];
                    //console.warn('value: ', value);
                    // Special cases
                    if (value === 'SalesforceAnalyticsCloudDatasetLoader') {
                        value = 'SalesforceLocal';
                    }
                    //console.warn('value: ', value);
                        
                    imageUrl = imageUrl.replace(regex, value);
	                //console.warn('imageUrl: ', imageUrl);
                });
            }
        }

        //console.warn('final imageUrl: ', imageUrl);
/*
        var nodeColor = {
            border: '#0000FF',
            background: '#AAAAFF'
        };

        nodeColor = assetAttributes.color.node;
*/
        let nodeColor = self.nodeTypeColorMap[asset.type] || undefined;
        
/*        
        if (relative) {
            var relativeNode = null;
            if (relative.parent) {
                relativeNode = nodes.get(relative.parent);
                nodeColor = relativeNode.color;
            } else if (relative.child) {
                relativeNode = nodes.get(relative.child);
            }
        } else {
            nodeColor = assetAttributes.color.node
        }
 */       
        
        let edgeColor = null;
        
        let assetTypeLabel = asset.type.substring(0, 1).toUpperCase() + asset.type.substring(1);
        let assetLabel = asset.label || asset.title || asset.name || asset.id;
        let assetName = asset.name ? ((asset.namespace ? asset.namespace + '__' : '') + asset.name) : undefined;
        let assetId = asset.id + (asset.currentVersionId ? '/' + asset.currentVersionId : '');
        let title = assetTypeLabel + ': ' + assetLabel;
        title += assetName ? ' | ' + assetName : '';
        title += assetId ? ' | ' + assetId : '';
        
        let label = asset.label || asset.title || asset.name || asset.id;
        if (label.length > 16) {
            label = label.substring(0, 16) + '…'
        }
        
        let node = {
            id: nodeId,
            value: index,
            label: label,
            level: assetAttributes.level || 8,
            options: {
                level: assetAttributes.level || 8
            },
            title: title,
            type: asset.type,
            image: imageUrl,
            shape: assetAttributes.shape,
            shapeProperties: {
                useBorderWithImage: false
            },
            color: nodeColor,
            widthConstraint: assetAttributes.widthConstraint || {
                minimum: 100,
                maximum: 200
            },
            hidden: false
        };
        //console.warn('node: ', node);
        if (nodes.get(nodeId)) {
            nodes.update(node);
        } else {
            nodes.add(node);
        }
        
        ids.push(nodeId);
        
        //console.warn('asset: ', asset, asset.id, asset.type);
        
        if (relatives) {
            var toNodeId = null;
            var fromNodeId = null;
            var dashes = false;
            if (relatives.parents) {
                relatives.parents.forEach(function(parent) {
                    if (parent) {
                        //console.warn('parent: ', parent, parent.id, parent.type);
                        fromNodeId = parent.id;
                        toNodeId = asset.id;
                        //console.warn('fromNodeId: ', fromNodeId);
                        //console.warn('toNodeId: ', toNodeId);
                        ids.push(parent.id);
                        let edgeId = fromNodeId + '_to_' + toNodeId;
                        edgeColor = self.edgeTypeColorMap[parent.type] || undefined;
                        //console.warn('edgeColor: ', edgeColor);
                        let edge = {
                            id: edgeId,
                            from: fromNodeId,
                            to: toNodeId,
                            title: asset.type,
                            hidden: false,
                            dashes: dashes,
                            color: edgeColor //assetAttributes.color.edge
                        };
                        //console.warn('edge: ', edge);
                        if (edges.get(edgeId)) {
                            edges.update(edge);
                        } else {
                            edges.add(edge);
                        }
                    }
                });
            }

            if (relatives.children) {
                var edgeId = null;
                var edge = null;
                relatives.children.forEach(function(child) {
                    if (child) {
                        //console.warn('child: ', child, child.id, child.type);
                        fromNodeId = asset.id;
                        toNodeId = child.id;
                        ids.push(child.id)
                        edgeId = fromNodeId + '_to_' + toNodeId;
                        edgeColor = self.edgeTypeColorMap[asset.type] || undefined;                        
                        //console.warn('edgeColor: ', edgeColor);
                        edge = {
                            id: edgeId,
                            from: fromNodeId,
                            to: toNodeId,
                            title: child.type,
                            hidden: false,
                            dashes: dashes,
                            color: edgeColor //assetAttributes.color.edge
                        };
                        //console.warn('edge: ', edge);
                        if (edges.get(edgeId)) {
                            edges.update(edge);
                        } else {
                            edges.add(edge);
                        }
                    }
                })
            }
        }
        
        if (fit === true) {
	        network.fit({nodes: ids, anmiation: false});
        }
        
        if (select === true) {
            network.selectNodes(ids);
            component.set('v.selectedAssetId', nodeId);
            component.set('v.selectedAsset', asset);
            
            //self.selectNode(component, nodeId);
    	    component.set('v.selectedNode', node);
        }
    },
    
    addAssetChildren: function(component, asset, network, nodes, edges, fit, select) {
        //console.warn('addAssetChildren: ', component, asset, network, nodes, edges);
        //console.warn('addAssetChildren: ', asset.type, asset);
        let self = this;
        
        let itemMaps = component.get('v.itemMaps') || {};
        //console.warn('itemMaps: ', itemMaps);

        let assetItemMap = component.get('v.assetItemMap') || {};
        //console.warn('assetItemMap: ', assetItemMap);
        
        let itemMap = null;
        let item = null;
        let name = null;
        
        if (asset.type === 'folder') {
			var folder = asset;
            
            if (select === true) {
                network.selectNodes([folder.id]);
                component.set('v.selectedAssetId', folder.id);
                component.set('v.selectedAsset', folder);
                self.listChildren(component, folder, network);
            }
            
        } else if (asset.type === 'dashboard') {
            var dashboard = asset;

            //console.warn('dashboard: ', dashboard);
            
            var datasets = dashboard.datasets;
            
            // Add the folder/app
            var folder = null;
            var folderItem = assetItemMap[dashboard.folder.id];
            if (folderItem) {
                folder = folderItem.asset;
                var relatives = {children: [dashboard]};
                /*
                var relatives = null;
                if (datasets === null || typeof datasets === 'undefined' || datasets.length <= 0) {
                    relatives = {children: [dashboard]};
                }
                */
                self.addAssetNode(component, folder, relatives, idx, network, nodes, edges);                                    
            }            
            
            if (datasets && datasets.length > 0) {
                // Add the datasets
                var counter = datasets.length;
                itemMap = itemMaps['datasets'] || {};
                item = null;
                name = null;
                
                datasets.forEach(function(dataset, idx) {
                    name = dataset.namespace ? dataset.namespace + '__' + dataset.name : dataset.name;
                    item = itemMap[name];
                    if (item) {
                        let datasetDetails = item.asset;
                        //console.warn('HIT - datasetDetails: ', datasetDetails);
                        // This will make the dataset appear as the "parent" of the dashboard, which isn't technically corect
                        //self.addAssetNode(component, datasetDetails, {children: [dashboard], parents: [folder]}, idx, network, nodes, edges);                    
                        
    	                if (nodes.get(dataset.id)) {
	                        
        	                self.addAssetNode(component, datasetDetails, {parents: [dashboard]}, idx, network, nodes, edges);
            	            
                	        self.addAssetChildren(component, datasetDetails, network, nodes, edges);
                        }
                    } else {
                        //console.warn('calling self.describeDataset');
                        self.describeDataset(component, dataset.id, function(err, datasetDetails) {
                            //console.warn('datasetDetails: ', datasetDetails.id, datasetDetails);
                            
                            // This will make the dataset appear as the "parent" of the dashboard, which isn't technically corect
                            //self.addAssetNode(component, datasetDetails, {children: [dashboard], parents: [folder]}, idx, network, nodes, edges);
                            
                            if (err) {
                                console.error('describeDataset returned error: ', err);
                            } else if (datasetDetails) {
		    	                if (nodes.get(dataset.id)) {
        	                        
            	                    self.addAssetNode(component, datasetDetails, {parents: [dashboard]}, idx, network, nodes, edges);
                	                
                    	            self.addAssetChildren(component, datasetDetails, network, nodes, edges);
                                }
                            }
                        });
                    }
                        
                });
            }
            
            // Get the details and add the steps
            self.describeDashboard(component, dashboard.id, function(err, dashboardDetails) {
                //console.warn('dashboardDetails: ', JSON.parse(JSON.stringify(dashboardDetails)));
                let steps = dashboardDetails.state.steps;
                
                /*
                var step = null;
                var stepNode = null;
                let idx = 0;
                for (var name in steps) {
                    step = steps[name];
                    //console.warn('step: ', step);
                    stepNode = {
                        name: name,
                        id: dashboard.id + '_' + name,
                        label: name,
                        type: 'step',
                        step: step
                    };
                    //self.addAssetNode(component, stepNode, {parents: [dashboard]}, idx, network, nodes, edges);
                    idx++;
                }
                */
                
                if (select === true) {
                    network.selectNodes([dashboard.id]);
                    component.set('v.selectedAssetId', dashboard.id);
                    component.set('v.selectedAsset', dashboard);
                    self.listChildren(component, dashboard, network);
                }                
            });
            
            
        } else if (asset.type === 'analysis') {
            var analysis = asset;

            //console.warn('analysis: ', analysis);

            // Add the folder/app
            var folder = null;
            var folderItem = assetItemMap[analysis.folder.id];
            if (folderItem) {
                folder = folderItem.asset;
                var relatives = {children: [analysis]};
                /*
                var relatives = null;
                if (datasets === null || typeof datasets === 'undefined' || datasets.length <= 0) {
                    relatives = {children: [dashboard]};
                }
                */
                self.addAssetNode(component, folder, relatives, idx, network, nodes, edges);                                    
            }            

            // Add the datasets
            var datasets = analysis.input.dataset ? [analysis.input.dataset] : null;
            datasets = analysis.input.datasets || datasets;
            
            if (datasets && datasets.length > 0) {
                // Add the datasets
                var counter = datasets.length;
                itemMap = itemMaps['datasets'] || {};
                item = null;
                name = null;
                
                datasets.forEach(function(dataset, idx) {
                    name = dataset.namespace ? dataset.namespace + '__' + dataset.name : dataset.name;
                    item = itemMap[name];
                    if (item) {
                        let datasetDetails = item.asset;
                        
                        self.addAssetNode(component, datasetDetails, {parents: [analysis]}, idx, network, nodes, edges);
                        
                        self.addAssetChildren(component, datasetDetails, network, nodes, edges); 
                    } else {
                        self.describeDataset(component, dataset.id, function(err, datasetDetails) {

                            if (err) {
                                console.error('describeDataset returned error: ', err);
                            } else if (datasetDetails) {
                                self.addAssetNode(component, datasetDetails, {parents: [analysis]}, idx, network, nodes, edges);
                                
                                self.addAssetChildren(component, datasetDetails, network, nodes, edges);
                            }
                        });
                    }
                });
            }

        } else if (asset.type === 'lens') {
            
            var lens = asset;

            var datasets = lens.datasets;
            
            // Add the folder/app
            var folder = undefined;
            var folderItem = assetItemMap[lens.folder.id];
            if (folderItem) {
                folder = folderItem.asset;
                var relatives = null;
                if (datasets === null || typeof datasets === 'undefined' || datasets.length <= 0) {
                    relatives = {children: [lens]};
                }
                self.addAssetNode(component, folder, relatives, idx, network, nodes, edges);                                    
            } else {
                
            }
            
            if (datasets && datasets.length > 0) {
                // Add the datasets
                var counter = datasets.length;
                itemMap = itemMaps['datasets'] || {};
                item = null;
                name = null;
                
                datasets.forEach(function(dataset, idx) {
                    name = dataset.namespace ? dataset.namespace + '__' + dataset.name : dataset.name;
                    item = itemMap[name];
                    if (item) {
                        let datasetDetails = item.asset;
                        //console.warn('HIT - datasetDetails: ', datasetDetails);
                        self.addAssetNode(component, datasetDetails, {children: [lens], parents: [folder]}, idx, network, nodes, edges);                    
                    } else {
                        //console.warn('calling self.describeDataset for: ', dataset.id, dataset.name);
                        self.describeDataset(component, dataset.id, function(err, datasetDetails) {
                            
                            if (err) {
                                console.error('describeDataset returned error: ', err);
                            } else if (datasetDetails) {
                                self.addAssetNode(component, datasetDetails, {parents: [lens]}, idx, network, nodes, edges);
                                
                                self.addAssetChildren(component, datasetDetails, network, nodes, edges);
                            }                            
                        });
                    }
                });
            }
            
        } else if (asset.type === 'dataset') {
            let dataset = asset;
            
            //console.warn('dataset: ', dataset);
            self.getDatasetDetails(component, dataset, function(err, datasetDetails) {
                dataset.datasetDetails = datasetDetails;
                
                // Add the folder/app
                var folder = null;
                var folderItem = assetItemMap[dataset.folder.id];
                if (folderItem) {
                    folder = folderItem.asset;
                    var relatives = {children: [dataset]};
                    self.addAssetNode(component, folder, relatives, idx, network, nodes, edges);                                    
                }  
            
                itemMap = itemMaps['dashboards'] || {};
                var relatives = {parents: []};
                var dashboardItem = null;
                var dashboard = null;
                for (var id in itemMap) {
                    dashboardItem = assetItemMap[id];
                    dashboard = dashboardItem.asset;
                    
                    if (nodes.get(dashboard.id)) {
                        dashboard.datasets.forEach(function(d) {                            
                            if (d.id === dataset.id) {
                                relatives.parents.push(dashboard)
                            } 
                        });                        
                    }

                }
                
                self.addAssetNode(component, dataset, relatives, idx, network, nodes, edges);                                    

                if (select === true) {
		            network.selectNodes([dataset.id]);
        		    component.set('v.selectedAssetId', dataset.id);
		            component.set('v.selectedAsset', dataset);
                   	self.listChildren(component, dataset, network);
                }
                
                
            });            
            
        } else if (asset.type === 'connector') {
            //console.warn('connector!');
            //console.warn('asset: ', asset);

            let connector = asset;
            let field = connector.field;
            //console.warn('field: ', field);
            let dataset = field.dataset;
            //console.warn('dataset: ', dataset);
            let datasetDetails = field.datasetDetails;
            //console.warn('datasetDetails: ', datasetDetails);
            let fieldXMD = datasetDetails.fieldMap[field.field.name];
            //console.warn('fieldXMD: ', fieldXMD);
            let fieldDetails = fieldXMD[fieldXMD.type];
            //console.warn('fieldDetails: ', fieldDetails);
            
            // Getting the field origin name is a bit strange.
            let fieldOriginName = null;
            if (fieldDetails.origin) {
                fieldOriginName = fieldDetails.origin;
            } else if (fieldDetails.field) {
                fieldOriginName = fieldDetails.field;
            } else if (fieldDetails.fields && fieldDetails.fields.fullField) {
                fieldOriginName = fieldDetails.fields.fullField;
            }
            
            if (connector.replicatedDataset) {
                let replicatedDataset = connector.replicatedDataset;
                //console.warn('replicatedDataset: ', replicatedDataset);
                
                // Does it already have the fields?
                if (replicatedDataset.fields) {
					let fields = replicatedDataset.fields;
                    var fieldAsset = null;
                    var idx = 0;
                   	
                    //console.warn('comparing fieldOriginName: ', fieldOriginName);
                    fields.forEach(function(srcField) {
                        //console.warn('srcField: ', srcField);
                        // Should we compare origin or field??
                        if (srcField.name === fieldOriginName) {
                            fieldAsset = {
                                id: replicatedDataset.id + '_field_' + srcField.name,
                                label: field.label || field.name,
                                type: 'origin_field',
                                field: field,
                                replicatedDataset: replicatedDataset
                            };
                            self.addAssetNode(component, fieldAsset, {parents: [connector]}, idx, network, nodes, edges);
                            self.addAssetChildren(component, fieldAsset, network, nodes, edges);
                            idx++;
                        }
                    });                    
                } else {
                    self.getReplicatedDatasetFields(component, replicatedDataset, function(err, fields) {
                        //console.warn('getReplicatedDatasetFields returned: ', err, fields);
                        if (fields) {
                            replicatedDataset.fields = fields;
                            var fieldAsset = null;
                            var idx = 0;
		                    //console.warn('comparing fieldOriginName: ', fieldOriginName);
                            fields.forEach(function(srcField) {
		                        //console.warn('srcField: ', srcField);
                                // Should we compare origin or field??
                                if (srcField.name === fieldOriginName) {
                                    fieldAsset = {
                                        id: replicatedDataset.id + '_field_' + srcField.name,
                                        label: field.label || field.name,
                                        type: 'origin_field',
                                        field: field,
                                        replicatedDataset: replicatedDataset
                                    };
                                    self.addAssetNode(component, fieldAsset, {parents: [connector]}, idx, network, nodes, edges);
		                            self.addAssetChildren(component, fieldAsset, network, nodes, edges);
                                    idx++;
                                }
                            });
                        }
                    });
                }
            } else if (connector.recipe) {
                let dataset = connector.dataset;
                let recipe = connector.recipe;
                console.warn('connector recipe: ', recipe);

                var srcField = field.field;
                fieldAsset = {
                    id: connector.fullyQualifiedName + '_field_' + srcField.name,
                    label: srcField.label || srcField.name,
                    type: 'origin_field',
                    field: field,
                    fullyQualifiedName: connector.fullyQualifiedName
                };
                //console.warn('fieldAsset: ', fieldAsset);
                self.addAssetNode(component, fieldAsset, {parents: [connector]}, idx, network, nodes, edges);
                self.addAssetChildren(component, fieldAsset, network, nodes, edges);                

            } else if (connector.fullyQualifiedName) {
                let dataset = connector.dataset;
                
                var srcField = field.field;
                fieldAsset = {
                    id: connector.fullyQualifiedName + '_field_' + srcField.name,
                    label: srcField.label || srcField.name,
                    type: 'origin_field',
                    field: field,
                    fullyQualifiedName: connector.fullyQualifiedName
                };
                //console.warn('fieldAsset: ', fieldAsset);
                self.addAssetNode(component, fieldAsset, {parents: [connector]}, idx, network, nodes, edges);
                self.addAssetChildren(component, fieldAsset, network, nodes, edges);                
                
            }
        } else if (asset.type === 'origin_field') {
            //console.warn('origin_field!');
            //console.warn('asset: ', asset);
            
            if (asset.replicatedDataset) {
                let replicatedDataset = asset.replicatedDataset;
                // Expose the connectorType at top level for icons
                try {
	                replicatedDataset.connectorType = asset.replicatedDataset.connector.connectorType;
                } catch (e) {
                    replicatedDataset.connectorType = 'SalesforceLocal';
                }
                //console.warn('replicatedDataset.connectorType: ', replicatedDataset.connectorType);
                replicatedDataset.imageUrl = '/analytics/wave/static/images/WaveCommon/static/images/ELT/connectors/Logos/HerokuPostgres.svg';
                self.addAssetNode(component, replicatedDataset, {parents: [asset]}, 0, network, nodes, edges);
                
                self.addAssetChildren(component, replicatedDataset, network, nodes, edges);
                
            } else if (asset.recipe) {
                let recipe = asset.recipe;
                self.addAssetNode(component, recipe, {parents: [asset]}, 0, network, nodes, edges);
                
                self.addAssetChildren(component, recipe, network, nodes, edges);
                
            } else if (asset.fullyQualifiedName) {
                //console.warn('PROBABLY CSV?????');
                let csvDataSourceAsset = {
                    id: 'CSV_' + asset.fullyQualifiedName,
                    label: asset.fullyQualifiedName,
                    type: 'csv_datasource',
                    imageUrl: '/analytics/wave/static/images/WaveCommon/static/images/ELT/csv.png'
                };
                
                self.addAssetNode(component, csvDataSourceAsset, {parents: [asset]}, 0, network, nodes, edges);
                
                self.addAssetChildren(component, csvDataSourceAsset, network, nodes, edges);
                
            } else {
                console.warn('No recipe or replicatedDataset found');
            }            
            
        } else if (asset.type === 'replicateddataset') { 
            //console.warn('replicateddataset!');
            return;
            
            //console.warn('asset: ', asset);
            
            let replicatedDataset = asset;
 
            //console.warn('replicatedDataset: ', replicatedDataset);
            
            self.getReplicatedDatasetFields(component, replicatedDataset, function(err, fields) {
                //console.warn('getReplicatedDatasetFields returned: ', err, fields);
                if (fields) {
                    var fieldAsset = null;
                    var idx = 0;
                    fields.forEach(function(field) {
                        fieldAsset = {
                            id: replicatedDataset.id + '_field_' + field.name,
                            label: field.label || field.name,
                            type: 'origin_field',
                            field: field,
							replicatedDataset: replicatedDataset                            
                        };
                        self.addAssetNode(component, fieldAsset, {children: [replicatedDataset]}, idx, network, nodes, edges);
                        idx++
                    });
                }
            });
            
        } else if (asset.type === 'fields') {
            //console.warn('fields!');
            //console.warn('asset: ', asset);
            
            let fields = asset;
            let dataset = fields.dataset;
            let datasetDetails = asset.datasetDetails;
            let fieldList = datasetDetails.fieldList;
            var fieldAsset = null;
            var idx = 0;
            fieldList.forEach(function(field) {
                fieldAsset = {
                    id: dataset.id + '_field_' + field.name,
                    label: field.label || field.name,
                    type: 'dataset_field',
                    field: field,
                    dataset: dataset,
                    datasetDetails: datasetDetails
                };
                self.addAssetNode(component, fieldAsset, {parents: [fields]}, idx, network, nodes, edges);                    
                idx++;                
            });
            
        } else if (asset.type === 'dataset_field') {
			//console.warn('dataset_field');

            let field = asset;
            //console.warn('field: ', JSON.parse(JSON.stringify(field)));
            
            let idx = 0;            
            // Create the connector node
            let datasetDetails = field.datasetDetails;
            let dataset = datasetDetails.xmd.dataset;
            let connector = datasetDetails.xmd.dataset.connector;
            //console.warn('dataset: ', JSON.parse(JSON.stringify(dataset)));
            console.warn('datasetDetails: ', JSON.parse(JSON.stringify(datasetDetails)));
            console.warn('connector: ', connector);
            if (connector === 'CSV' || connector === 'eaMigrationService') {
                let fullyQualifiedName = dataset.fullyQualifiedName;
                //console.warn('fullyQualifiedName: ', fullyQualifiedName);
                self.listRecipes(component, function(err, recipes) {
                    //console.warn('recipes: ', recipes);
                    var recipe = null;
                    recipes.forEach(function(r) {
                        /*
                        console.warn('r.name: ', r.name);
                        if (r.name === fullyQualifiedName) {
                            recipe = r;
                        }                        
						*/
                        //console.warn('asset.parentAssetId ', asset.parentAssetId);
                        //console.warn('asset.dataset.id ', asset.dataset ? asset.dataset.id : null);
                        //console.warn('r.dataset.id: ', r.dataset ?  r.dataset.id : null);
                        if (r.dataset && (r.dataset.id === asset.parentAssetId)) {
                            recipe = r;
                        }
                    });
                    if (recipe) {
                        console.warn('matched recipe: ', recipe);
                        //self.addAssetNode(component, recipe, {parents: [asset]}, 0, network, nodes, edges);                    
                        
                        var connectorAsset = {
                            id: 'connector_' + connector.id + '_' + field.id,
                            label: 'CSV (Recipe)',
                            type: 'connector',
                            connectorType: 'CSV',
                            imageUrl: '/analytics/wave/static/images/WaveCommon/static/images/ELT/csv-outline.png',
                            fullyQualifiedName: fullyQualifiedName,
                            recipe: recipe,
                            field: field
                        };
                        self.addAssetNode(component, connectorAsset, {parents: [field]}, 0, network, nodes, edges);
                        
                        self.addAssetChildren(component, connectorAsset, network, nodes, edges);
                        
                    } else {
                        
                        var connectorAsset = {
                            id: 'connector_' + connector.id + '_' + field.id,
                            label: 'CSV (Upload)',
                            type: 'connector',
                            connectorType: 'CSV',
                            imageUrl: '/analytics/wave/static/images/WaveCommon/static/images/ELT/csv-outline.png',
                            fullyQualifiedName: fullyQualifiedName,
                            field: field
                        };
                        self.addAssetNode(component, connectorAsset, {parents: [field]}, 0, network, nodes, edges);
                        
                        self.addAssetChildren(component, connectorAsset, network, nodes, edges);
                    }
                });                
                
            } else {
                let fullyQualifiedName = datasetDetails.xmd.dataset.fullyQualifiedName;
                self.listReplicatedDatasets(component, function(err, replicatedDatasets) {
                    //console.warn('replicatedDatasets: ', replicatedDatasets);
                    var replicatedDataset = null;
                    replicatedDatasets.forEach(function(r) {
                        if (r.name === fullyQualifiedName) {
                            replicatedDataset = r;
                        }
                    });
                    if (replicatedDataset) {
                        console.warn('matched replicatedDataset: ', replicatedDataset);
                        
                        var connector = replicatedDataset.connector;
                        
                        var connectorAsset = {
                            id: 'connector_' + connector.id + '_' + field.id,
                            label: connector.label || connector.name || connector.id,
                            type: 'connector',
                            connectorType: connector.connectorType, // Used to derive the icon
                            replicatedDataset: replicatedDataset,
                            field: field
                        };
                        self.addAssetNode(component, connectorAsset, {parents: [field]}, 0, network, nodes, edges);                    
                        
                        self.addAssetChildren(component, connectorAsset, network, nodes, edges);
                    } else {
                        console.warn('no matching replicated dataset');                      
                        var connector = datasetDetails.xmd.dataset.connector;
                        
                        var connectorAsset = {
                            id: 'connector_' + connector.id + '_' + field.id,
                            label: connector,
                            type: 'connector',
                            connectorType: connector, // Used to derive the icon
                            dataset: dataset,
                            field: field
                        };
                        self.addAssetNode(component, connectorAsset, {parents: [field]}, 0, network, nodes, edges);
                        
                        self.addAssetChildren(component, connectorAsset, network, nodes, edges);
                    }
                });                
            }                
            
            

        } else if (asset.type === 'recipe') {
            let recipe = asset;
            self.getRecipeFile(component, recipe, function(err, file) {
                //console.warn('getRecipeFile returned: ', err, file);
                
                let fields = file.tableModelInfo.rootDataset.fields;
                let idx = 0;
                let devName = file.tableModelInfo.rootDataset.devName;
                let fieldAttributes = file.tableModelInfo.fieldAttributes;
                var attr = null;
                var key = null;
                var fieldAsset = null; 
                fields.forEach(function(field) {
                    key = devName + '.' + field.name;
                    attr = fieldAttributes[key];
                    fieldAsset = {
                        id: recipe.id + '_field_' + field.name,
                        label: field.label || field.name,
                        type: 'recipe_field',
                        field: field
                    };
                    self.addAssetNode(component, fieldAsset, {parents: [recipe]}, idx, network, nodes, edges);                    
                    idx++;
                });
            });
        } else {
            console.warn('unhandled asset.type: ', asset.type);
        }
        
        // Decide fit strategy
        //network.fit({nodes: ids});
    },
    
    handleSelectedAssetChange: function(component) {
        //console.warn('handleSelectedAssetChange');
        let self = this;
        let network = component.get('v.network');
        
        if (network === null || typeof network === 'undefined') {
            return;
        }
        
        var assetId = component.get('v.selectedAssetId');        
        //console.warn('assetId: ', assetId);
        
        //var asset = assetMap[assetId];

        var asset = component.get('v.asset');
        
        //var asset = component.get('v.selectedAsset');
        
        //console.warn('selected asset: ', asset);

        if (asset) {
            let nodes = component.get('v.nodes');
            let edges = component.get('v.edges');     
            
            //console.warn('nodes: ', nodes);
            //console.warn('edges: ', edges);
            
            // Fit to the selected node to help with crazy physics
            if (nodes.get(asset.id)) {
                let ids = [asset.id];
                network.fit({nodes: ids, anmiation: false});
                network.selectNodes(ids);
                self.listChildren(component, asset, network);
            } else {
                
                // Add the selected asset node, setting fit and select to true
                self.addAssetNode(component, asset, null, 0, network, nodes, edges, true, true);
                self.addAssetChildren(component, asset, network, nodes, edges, true, true);
            }
        }
    },
    
    handleShowDependencies: function(component) {
        let self = this;
        
        let nodeId = component.get('v.selectedAssetId');        
        //console.warn('selected nodeId: ', nodeId);
        
        if (nodeId) {
            let assetMap = component.get('v.assetMap') || {};
            let asset = assetMap[nodeId];
            //console.warn('asset: ', asset);
            if (asset) {
                
                let network = component.get('v.network');                
                let nodes = component.get('v.nodes');
                let edges = component.get('v.edges');                  
                
                let item = null;
                let itemMaps = component.get('v.itemMaps');
                
                if (asset.type === 'dataset') {
                    let dataset = asset;                    
                    let itemMap = itemMaps['dashboards'] || {};
                    let assetItem = null;
                    let dashboard = null;
                    for (var name in itemMap) {
                        assetItem = itemMap[name];
                        dashboard = assetItem.asset;
                        if (dashboard.datasets && dashboard.datasets.length > 0) {
                            dashboard.datasets.forEach(function(d) {
                                if (d.id === dataset.id) {
                                    self.addAssetNode(component, dashboard, null, 0, network, nodes, edges);
                                    self.addAssetChildren(component, dashboard, network, nodes, edges);
                                } 
                            });
                        }
                    } 
                    
                    itemMap = itemMaps['analyses'] || {};
                    assetItem = null;
                    let analysis = null;
                    let dashboards = [];
                    for (var name in itemMap) {
                        assetItem = itemMap[name];
                        analysis = assetItem.asset;
                        let datasets = analysis.input.dataset ? [analysis.input.dataset] : null;
                        datasets = analysis.input.datasets || datasets;
                        if (datasets && datasets.length > 0) {
                            datasets.forEach(function(d) {
                                if (d.id === dataset.id) {
                                    //console.warn('match for dataset: ', d);
                                    self.addAssetNode(component, analysis, null, 0, network, nodes, edges);
                                    self.addAssetChildren(component, analysis, network, nodes, edges);
                                } 
                            });
                        }
                    } 
                    
                }
            }
        }        
    },
    
    listChildren: function(component, asset, network) {
        //console.warn('listChildren: ', asset.type, asset);
    	let children = null;
        let childMap = {};
        let item = null;
        let itemMaps = component.get('v.itemMaps');
        if (asset.children) {
            children = asset.children;            
        } else {
            children = [];
            if (asset.type === 'fields') {
                let fieldList = asset.datasetDetails.fieldList;
                fieldList.forEach(function(field) {
                    //console.warn('field: ', field);
                    item = {
                        id: asset.dataset.id + '_field_' + field.name,
                        name: field.name,
                        label: field.label,
                        selected: false,
                        parentAssetId: asset.id,
                        type: 'dataset_field',
                        field: field,
                        dataset: asset.dataset,
                        datasetDetails: asset.datasetDetails
                    }
                    children.push(item);
                });
            } else if (asset.type === 'dataset') {
                //console.warn('create list for dataset');
               	let dataset = asset;
                let fieldList = dataset.datasetDetails.fieldList;
                
                let sectionItem = {
                    label: 'Fields',
                    name: 'fields',
                    type: 'section',
                    items: []
                };
                children.push(sectionItem);
                fieldList.forEach(function(field) {
                    //console.warn('field: ', field);
                    item = {
                        id: dataset.id + '_field_' + field.name,
                        name: field.name,
                        label: field.label,
                        selected: false,
                        parentAssetId: dataset.id,
                        type: 'dataset_field',
                        field: field,
                        datasetDetails: dataset.datasetDetails
                    }
                    sectionItem.items.push(item);
                });
            } else if (asset.type === 'dashboard') {
                //console.warn('create list for dashboard');
               	let dashboard = asset;
                let datasets = dashboard.datasets;

                let datasetDetails = null;
                let itemMap = itemMaps['datasets'] || {};
                //console.warn('itemMap: ', itemMap);

                let sectionItem = {
                    label: 'Datasets',
                    name: 'datasets',
                    type: 'section',
                    items: []
                };
                children.push(sectionItem);                
                let idx = 0;
                datasets.forEach(function(dataset) {
                    //console.warn('dataset: ', dataset);
                    datasetDetails = itemMap[dataset.id].asset;
                    //console.warn('datasetDetails: ', datasetDetails);
                    
                    item = {
                        id: datasetDetails.id,
                        name: datasetDetails.name,
                        label: datasetDetails.label,
                        selected: false,
                        parentAssetId: dashboard.id,
                        type: 'dataset',
                        dataset: datasetDetails
                    }
                    sectionItem.items.push(item);                        
                    idx++;                        
                });                
                
            } else if (asset.type === 'folder') {
                
                let folder = asset;                
                let itemMap = itemMaps['dashboards'] || {};
                let assetItem = null;
                let dashboard = null;
                let dashboards = [];
                
                let sectionItem = {
                    label: 'Dashboards',
                    name: 'dashboards',
                    type: 'section',
                    items: []
                };
                children.push(sectionItem); 
                
                let idx = 0;
                for (var name in itemMap) {
                    assetItem = itemMap[name];
                    dashboard = assetItem.asset;
                    if (dashboard.folder.id === folder.id) {
                        item = {
                            id: dashboard.id,
                            name: dashboard.name,
                            label: dashboard.label,
                            selected: false,
                            parentAssetId: asset.id,
                            type: 'dashboard',
                            dashboard: dashboard
                        }
                        sectionItem.items.push(item);                        
                        idx++;
                    }
                };                  
                
                itemMap = itemMaps['analyses'] || {};
                assetItem = null;
                let analysis = null;
                sectionItem = {
                    label: 'Stories',
                    name: 'stories',
                    type: 'section',
                    items: []
                };
                children.push(sectionItem);                 
                idx = 0;
                for (var name in itemMap) {
                    assetItem = itemMap[name];
                    analysis = assetItem.asset;
                    if (analysis.folder.id === folder.id) {
                        item = {
                            id: analysis.id,
                            name: analysis.name || analysis.label,
                            label: analysis.label,
                            selected: false,
                            parentAssetId: asset.id,
                            type: 'analysis',
                            analysis: analysis
                        }
                        sectionItem.items.push(item);                        
                        idx++;
                    }
                };                  
                
            } else if (asset.type === 'analysis') {
                let analysis = asset;
                if (analysis.input) {
                    let datasets = analysis.input.dataset ? [analysis.input.dataset] : null;
                    datasets = analysis.input.datasets || datasets;
                    let datasetDetails = null;
	                let itemMap = itemMaps['datasets'] || {};
                    //console.warn('itemMap: ', itemMap);
                    let sectionItem = {
                        label: 'Datasets',
                        name: 'datasets',
                        type: 'section',
                        items: []
                    };
                	children.push(sectionItem);
                    
                    let idx = 0;
                    datasets.forEach(function(dataset) {
                        //console.warn('dataset: ', dataset);
                        datasetDetails = itemMap[dataset.id].asset;
                        //console.warn('datasetDetails: ', datasetDetails);
                        
                        item = {
                            id: datasetDetails.id,
                            name: datasetDetails.name,
                            label: datasetDetails.label,
                            selected: false,
                            parentAssetId: asset.id,
                            type: 'dataset',
                            dataset: datasetDetails
                        }
                        sectionItem.items.push(item);                        
                        idx++;                        
                    });
                    
                }
            }
            
            asset.children = children;
        }
        
        let activeOptionSection = null;
        
        children.forEach(function(child) {            
            if (child.type === 'section') {
                activeOptionSection = activeOptionSection || child.name;
                child.items.forEach(function(item) {
                    childMap[item.name] = item;
                })
            } else {
	            childMap[child.name] = child;
            }
        });
                         
        component.set('v.activeOptionSection', activeOptionSection);
        component.set('v.selectedAssetChildren', children);
        component.set('v.selectedAssetChildMap', childMap);
    },
    
    updateSelectedChildren: function(component, name, label, checked) {
        //console.warn('updateSelectedChildren: ', name, label, checked);
        let self = this;
        let children = component.get('v.selectedAssetChildren');
        let childMap = component.get('v.selectedAssetChildMap');
        let assetMap = component.get('v.assetMap');
        
        let child = childMap[name];
        
        //console.warn('child: ', child);
        
        let parent = assetMap[child.parentAssetId];
        
        //console.warn('parent: ', parent);
        
        child.checked = checked;
        
        let network = component.get('v.network');
        let nodes = component.get('v.nodes');
        let edges = component.get('v.edges');     
        
        if (network === null || typeof network === 'undefined') {
            return;
        }
        
		let assetId = null;
        
        if (child.type === 'dataset_field') {
            let dataset = parent;
            let field = child;
            if (dataset && dataset.id) {
	            assetId = dataset.id + '_field_' + field.name;
            }
        } else {
            child = child[child.type];
            assetId = child.id;
        }
                        
        //console.warn('assetId: ', assetId);
        
        var asset = assetMap[assetId];

        //console.warn('asset: ', asset);
        
        if (asset) {
         	// Asset exists, so remove/hide it
         	//console.warn('Asset exists, so remove/hide it!');
            
            if (checked === true) {
                //console.warn('show it');
	            if (nodes.get(asset.id)) {
                    let node = nodes.get(asset.id);
                    //console.warn('node: ', node);
                    //node.hidden = false;
                    nodes.update({id: asset.id, hidden: false});
    	            let ids = [asset.id];
        	        network.fit({nodes: ids, anmiation: false});
                }    
            } else {
                //console.warn('hide it');
	            if (nodes.get(asset.id)) {
                    let node = nodes.get(asset.id);
                    //console.warn('node: ', node);
                    nodes.update({id: asset.id, hidden: true});
    	            let ids = [asset.id];
                    let edgeFromId = asset.id;
                    let edgeMap = {};
                    
                    edges.forEach(function(edge) {
                        edgeMap[edge.to] = edgeMap[edge.to] || {};
                        edgeMap[edge.to][edge.from] = edgeMap[edge.to][edge.from] ? edgeMap[edge.to][edge.from] : 0;
                    });
                    /*
                    edges.forEach(function(edge) {
                        edgeMap[edge.from] = edgeMap[edge.from] || {
                            nodes: [],
                            edges: []
                        };
                        edgeMap[edge.from].nodes.push(edge.to);
                        edgeMap[edge.from].edges.push(edge.id);
                    });
                    
					var fromNode = null;
                    for (var id in edgeMap) {
                        fromNode = edgeMap[id];
                        console.warn('fromNode ', id, ' to: ', fromNode.nodes.length, ', via: ', fromNode.edges.length);
                    }
                    
                    fromNode = edgeMap[asset.id];
                    if (fromNode.nodes.length === 1) {
                        var toNode = edgeMap[fromNode.nodes[0]];
                        var depth = 0;
	                    while (toNode !== null && toNode.edges.length === 1 && depth < 10) {
                            edges.update({id: toNode.edges[0], hidden: true});
                            nodes.update({id: toNode})
                            if (toNode.nodes.length === 1) {
                                toNode = edgeMap[toNode.nodes[0]];
                            }
                            depth++;
                        }
                    } else {
                        console.error('no connected nodes');
                    }
                    */
                    
                    network.fit({anmiation: false});

                    //let node = nodes.get(asset.id);
                    //node.hidden = true;
        	        //nodes.remove(asset.id);
                }    
            }
        } else {
            self.addAssetNode(component, child, {parents: [parent]}, 0, network, nodes, edges);
            self.addAssetChildren(component, child, network, nodes, edges);        

        }
        
    },
    
   	getDatasetDetails: function(component, dataset, callback) {
        //console.warn('getDatasetFieldList: ', dataset);
        var self = this;
        
        if (dataset !== null) {
            
            self.getDatasetFields(component, dataset.id, dataset.currentVersionId, function(err, xmd) {                
                //console.warn('getDatasetFields returned: ', err, xmd);
                //console.warn(JSON.stringify(xmd, null, 2));

                var datasetDetails = {
                    xmd: xmd
                };
                
                var connector = xmd.dataset.connector;
                //console.warn('connector: ', connector);
                var fullyQualifiedName = xmd.dataset.fullyQualifiedName;
                //console.warn('fullyQualifiedName: ', fullyQualifiedName);
                
                var fieldMap = self.parseXMD(component, xmd);
                //console.warn('fieldMap: ', fieldMap);
                
                datasetDetails.fieldMap = fieldMap;
                
                var fieldList = [];
                var shownFields = {};
                
                var field = null;
                var fieldDetails = null;
                
                var max = 10;
                
                // First use fields that have labels
                var i = 0;
                for (var name in fieldMap) {
                    field = fieldMap[name];
                    //console.warn('field: ', field);
                    
                    fieldDetails = field[field.type];
                    //console.warn('fieldDetails: ', fieldDetails);
                    //console.warn(name, fieldDetails.label, field.type);
                    if (field.type === 'dimension' && fieldDetails.showInExplorer === true) {
                        fieldList.push({
                            name: name,
                            label: fieldDetails.label,
                            type: field.type,
                            selected: i < max && fieldDetails.label !== name,
                            hasLabel: fieldDetails.label !== name
                        });
                        if (fieldDetails.label !== name) {
                            shownFields[name] = 1;
                            i++;
                        }
                    }
                }
                
                // Add the rest
                for (var name in fieldMap) {
                    field = fieldMap[name];
                    fieldDetails = field[field.type];
                    if (fieldDetails.showInExplorer === true && shownFields[name] !== 1) {
                        fieldList.push({
                            name: name,
                            label: fieldDetails.label,
                            type: field.type,
                            selected: i < max,
                            hasLabel: fieldDetails.label !== name
                        });
                        if (fieldDetails.label !== name) {
                            i++;
                        }
                    }
                }
                
                datasetDetails.fieldList = fieldList;
                
                //console.warn('calling callback with datasetDetails: ', datasetDetails);
                if (typeof callback === 'function') {
                    callback(null, datasetDetails);
                }
                
            });
        }
    },
    
    getDatasetFields: function(component, datasetId, versionId, callback) {
        var sdk = component.find("sdk");
        
        var context = {apiVersion: "46"};
        var methodName = "getDatasetFields";
        var methodParameters = {
            datasetId: datasetId,
            versionId: versionId
        };
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            //console.warn('getDatasetFields returned: ', err, data);
            if (err !== null) {
                console.error("getDatasetFields error: ", err);
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
    
    parseXMD: function(component, xmd) {
        var fields = {};
        
        if (xmd !== null && typeof xmd !== 'undefined') {
            
            xmd.dimensions.forEach(function(dimension) {
                //console.warn('dimension: ', dimension);
                fields[dimension.field] = {type: "dimension", dimension: dimension};
            });
            xmd.derivedDimensions.forEach(function(dimension) {
                //console.warn('derived dimension: ', dimension);
                fields[dimension.field] = {type: "derivedDimension", derivedDimension: dimension};
            });
            xmd.measures.forEach(function(measure) {
                //console.warn('measure: ', measure);
                fields[measure.field] = {type: "measure", measure: measure};
            });
            xmd.derivedMeasures.forEach(function(measure) {
                //console.warn('derived measure: ', measure);
                fields[measure.field] = {type: "derivedMeasure", derivedMeasure: measure};
            });
            xmd.dates.forEach(function(date) {
                //console.warn('date: ', date);
                for (var key in date.fields) {
                    fields[date.fields[key]] = {type: "date", name: key, date: date}; 
                }
            });
        }
        //console.warn('fields: ', fields);
        return fields;
    },
    
    describeDataset: function(component, datasetId, callback) {
        //console.warn('describeDataset: ', datasetId);
        var sdk = component.find("sdk");
        
        var context = {apiVersion: "46"};
        var methodName = "describeDataset";
        var methodParameters = {
            datasetId: datasetId
        };
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            //console.warn('describeDataset returned: ', err, data);
            if (err !== null) {
                //console.error("describeDataset error: ", err);
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
    
    describeDashboard: function(component, dashboardId, callback) {
        var sdk = component.find("sdk");
        
        var context = {apiVersion: "46"};
        var methodName = "describeDashboard";
        var methodParameters = {
            dashboardId: dashboardId
        };
        //console.warn('calling sdk.invokeMethod: ', context, methodName, methodParameters);
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            //console.warn('describeDashboard returned: ', err, data)
;            if (err !== null) {
                //console.error("describeDashboard error: ", err);
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
    
    listAssets: function(component, methodName, methodParameters, callback) {
        var sdk = component.find("sdk");
        var context = {apiVersion: "46"};
        var methodName = methodName;
        //console.warn('calling sdk.invokeMethod: ', methodName, methodParameters);
        methodParameters.pageSize = methodParameters.pageSize || 100;
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

    getReplicatedDatasetFields: function(component, replicatedDataset, callback) {
        var self = this;
        var proxy = component.find('proxy');
        
        var url = replicatedDataset.fieldsUrl;
        var config = null;
        
        if (proxy.get('v.ready') !== true) {
            setTimeout(function() {
                self.getReplicatedDatasetFields(component, replicatedDatset, callback);
            }, 500);
        } else {
        
            proxy.exec(url, 'GET', config, function(response) {
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(null, response.body.fields);
                } else {
                    return null;
                }            
            });
        }        
    },
    
    listReplicatedDatasets: function(component, callback) {
        var self = this;
        var proxy = component.find('proxy');
        
        // Construct/generate this!!!!!!!!!!!!!!!!
        var url = '/services/data/v47.0/wave/replicatedDatasets';
        var config = null;
        
        if (proxy.get('v.ready') !== true) {
            setTimeout(function() {
                self.listReplicatedDatasets(component, callback);
            }, 500);
        } else {
        
            proxy.exec(url, 'GET', config, function(response) {
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(null, response.body.replicatedDatasets);
                } else {
                    return null;
                }            
            });
        }
    },
    
    listDatasets: function(component, callback) {
        var self = this;
        var proxy = component.find('proxy');
        
        // Construct/generate this!!!!!!!!!!!!!!!!
        var url = '/services/data/v47.0/wave/datasets';
        var config = null;
        
        if (proxy.get('v.ready') !== true) {
            setTimeout(function() {
                self.listDatasets(component, callback);
            }, 500);
        } else {
        
            proxy.exec(url, 'GET', config, function(response) {
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(null, response.body.datasets);
                } else {
                    return null;
                }            
            });
        }
    },
    

    getRecipeFile: function(component, recipe, callback) {
        var self = this;
        var proxy = component.find('proxy');
        
        var url = recipe.fileUrl;
        var config = null;
        
        if (proxy.get('v.ready') !== true) {
            setTimeout(function() {
                self.getRecipeFile(component, recipe, callback);
            }, 500);
        } else {
        
            proxy.exec(url, 'GET', config, function(response) {
                //console.warn('GET recipe file returned: ', response);
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(null, response.body);
                } else {
                    return null;
                }            
            });
        }        
    },
    
    listRecipes: function(component, callback) {
        var self = this;
        var proxy = component.find('proxy');
        
        // Construct/generate this!!!!!!!!!!!!!!!!
        var url = '/services/data/v46.0/wave/recipes';
        var config = null;
        
        if (proxy.get('v.ready') !== true) {
            setTimeout(function() {
                self.listRecipes(component, callback);
            }, 500);
        } else {
        
            proxy.exec(url, 'GET', config, function(response) {
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(null, response.body.recipes);
                } else {
                    return null;
                }            
            });
        }
    },
    
    listDataflows: function(component, callback) {
        var self = this;
        var proxy = component.find('proxy');
        
        // Construct/generate this!!!!!!!!!!!!!!!!
        var url = '/services/data/v46.0/wave/dataflows';
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
    
    listDashboards: function(component, methodParameters, callback) {
        this.listAssets(component, "listDashboards", methodParameters, function(err, data) {
            callback(err, data ? data.dashboards : null); 
        });
    },
/*    
    listDatasets: function(component, methodParameters, callback) {
        this.listAssets(component, "listDatasets", methodParameters, function(err, data) {
            callback(err, data ? data.datasets : null); 
        });
    },
*/    
    listLenses: function(component, methodParameters, callback) {
        this.listAssets(component, "listLenses", methodParameters, function(err, data) {
            callback(err, data ? data.lenses : null); 
        });
    },
    
    listFolders: function(component, methodParameters, callback) {
        this.listAssets(component, "listFolders", methodParameters, function(err, data) {
            callback(err, data ? data.folders : null); 
        });
    },
    
    listTemplates: function(component, methodParameters, callback) {
        this.listAssets(component, "listTemplates", methodParameters, function(err, data) {
            callback(err, data ? data.templates : null); 
        });
    }    
})