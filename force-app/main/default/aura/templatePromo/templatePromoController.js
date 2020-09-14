({
    doInit: function(component, event, helper) {
        helper.setup(component);
    },
    
    handleMenuSelect: function(component, event, helper) {
        var value = event.getParam("value");
        if (value === 'install') {
	        helper.installApp(component);            
        } else if (value === 'ugrade') {
        	helper.upgradeApp(component);           
        } else if (value === 'remove') {
	        helper.removeApp(component);            
        } else if (value === 'open') {
            var assetSharingUrl = component.get('v.assetSharingUrl');
            if (assetSharingUrl !== null && typeof assetSharingUrl !== 'undefined') {
                window.open(assetSharingUrl, '_blank');
            }            
        }
    },
    
    handleInstallApp: function(component, event, helper) {
        helper.installApp(component);
    },
    
    handleUpgradeApp: function(component, event, helper) {
        helper.upgradeApp(component);
    },

    handleRemoveApp: function(component, event, helper) {
        helper.removeApp(component);
    },
    
    handleOpenApp: function(component, event, helper) {
        var assetSharingUrl = component.get('v.assetSharingUrl');
        if (assetSharingUrl !== null && typeof assetSharingUrl !== 'undefined') {
            window.open(assetSharingUrl, '_blank');
        }
    }
})