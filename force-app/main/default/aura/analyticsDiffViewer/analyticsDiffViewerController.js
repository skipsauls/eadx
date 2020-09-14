({
	handleAssetChange: function(component, event, helper) {
        console.warn('handleAssetChange:');
        helper.getAssetDetails(component, function(err, assetDetails) {
            console.warn('assetDetails: ', assetDetails);

            //var json = JSON.stringify(assetDetails, null, 4);
            //component.set('v.json', json);
            component.set('v.assetDetails', assetDetails);
            
            var type = null;
            type = assetDetails.type === 'dashboard' ? 'dashboards' : type;
            type = assetDetails.type === 'dataset' ? 'datasets' : type;
            type = assetDetails.type === 'lens' ? 'lenses' : type;
            
            console.warn('asset type: ', type);
            
            helper.getVersions(component, type, assetDetails.id, function(err, versions) {
                console.warn('versions: ', versions);
                component.set('v.versions', versions);
            });
        });
	},
    
    handleVersionIdChange: function(component, event, helper) {
        var asset = component.get('v.asset');
        var assetDetails = component.get('v.assetDetails');
        var versionId = component.get('v.versionId');
        console.warn('versionId: ', versionId);
        if (versionId !== null && typeof versionId !== 'undefined'  && versionId !== '') {
            if (versionId === 'CURRENT') {
                component.set('v.version', assetDetails);
                var assetJSON = JSON.stringify(assetDetails, null, 2);
                component.set('v.versionJSON', assetJSON);
            } else {
                var type = null;
                type = assetDetails.type === 'dashboard' ? 'dashboards' : type;
                type = assetDetails.type === 'dataset' ? 'datasets' : type;
                type = assetDetails.type === 'lens' ? 'lenses' : type;
                
            	console.warn('asset type: ', type);
                
                helper.getVersion(component, type, assetDetails.id, versionId, function(err, version) {
                    console.warn('getVersion returned: ', err, version);
	                var versionJSON = JSON.stringify(version, null, 2);
    	            component.set('v.versionJSON', versionJSON);                    
                });
            } 
        }
    },
})