({
    handleDashboardIdChange: function(component, event, helper) {
        helper.showDashboard(component);
	},
    
    handleOverlayIdChange: function(component, event, helper) {
        helper.showOverlay(component);
	},

    handleToggleOverlay: function(component, event, helper) {
        var showOverlay = component.get('v.showOverlay');
        var overlay = component.find('overlay');
        var overlayTint = component.find('overlay-tint');
        if (showOverlay === true) {
            $A.util.addClass(overlay, "opacity25");
            $A.util.removeClass(overlayTint, "hide");
            $A.util.removeClass(overlay, "hide");
        } else {            
            $A.util.addClass(overlay, "hide");
            $A.util.addClass(overlayTint, "hide");
            $A.util.removeClass(overlay, "opacity25");
        }
	}
})