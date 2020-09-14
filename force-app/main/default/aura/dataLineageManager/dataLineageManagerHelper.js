({
	getLineage: function(component, params) {
        let self = this;
        if (params) {
            let config = params.config;
            
            console.warn('dataLineageManager.getLineage - config: ', config);
            
            let assetManager = component.find('assetManager');
            assetManager.getAsset(config, function(err, asset) {
                if (err) {
                    console.warn('assetManager.getAsset error: ', err);
                    if (typeof params.callback === 'function') {
                        params.callback(err, null);
                    }
                } else if (asset) {
                    console.warn('dataLineageManager - asset: ', asset);
                    asset.type = asset.templateType ? 'template' : asset.type;
                    console.warn('asset.type: ', asset.type);
                    
                    try {
                        let methodName = 'get_' + asset.type + '_lineage';
                        self[methodName](component, asset, params.callback);
                    } catch (e) {
                        console.error('Exception: ', e);
                    }
                    
                } else {
                    if (typeof params.callback === 'function') {
                        params.callback({error: 'NO_ASSET_FOUND', msg: 'No asset found'});
                    }
                }
            });
        }
	},

    get_dashboard_lineage: function(component, dashboard, callback) {
        let self = this;
        console.warn('get_dashboard_lineage: ', dashboard);

        let lineage = {
            type: 'dashboard_lineage',
            label: dashboard.label || dashboard.name,
            dashboard: dashboard
        };

        let assetManager = component.find('assetManager');
        assetManager.describeDashboard(dashboard.id, function(err, dashboardDetails) {
            console.warn('getDashboardDetails returned: ', dashboardDetails);
            lineage.dashboardDetails = dashboardDetails;
            
            
            if (typeof callback === 'function') {
                callback(null, lineage);
            }               
        });

    },
    
    get_dataset_lineage: function(component, dataset, callback) {
        let self = this;
        console.warn('get_dataset_lineage: ', dataset);
        
        let lineage = {
            type: 'dataset_lineage',
            label: dataset.label || dataset.name,
            dataset: dataset
        };
        
        let assetManager = component.find('assetManager');
        assetManager.getDatasetDetails(dataset, function(err, datasetDetails) {
            console.warn('getDatasetDetails returned: ', datasetDetails);
            lineage.datasetDetails = datasetDetails;
            
            self.determineDatasetSource(component, dataset, datasetDetails, function(err, datasetSource) {
                console.warn('determineDatasetSource returned: ', err, datasetSource);
                lineage.datasetSource = datasetSource;
                
                
                if (err) {
                    
                } else {

                    let replicatedDataset = datasetSource.replicatedDataset || null;
                    let replicatedDatasetFields = replicatedDataset ? replicatedDataset.fields : null;
                    let replicatedDatasetFieldMap = {};
                    if (replicatedDatasetFields) {
                        replicatedDatasetFields.forEach(function(field) {
                            replicatedDatasetFieldMap[field.name] = field;
                        });
                    }
                    
                    let recipeDetails = datasetSource.recipeDetails || null;
                    let recipe = recipeDetails ? recipeDetails.recipe : null;
                    let recipeFile = recipeDetails ? recipeDetails.recipeFile : null;
                    let recipeLineage = recipeDetails ? recipeDetails.lineage : null;
                    let recipeLineageFieldMap = {};
                    if (recipeLineage) {
                        recipeLineage.forEach(function(l) {
                         	recipeLineageFieldMap[l.field] = l;
                        });
                    }
                    
                    let fieldList = datasetDetails.fieldList;
                    let fieldAsset = null;
                    let replicatedField = null;
                    let recipeField = null;
                    let fieldLineage = null;
                    let fieldLineageList = [];
                    
                    let tokens = null;
                    let objectName = null;
                    let relatedObjectName = null;
                    let relatedFieldName = null;
                    let relatedField = null;
                    let relatedDataset = null;
                    let relatedFullyQualifiedName = null;

                    fieldList.forEach(function(field, idx) {
                        console.warn('field: ', field);
                        fieldLineage = [];
                        fieldLineage.push({
                            type: 'dataset',
                            label: dataset.label,
                            dataset: dataset
                        });
                        fieldLineage.push({
                            type: 'field',
                            label: field.label || field.name || field.field,
                            field: field
                        });
                        
                        // Checking for related fields
                        // Note that this is not likely to be perfect!!!!!
                        console.warn('checking for related fields: ', field.fullyQualifiedName);
                        tokens = field.fullyQualifiedName.split('.');
                        if (tokens.length > 2 || field.field.indexOf('Id') > 0) {
                            console.warn('######################### LIKELY A RELATED FIELD: ', field.fullyQualifiedName + ' has ' + tokens.length + 'parts');
                            

                            objectName = tokens[0];
                            
                            if (tokens.length === 2) {
                                relatedObjectName = field.field.replace('Id', '');
                                relatedFieldName = 'Id';
                                
                            } else {
                                relatedObjectName = tokens[1].replace('Id', '');
                                relatedFieldName = tokens[2];
                            }
                            
	                        replicatedField = replicatedDatasetFieldMap[relatedFieldName];
    	                    recipeField = recipeLineageFieldMap[relatedFieldName];

                            relatedField = {
                                field: relatedFieldName,
                                fullyQualifiedName: relatedObjectName + '.' + relatedFieldName,
                                hasLabel: field.hasLabel,
                                label: field.label,
                                name: relatedFieldName,
                                selected: true,
                                type: field.type                          
                            };
                            
                            relatedDataset = {
                                name: relatedObjectName,
                                sourceObjectName: relatedObjectName,
                                label: relatedObjectName,
                                type: 'relateddataset'
                            };


                            if (replicatedField) {
                                
                                if (replicatedDataset.connector) {
                                    fieldLineage.push({
                                        type: 'replicated_dataset_connector',
                                        label: replicatedDataset.connector.label || replicatedDataset.connector.name,
                                        replicated_dataset_connector: replicatedDataset.connector
                                    });
                                }
                            } else if (recipeField) {
                                fieldLineage.push({
                                    type: 'recipe',
                                    label: recipe.label || recipe.name,
                                    recipe: recipe
                                });                                
                            } else {
                                if (datasetDetails.xmd.dataset && datasetDetails.xmd.dataset.connector) {
                                    fieldLineage.push({
                                        type: 'dataset_connector',
                                        label: datasetDetails.xmd.dataset.connector,
                                        replicated_dataset_connector: datasetDetails.xmd.dataset.connector
                                    });
                                }
                            }
                            
                            fieldLineage.push({
                                type: 'related_dataset_field',
                                label: relatedField.name,
                                related_dataset_field: relatedField
                            });
                            
                            fieldLineage.push({
                                type: 'related_dataset',
                                label: relatedDataset.label || relatedDataset.name,
                                related_dataset: relatedDataset
                            });
                            
                        } else {
                            
    	                    replicatedField = replicatedDatasetFieldMap[field.field];
	                        recipeField = recipeLineageFieldMap[field.field];
                            
                            console.warn('recipeField: ', recipeField);
                            console.warn('replicatedField: ', replicatedField);
                            
                            
                            if (!recipeField && !replicatedField) {
                                // Most likely a CSV? Other?
                                if (datasetDetails.xmd.dataset && datasetDetails.xmd.dataset.connector) {
                                    fieldLineage.push({
                                        type: 'dataset_connector',
                                        label: datasetDetails.xmd.dataset.connector,
                                        replicated_dataset_connector: datasetDetails.xmd.dataset.connector
                                    });
                                    
                                    fieldLineage.push({
                                        type: 'dataset_source',
                                        label: datasetDetails.xmd.dataset.fullyQualifiedName,
                                        replicated_dataset_connector: datasetDetails.xmd.dataset.fullyQualifiedName
                                    });
                                }
    
                            } else {
                                
                                if (recipeField) {
                                    fieldLineage.push({
                                        type: 'recipe',
                                        label: recipe.label || recipe.name,
                                        recipe: recipe
                                    });
                                    fieldLineage.push({
                                        type: 'recipe_field',
                                        label: recipeField.field,
                                        recipe_field: recipeField
                                    });
                                    if (recipeField.dataset) {
                                        fieldLineage.push({
                                            type: 'recipe_source_dataset',
                                            label: recipeField.dataset.label || recipeField.datset.name,
                                            recipe_source_dataset: recipeField.dataset
                                        });
                                    }
                                }
                                
                                if (replicatedField) {
        
                                    if (replicatedDataset.connector) {
                                        fieldLineage.push({
                                            type: 'replicated_dataset_connector',
                                            label: replicatedDataset.connector.label || replicatedDataset.connector.name,
                                            replicated_dataset_connector: replicatedDataset.connector
                                        });
                                    }
        
                                    fieldLineage.push({
                                        type: 'replicated_dataset_field',
                                        label: replicatedField.name,
                                        replicated_dataset_field: replicatedField
                                    });
                                    
                                    fieldLineage.push({
                                        type: 'replicated_dataset',
                                        label: replicatedDataset.label || replicatedDataset.name,
                                        replicated_dataset: replicatedDataset
                                    });
    
                                    
                                }
                            }
                        }
                        
                        fieldLineageList.push(fieldLineage);
                        
                    });
/*                        
                    let connector = datasetSource.connector;
                    let sourceFields = datasetSource.fields;
                    let sourceFieldMap = {};
                    sourceFields.forEach(function(field) {
                       	sourceFieldMap[field.name] = field; 
                    });
                    let sourceField = null;
                    
                    let xmd = datasetDetails.xmd;
                    
                    let fieldList = datasetDetails.fieldList;
                    let fieldAsset = null;
                    fieldList.forEach(function(field, idx) {
                        //console.warn('field: ', field);
                        //console.warn('field lineage: ', field.name, ':', field.field, ':', field.fullyQualifiedName.split('.'));
                        sourceField = sourceFieldMap[field.field];
                        console.warn('field lineage: ', datasetSource.name, ' - ', field.name, ' - ', connector.connectorType, ' - ', sourceField.name, ' - ', datasetSource.sourceObjectName);
                    });
*/                    
                    lineage.fieldLineage = fieldLineageList;
                    
                    if (typeof callback === 'function') {
                        callback(null, lineage);
                    }                                        
                }                
            });
 
        });
        
    },
    
    getRecipeLineage: function(component, recipe, recipeFile, callback) {
        let self = this;
        console.warn('getRecipeLineage: ', recipe, recipeFile);
        
        let assetManager = component.find('assetManager');
        
        let datasets = {};        
        let tableModelInfo = recipeFile.tableModelInfo;
        let rootDataset = tableModelInfo.rootDataset;
        datasets[rootDataset.qualifier] = rootDataset;        
        
        let steps = recipeFile.steps;
        steps.forEach(function(step) {
            if (step.dataset) {
                console.warn('step.dataset: ', step.dataset);
                datasets[step.dataset.qualifier] = step.dataset;
                /*
                self.get_dataset_lineage(component, step.dataset, function(err, dataetLinage) {
                 	step.dataset.lineage = lineage;
                });
                */
            }
        });
        
        console.warn('datasets: ', datasets);
        
    	let publishFields = recipeFile.publishFields;
        let tokens = null;
        let qualifier = null;
        let fieldName = null;
        let dataset = null;
        let lineage = [];
        let item = null;
        let datasetIds = {};
        publishFields.forEach(function(publishField) {
            console.warn('publishField.name: ', publishField.name);
            tokens = publishField.name.split('$');
           	qualifier = tokens[0];
            fieldName = tokens[1];
            
            console.warn('qualifier: ', qualifier, ' - fieldName: ', fieldName);

            dataset = datasets[qualifier];

            console.warn('dataset: ', dataset);
            if (dataset) {
                datasetIds[dataset.name] = dataset;
            }
            
            item = {
                field: (rootDataset.qualifier !== qualifier ? qualifier + '.' : '' ) + fieldName,
                dataset: dataset
            }
            
            lineage.push(item);
            
        });

        // How to best get the dataset/dataset details?
/*
       	let counter = 0;
        for (var id in datasetIds) {
            counter++;
            console.warn('>>>>>>>>>>>>>>>>>>>>>> calling assetManager.getDataset: ', id);
            assetManager.getDataset(id, function(err, dset) {
                counter--;
                console.warn('>>>>>>>>>>>>>>>>>>>>>> dset: ', dset);
                console.warn('>>>>>>>>>>>>>>>>>>>>>> counter: ', counter);
                if (counter === 0) {
                    console.warn('************************************* DONE *****************************');

                    linege.forEach(function(l) {
                      	 
                    });
                    if (typeof callback === 'function') {
                        callback(null, lineage);
                    }

                }
            });
        }
*/
        
        if (typeof callback === 'function') {
            callback(null, lineage);
        }
        
    },
    
    getRecipeDetails: function(component, dataset, callback) {
        let self = this;
        let assetManager = component.find('assetManager'); 
        
        assetManager.listRecipes(function(err, recipes) {
            let recipe = null;
            recipes.forEach(function(r) {
                if (r.dataset && (r.dataset.id === dataset.id)) {
                    recipe = r;
                }
            });
        
            if (recipe) {
                assetManager.getRecipeFile(recipe.fileUrl, function(err, file) {
                    console.warn('getRecipeFile returned: ', err, file);
                    if (err) {
                        if (typeof callback === 'function') {
                            callback({err: 'NO_RECIPE_FILE', msg: 'No recipe file'}, null);
                        }                    
                    } else {
                        self.getRecipeLineage(component, recipe, file, function(err, lineage) {
                            console.warn('getRecipeLineage returned: ', err, lineage);
                            if (err) {
                                if (typeof callback === 'function') {
                                    callback({err: 'NO_RECIPE_FILE', msg: 'No recipe file'}, null);
                                }
                            } else {
                                let recipeDetails = {
                                    recipe: recipe,
                                    recipeFile: file,
                                    lineage: lineage
                                };
                                if (typeof callback === 'function') {
                                    callback(null, recipeDetails);
                                }                    
                            }
                        });
                    }
                });
                
            } else {
                if (typeof callback === 'function') {
                    callback({err: 'NO_RECIPE', msg: 'No recipe'}, null);
                }
            }
        });
    },
    
    getReplicatedDataset: function(component, dataset, datasetDetails, callback) {
        let self = this;
        let fullyQualifiedName = datasetDetails.xmd.dataset.fullyQualifiedName;
        let assetManager = component.find('assetManager'); 
        
        assetManager.listReplicatedDatasets(function(err, replicatedDatasets) {            
            if (replicatedDatasets) {
                let replicatedDataset = null;
                replicatedDatasets.forEach(function(r) {
                    if (r.name === fullyQualifiedName) {
                        replicatedDataset = r;
                    }
                });
                if (replicatedDataset) {
                    console.warn('replicatedDataset match: ', replicatedDataset);
                    assetManager.getReplicatedDatasetFields(replicatedDataset.fieldsUrl, function(err, fields) {
                        let datasetSource = replicatedDataset;
                        datasetSource.fields = fields;
                        
                        if (typeof callback === 'function') {
                            callback(null, datasetSource);
                        }
                        
                    });
                    
                } else {
                    if (typeof callback === 'function') {
                        callback({err: 'NO_REPLICATED_DATASET', msg: 'No replicated dataset'}, null);
                    }
                }
            } else {
                    if (typeof callback === 'function') {
                        callback({err: 'NO_REPLICATED_DATASETS', msg: 'No replicated datasets'}, null);
                    }                
            }
        });        
    },

    determineDatasetSource: function(component, dataset, datasetDetails, callback) {
        let self = this;
        try {
            self.getRecipeDetails(component, dataset, function(err, recipeDetails) {
                
                //console.warn('getRecipeDetails returned: ', err, recipeDetails);
                
                self.getReplicatedDataset(component, dataset, datasetDetails, function(err, replicatedDataset) {

                	//console.warn('getReplicatedDataset returned: ', err, replicatedDataset);
                    
                    let datasetSource = {
                        datasetId: dataset.id,
                        recipeDetails: recipeDetails,
                        replicatedDataset: replicatedDataset
                    };
                    
                    if (typeof callback === 'function') {
                        callback(null, datasetSource);
                    }
                    
                });
            });
        } catch (e) {
            console.error('Exception: ', e);
            if (typeof callback === 'function') {
                callback(e, null);
            }            
        }
  /*      
            let fullyQualifiedName = dataset.fullyQualifiedName;
            let assetManager = component.find('assetManager');
            assetManager.listRecipes(function(err, recipes) {
                let recipe = null;
                recipes.forEach(function(r) {
                    if (r.dataset && (r.dataset.id === dataset.id)) {
                        recipe = r;
                    }
                });
                
                    

                })
                
                //
                if (recipe) {
                    console.warn('matched recipe: ', recipe);
                    assetManager.getRecipeFile(recipe.fileUrl, function(err, file) {
                        console.warn('getRecipeFile returned: ', err, file);
                        if (err) {
                            
                        } else {
                            self.getRecipeLineage(component, recipe, file, function(err, lineage) {
                                console.warn('getRecipeLineage returned: ', lineage);
                                
                            });
                        }
                    });
                }
                //
                
                assetManager.listReplicatedDatasets(function(err, replicatedDatasets) {            
                    console.warn('replicatedDatasets: ', replicatedDatasets);
                    if (replicatedDatasets) {
                        let replicatedDataset = null;
                        replicatedDatasets.forEach(function(r) {
                            if (r.name === fullyQualifiedName) {
                                replicatedDataset = r;
                            }
                        });
                        if (replicatedDataset) {
                            console.warn('replicatedDataset match: ', replicatedDataset);
                            assetManager.getReplicatedDatasetFields(replicatedDataset.fieldsUrl, function(err, fields) {
                                console.warn('replicated dataset fields: ', fields);
                                let datasetSource = replicatedDataset;
                                datasetSource.fields = fields;
        
                                if (typeof callback === 'function') {
                                    callback(null, datasetSource);
                                }
                                
                            });
                            
                        } 
                    }
                });
                
            });
            
        } catch (e) {
            console.error('Exception: ', e);
            if (typeof callback === 'function') {
                callback(e, null);
            }
        }
*/
        
    }

})