({
    init: function(component, event, helper) {
        
        component.set('v.assetHistoryColumns', helper.assetHistoryColumns);
        
        component.set('v.assetId', null);
        component.set('v.assetType', null);
        component.set('v.asset', null);
        
        let analyticsTree = component.find('analytics_tree');
        
        analyticsTree.refresh(function(msg) {
        });		
    },

    handleAssetChange: function(component, event, helper) {
		helper.doRefresh(component);
    },
    
    handleRowAction: function(component, event, helper) {
        var action = event.getParam('action');
        var row = event.getParam('row');
        
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
    },

    handleRowSelection: function(component, event, helper) {
		let selectedRows = event.getParam('selectedRows');
		component.set('v.selectedRows', selectedRows);        
    },
    
    handleDiff: function(component, event, helper) {
        let selectedRows = component.get('v.selectedRows');
        let versionA = selectedRows[0];
        let versionB = selectedRows[1];
        
        component.set('v.versionA', versionA);
        component.set('v.versionB', versionB);
        
        helper.getVersionDetails(component, versionA, function(err, details) {
            component.set('v.versionDetailsA', details);
            let json = JSON.stringify(details, null, 2);
            component.set('v.versionJsonA', json);
            
            helper.getVersionDetails(component, versionB, function(err, details) {
                component.set('v.versionDetailsB', details);
                let json = JSON.stringify(details, null, 2);
                component.set('v.versionJsonB', json);
            });
        });
        
    }
})