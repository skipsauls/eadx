({
    handleProxyReady: function(component, event, helper) {
    },
    
    handleAssetChange: function(component, event, helper) {
        //console.warn('handleAssetChange');
        //

        var asset = component.get('v.asset');
        component.set('v.assetDetails', asset);
        var json = JSON.stringify(asset, null, 4);
        component.set('v.json', json);
        
        var assetType = component.get('v.assetType');
        var camelTypeName = assetType.substring(0, 1).toUpperCase() + assetType.substring(1);
        
        // Special case for "stories"
        if (assetType === 'analysis') {
            camelTypeName = 'Story';
        }
        
        component.set('v.assetCamelType', camelTypeName);        
        
        return;
        
        helper.getAssetDetails(component, function(err, assetDetails) {
            if (assetDetails !== null && typeof assetDetails !== 'undefined') {
                var json = JSON.stringify(assetDetails, null, 4);
                component.set('v.json', json);
                component.set('v.assetDetails', assetDetails);
                //console.warn('assetDetails: ', assetDetails);
                
            } else {
                var asset = component.get('v.asset');
                component.set('v.assetDetails', asset);
                var json = JSON.stringify(asset, null, 4);
                component.set('v.json', json);
            }
        });
    },
    
    handleUpload: function(component, event, helper) {
        component.set('v.toolbarAction', 'upload');
    }
    
})