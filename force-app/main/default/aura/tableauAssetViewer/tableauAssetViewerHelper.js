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