({
    productNameMap: {
        'dashboard': 'Analytics',
        'dataset': 'Analytics',
        'dataflow': 'Analytics',
        'lens': 'Analytics',
        'template': 'Analytics',
        'folder': 'Analytics',
        'story': 'Discovery',
        'analysis': 'Discovery'	    
    },
    
    typeDetailsMethodMap: {
        'dashboard': 'describeDashboard',
        'dataset': 'describeDataset',
        'dataflow': 'USE_PROXY',
        'lens': 'describeLens',
        'template': 'getTemplate',
        'analysis': 'USE_PROXY'
    },
    
    assetHistoryColumns: [
        {label: 'Label', fieldName: 'label', type: 'text'},
        {label: 'Name', fieldName: 'name', type: 'text'},
        {label: 'Created By', fieldName: 'createdByName', type: 'string'},
        {label: 'Created Date', fieldName: 'createdDate', type: 'date'},
        {label: 'Id', fieldName: 'id', type: 'text'},
        {type: 'action',
         typeAttributes: {
             rowActions: [
                 {label: 'Revert', name: 'revert'},
                 {label: 'Delete', name: 'delete'},
                 {label: 'Rename', name: 'rename'},
                 {label: 'Preview', name: 'preview'}
             ]
         }
        }
    ],
    
    getHistory: function(component, callback) {
        var self = this;
        var proxy = component.find('proxy');
        var assetDetails = component.get('v.assetDetails');
        if (assetDetails === null || typeof assetDetails === 'undefined') {
            if (callback !== null && typeof callback !== 'undefined') {
                callback(null, null);
            } else {
                return null;
            }                        
        } else {
            if (assetDetails.historiesUrl) {
                proxy.getAssetHistory(assetDetails.historiesUrl, function(histories) {
                    //console.warn('analyticsAssetViewerHelper.getAssetHistory - histories: ', histories);
                    if (callback !== null && typeof callback !== 'undefined') {
                        callback(null, histories);
                    } else {
                        return null;
                    }            
                });
            } else {
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(null, null);
                } else {
                    return null;
                }            
            }
        }
    },
    
    doPreview: function(component, row) {
        var self = this;
        //console.warn('doPreview: ', row);
        
        var proxy = component.find('proxy');
        var assetDetails = component.get('v.assetDetails');
        var assetHistory = component.get('v.assetHistory');
        var hasPreview = false;
        if (assetHistory !== null && typeof assetHistory !== 'undefined') {
            assetHistory.forEach(function(version) {
                //console.warn('version: ', version);
                if (version.label === 'PREVIEW') {
                    hasPreview = true;
                    proxy.deleteAssetHistory(version.historyUrl, function(res) {
                        self.doRevert(component, row, function(result) {
                            //console.warn('doRevert returned: ', result);
                            self.doRefresh(component);
                        });
                    });
                }
            });
            if (hasPreview === false) {
                self.doRevert(component, row, function(result) {
                    //console.warn('doRevert returned: ', result);
                    self.doRefresh(component);
                });
            }
        }
    },
        
    doDelete: function(component, row) {
        var self = this;
        console.warn('doDelete: ', row);
        
        var proxy = component.find('proxy');
        
        proxy.deleteAssetHistory(row.historyUrl, function(result) {
            console.warn('deleteAssetHistory returned: ', result);
            self.doRefresh(component);
        });
        
    },
    
    doRevert: function(component, version, callback) {
        var self = this;
        //console.warn('doRevert: ', version);
        
        var proxy = component.find('proxy');
        var assetDetails = component.get('v.assetDetails');
        var assetHistory = component.get('v.assetHistory');
        
        // Optionally get label for revert
        var label = 'PREVIEW';
        
        proxy.revertAssetHistory(version.revertUrl, version.id, label, function(res) {
            //console.warn('proxy.revertAssetHistory returned: ', res);
            if (typeof callback === 'function') {
                callback(res);
            }
        });
        
    },
    
    doRefresh: function(component) {
        //console.warn('doRefresh');
        var self = this;
        var asset = component.get('v.asset');
        var assetType = asset.templateType ? 'template' : asset.type;
        var assetId = asset.id;
        
        component.set('v.dashboardId', null);
        component.set('v.datasetId', null);
        component.set('v.dataflowId', null);
        component.set('v.lensId', null);
        component.set('v.folderId', null);
        component.set('v.templateId', null);      	  
        
        var dashboardId = asset.type === 'dashboard' ? assetId : null;
        var datasetId = asset.type === 'dataset' ? assetId : null;
        var dataflowId = asset.type === 'dataflow' ? assetId : null;
        var lensId = asset.type === 'lens' ? assetId : null;
        var folderId = asset.type === 'folder' ? assetId : null;
        var templateId = asset.type === 'template' ? assetId : null;
        var analysisId = asset.type === 'analysis' ? assetId : null;
        
        component.set('v.dashboardId', dashboardId);
        component.set('v.datasetId', datasetId);
        component.set('v.dataflowId', dataflowId);
        component.set('v.lensId', lensId);
        component.set('v.folderId', folderId);
        component.set('v.templateId', templateId);
        component.set('v.analysisId', analysisId);
        
        self.getHistory(component, function(err, assetHistory) {
            //console.warn('getHistory returned: ', err, assetHistory);
            if (assetHistory) {
                var assetHistoryData = [];
                var data = null;
                assetHistory.forEach(function(history) {
                    data = history;
                    data.createdById = history.createdBy.id;
                    data.createdByName = history.createdBy.name;
                    data.createdByProfilePhotoUrl = history.createdBy.profilePhotoUrl;
                    data.createdDateFormatted = new Date(history.createdDate).toLocaleString();
                });
                component.set('v.assetHistoryColumns', self.assetHistoryColumns);
                component.set('v.assetHistory', assetHistory);
                component.set('v.assetHistoryData', assetHistoryData);
            } else {
                component.set('v.assetHistory', null);
            }
        });
    },
    
    getAssetDetails: function(component, callback) {
        var self = this;
        var sdk = component.find('sdk');
        
        var asset = component.get('v.asset');
        if (asset === null || typeof asset === 'undefined') {
            if (callback !== null && typeof callback !== 'undefined') {
                callback(null, null);
            }
        } else {
            //console.warn('asset: ', JSON.stringify(asset, null, 2));
            var assetType = asset.templateType ? 'template' : asset.type;
            //console.warn('assetType: ' , assetType);
            var assetId = asset.id;
            
            var dashboardId = asset.type === 'dashboard' ? assetId : null;
            var datasetId = asset.type === 'dataset' ? assetId : null;
            var dataflowId = asset.type === 'dataflow' ? assetId : null;
            var lensId = asset.type === 'lens' ? assetId : null;
            var folderId = asset.type === 'folder' ? assetId : null;
            var templateId = asset.type === 'template' ? assetId : null;
            var analysisId = asset.type === 'analysis' ? assetId : null;
            
            component.set('v.dashboardId', dashboardId);
            component.set('v.datasetId', datasetId);
            component.set('v.dataflowId', dataflowId);
            component.set('v.lensId', lensId);
            component.set('v.folderId', folderId);
            component.set('v.templateId', templateId);
            component.set('v.analysisId', analysisId);
            
            var context = {apiVersion: '46'};
            var camelTypeName = assetType.substring(0, 1).toUpperCase() + assetType.substring(1);
            
            // Special case for "stories"
            if (assetType === 'analysis') {
                camelTypeName = 'Story';
            }
            
            component.set('v.assetCamelType', camelTypeName);
            
            var assetProductName = self.productNameMap[assetType] || 'Analytics';
            component.set('v.assetProductName', assetProductName);

            var methodName = self.typeDetailsMethodMap[assetType];
            //console.warn('methodName: ', methodName);
            
            if (methodName === 'USE_PROXY') {
                
                var self = this;
                var proxy = component.find('proxy');
                
                //var url = asset.url;
                
                var url = null;
                
                if (asset.type === 'dataflow') {
    	            // Use the internal API to get the dataflow details
	                url = '/insights/internal_api/v1.0/esObject/workflow/' + asset.id + '/json';
                } else if (asset.type === 'analysis') {
                    url = asset.url;
                }
                
                //var url = 'https://adx-dev-ed.my.salesforce.com/insights/internal_api/v1.0/esObject/workflow/' + asset.id + '/json';
                
                var config = null;
                
                proxy.exec(url, 'GET', config, function(response) {
                    //console.warn('exec response.body: ', response.body);
                    let details = response.body || null;
                    if (callback !== null && typeof callback !== 'undefined') {
                        callback(null, details);
                    } else {
                        return null;
                    }            
                });                
                
                
            } else if (methodName) {                
                var methodParameters = {};
                methodParameters[assetType + 'Id'] = assetId;
                sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
                    if (err !== null) {
                        console.error(methodName + ' error: ', err);
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
            } else {
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(null, null);
                }
            }
        }
    }   
})