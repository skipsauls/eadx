({
    setup: function(component) {
        this.showDashboard(component);
        this.showOverlay(component);
        
    },
    
    showDashboard: function(component, dashboardId) {
        var dashboardId = component.get('v.dashboardId');
        if (typeof dashboardId !== 'undefined' && dashboardId !== null && dashboardId !== '') {
        	var height = component.get('v.height');
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
        }
    },
    
    showOverlay: function(component) {
        var overlayId = component.get('v.overlayId');
        if (typeof overlayId !== 'undefined' && overlayId !== null && overlayId !== '') {
            
            var height = component.get('v.height');
            
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
        }
    }
    
})