({
    handleAssetChange: function(component, event, helper) {
        console.warn('handleAssetChange');

        //var json = JSON.stringify(asset, null, 4);
        //component.set('v.json', json);

        //return;

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
            
            helper.getHistory(component, function(err, assetHistory) {
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
                    component.set('v.assetHistoryColumns', helper.assetHistoryColumns);
                    component.set('v.assetHistory', assetHistory);
                    component.set('v.assetHistoryData', assetHistoryData);
                } else {
                    component.set('v.assetHistory', null);
                }
            });
                
        });
    },
    
    handlePreviewVersion: function(component, event, helper) {
    	var assetId = component.get('v.selectedAssetHistoryId');
        var assetHistory = component.get('v.assetHistory');
        var selectedHistory = null;
        assetHistory.forEach(function(history) {
            if (history.id === assetId) {
				selectedHistory = history;
            } 
        });
        if (selectedHistory !== null && typeof selectedHistory !== 'undefined') {
            helper.doPreview(component, selectedHistory);
        }
    },
    
    handleAssetHistoryRowAction: function(component, event, helper) {
        var action = event.getParam('action');
        //console.warn('action: ', action);
        var row = event.getParam('row');
        //console.warn('row: ', row);
        
        switch (action.name) {
            case 'preview':
                helper.doPreview(component, row);
                break;

            case 'revert':
                helper.doRevert(component, row);
                break;

            case 'delete':
                helper.doDelete(component, row);
                break;
                
            default:
                break;
        }
    }
})