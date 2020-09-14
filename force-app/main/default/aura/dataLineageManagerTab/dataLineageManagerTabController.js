({
    init: function(component, event, helper) {
        let assetManagerReady = component.get('v.assetManagerReady');
        if (assetManagerReady === true) {
	        let assetManager = component.find('assetManager');
            
            assetManager.listDatasets(function(err, datasets) {
                if (err) {
                    console.error('assetManager.listDatasets error: ', err);
                } else {
                    console.warn('assetManager.listDatasets returned: ', datasets);
                    component.set('v.datasets', datasets);
                }
            });
            
            assetManager.listDashboards(function(err, dashboards) {
                if (err) {
                    console.error('assetManager.listDashboards error: ', err);
                } else {
                    console.warn('assetManager.listDashboards returned: ', dashboards);
                    component.set('v.dashboards', dashboards);
                }
            });
        }
    },

    handleBreadcrumbClick: function(component, event, helper) {
        console.warn('handleBreadcrumbClick: ', event);    
        event.preventDefault();
    },
    
    handleAssetManagerReady: function(component, event, helper) {
        console.warn('handleAssetManagerReady');
        let assetManager = component.find('assetManager');
        assetManager.listDatasets(function(err, datasets) {
            if (err) {
                console.error('assetManager.listDatasets error: ', err);
            } else {
                component.set('v.datasets', datasets);
            }
        });

        assetManager.listDashboards(function(err, dashboards) {
            if (err) {
                console.error('assetManager.listDashboards error: ', err);
            } else {
                console.warn('assetManager.listDashboards returned: ', dashboards);
                component.set('v.dashboards', dashboards);
            }
        });

    },
    
	getDashboardLineage: function(component, event, helper) {
		let dataLineageManager = component.find('dataLineageManager');
        let dashboardId = component.get('v.dashboardId');
        dataLineageManager.getLineage({type: 'dashboard', id: dashboardId}, function(err, lineage) {
            if (err) {
                console.error('dataLineageManager.getLinage error: ', err);
            } else {
                console.warn('dataLineageManager.getLineage returned: ', lineage);
            }
        });
	},
    
	getDatasetLineage: function(component, event, helper) {
		let dataLineageManager = component.find('dataLineageManager');
        let datasetId = component.get('v.datasetId');
        dataLineageManager.getLineage({type: 'dataset', id: datasetId}, function(err, lineage) {
            if (err) {
                console.error('dataLineageManager.getLinage error: ', err);
            } else {
                console.warn('dataLineageManager.getLineage returned: ', lineage);
                
                component.set('v.lineage', lineage);
                
                if (lineage.fieldLineage) {
                    component.set('v.fieldLineage', lineage.fieldLineage);
                    
                    let fieldLineageColumns = [];
                    let fieldLineageTable = [];
                    let fieldLineageList = lineage.fieldLineage;


                    fieldLineageList[0].forEach(function(l) {
                        fieldLineageColumns.push({
                            label: l.type,
                            fieldName: l.type,
                            type: 'text'
                        });
                    });
                    
                    fieldLineageColumns.push({
                        label: 'id',
                        fixedWidth: 50,
                        fieldName: 'id',
                        type: 'text'
                    });
                    
                    let record = null;
                    fieldLineageList.forEach(function(fieldLineage, idx) {
                        console.warn('fieldLineage: ', fieldLineage);
                        record = {id: '' + idx};                        
                        fieldLineage.forEach(function(l) {
                            record[l.type] = l.label;
                        });
                        console.warn('record: ', record);
                        fieldLineageTable.push(record);
                    });
                    component.set('v.fieldLineageColumns', fieldLineageColumns);
                    component.set('v.fieldLineageTable', fieldLineageTable);
                }
                
                let assetJson = [];                
                let item = null;
                
                if (lineage.dataset) {
                    item = {
                        name: 'dataset',
                        label: 'Dataset',
                        json: JSON.stringify(lineage.dataset, null, 2)
                    };
	                assetJson.push(item);
                }

                if (lineage.datasetDetails) {
                    if (lineage.datasetDetails.xmd) {
                        item = {
                            name: 'xmd',
                            label: 'XMD',
                            json: JSON.stringify(lineage.datasetDetails.xmd, null, 2)
                        };
                        assetJson.push(item);
                    }
                    if (lineage.datasetDetails.fieldMap) {
                        item = {
                            name: 'fields',
                            label: 'Fields',
                            json: JSON.stringify(lineage.datasetDetails.fieldMap, null, 2)
                        };
                        assetJson.push(item);
                    }
                }

                if (lineage.datasetSource) {
                    
                    if (lineage.datasetSource.recipeDetails) {
                        if (lineage.datasetSource.recipeDetails.recipe) {
                            item = {
                                name: 'recipe',
                                label: 'Recipe',
                                json: JSON.stringify(lineage.datasetSource.recipeDetails.recipe, null, 2)
                            };
                            assetJson.push(item);                            
                        }
                        if (lineage.datasetSource.recipeDetails.recipeFile) {
                            item = {
                                name: 'recipeFile',
                                label: 'Recipe File',
                                json: JSON.stringify(lineage.datasetSource.recipeDetails.recipeFile, null, 2)
                            };
                            assetJson.push(item);                            
                        }
                        if (lineage.datasetSource.recipeDetails.lineage) {
                            item = {
                                name: 'recipeLineage',
                                label: 'Recipe Lineage',
                                json: JSON.stringify(lineage.datasetSource.recipeDetails.lineage, null, 2)
                            };
                            assetJson.push(item);                            
                        }
                    }
                    
                    if (lineage.datasetSource.replicatedDataset) {
                    	if (lineage.datasetSource.replicatedDataset.connector) {
                            item = {
                                name: 'connector',
                                label: 'Connector',
                                json: JSON.stringify(lineage.datasetSource.replicatedDataset.connector, null, 2)
                            };
                            assetJson.push(item);
                        }
                    	if (lineage.datasetSource.replicatedDataset.fields) {
                            item = {
                                name: 'replicatedFields',
                                label: 'Replicated Fields',
                                json: JSON.stringify(lineage.datasetSource.replicatedDataset.fields, null, 2)
                            };
                            assetJson.push(item);
                        }
                    }
                }
/*                
                let json = null;
                for (var key in lineage) {
                   	json = JSON.stringify(lineage[key], null, 2);
                    assetJson.push({
                        name: key,
                        label: key,
                        json: json
                    });
                }
*/
                component.set('v.assetJson', assetJson);
            }
        });
	},
    
	getTemplateLineage: function(component, event, helper) {
		let dataLineageManager = component.find('dataLineageManager');
        let templateId = component.get('v.templateId');
        dataLineageManager.getLineage({type: 'template', id: templateId}, function(err, lineage) {
            if (err) {
                console.error('dataLineageManager.getLinage error: ', err);
            } else {
                console.warn('dataLineageManager.getLineage returned: ', lineage);
            }
        });
	},
    
    getRecipeFile: function(component, event, helper) {
		let url = '/services/data/v47.0/wave/recipes/05vB0000000Cau6IAC/file';
        let assetManager = component.find('assetManager');
        assetManager.getRecipeFile(url, function(err, file) {
            if (err) {
                console.error('assetManager.getRecipeFile error: ', err);
            } else {
                console.warn('assetManager.getRecipeFile returned: ', file);
            }
        });        
    }
    
    
})