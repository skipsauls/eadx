({
    showDashboard: function(component, dashboardId) {
        var config = {
            dashboardId: dashboardId,
            height: height,
            openLinksInNewWindow: true,
            showHeader: false,
            showTitle: false,
            showSharing: false
        };
        $A.createComponent("wave:waveDashboard", config, function(cmp, msg, err) {
            var dashboard = component.find("dashboard");
            if (err) {
                console.warn("error: ", err);
            } else {
                dashboard.set("v.body", [cmp]);
            }            
        }); 		
    },

    showOverlay: function(component, overlayId) {
        var config = {
            dashboardId: overlayId,
            height: height,
            openLinksInNewWindow: true,
            showHeader: false,
            showTitle: false,
            showSharing: false
        };
        $A.createComponent("wave:waveDashboard", config, function(cmp, msg, err) {
            var overlay = component.find("overlay");
            if (err) {
                console.warn("error: ", err);
            } else {
                overlay.set("v.body", [cmp]);
            }            
        }); 		
    },
    
    
})