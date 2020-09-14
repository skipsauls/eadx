({
    getAssetDetails: function(component, callback) {        
        var sdk = component.find('sdk');
        
        var asset = component.get('v.asset');
        if (asset === null || typeof asset === 'undefined') {
            callback(null, null);
        } else {
            console.warn('asset: ', JSON.stringify(asset, null, 2));
            var assetType = asset.type;
            var assetId = asset.id;
            
            var dashboardId = asset.type === 'dashboard' ? assetId : null;
            var datasetId = asset.type === 'dataset' ? assetId : null;
            var lensId = asset.type === 'lens' ? assetId : null;
            
            component.set('v.dashboardId', dashboardId);
            component.set('v.datasetId', datasetId);
            component.set('v.lensId', lensId);
            
            var context = {apiVersion: '42'};
            var camelTypeName = assetType.substring(0, 1).toUpperCase() + assetType.substring(1);
            component.set('v.assetCamelType', camelTypeName);
            
            var methodName = 'describe' + camelTypeName;
            var methodParameters = {};
            methodParameters[assetType + 'Id'] = assetId;
            sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
                if (err !== null) {
                    console.error('listAssets error: ', err);
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
        }
    },
    
    getVersions: function(component, type, id, callback) {
        console.warn('getVersions:', type, id);
                
        var proxy = component.find('proxy');
        var self = this;
        var url = '/services/data/v43.0/wave/' + type + '/' + id + '/versions';
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

    getVersion: function(component, type, id, versionId, callback) {
        console.warn('getVersion:', type, id, versionId);
                
        var proxy = component.find('proxy');
        var self = this;
        var url = '/services/data/v43.0/wave/' + type + '/' + id + '/versions/' + versionId;
        var method = 'GET';
        
        console.warn('url: ', url);
        
        var body = null;
        
        proxy.exec(url, method, body, function(response) {
            console.warn('response: ', response);
            response = JSON.parse(JSON.stringify(response));
            console.warn('JSON response: ', response);
            if (response && response.body) {
                if (typeof callback === 'function') {
                    callback(null, response.body);
                }
            }
        });
    }
    
})