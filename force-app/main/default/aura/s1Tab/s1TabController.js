({
    selectDashboard: function(component) {
        
        var self = this;
        
        var dashboardId = component.get("v.dashboardId");
        
        var config = {
            dashboardId: dashboardId,
            height: "800",
            openLinksInNewWindow: false,
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
})