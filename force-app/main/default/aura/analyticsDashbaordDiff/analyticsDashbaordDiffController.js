({
    handleDashboardIdChange: function(component, event, helper) {
        var dashboardId = component.get('v.dashboardId');
        if (typeof dashboardId !== 'undefined' && dashboardId !== null && dashboardId !== '') {
	        helper.showDashboard(component, dashboardId);
        }
	},
    
    handleOverlayIdChange: function(component, event, helper) {
        var showOverlay = component.get('v.showOverlay');
        if (showOverlay === true) {
            var overlayId = component.get('v.versionId');
            if (typeof overlayId !== 'undefined' && overlayId !== null && overlayId !== '') {
                helper.showOverlay(component, overlayId);
            }
        }
	},

    handleToggleOverlay: function(component, event, helper) {
        var showOverlay = component.get('v.showOverlay');
        var overlay = component.find('overlay');
        if (showOverlay === true) {
            $A.util.addClass(overlay, "overlay25");
        } else {            
            $A.util.removeClass(overlay, "overlay25");
        }
	}
})