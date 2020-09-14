({
    selectDashboard: function(component) {
        
        var self = this;
        
        var dashboardId = component.get("v.dashboardId");
        console.warn('selectDashboard: ', dashboardId);
        
        var outer = component.find("dashboard-outer");
        console.warn("outer: ", outer, outer.getElement());
        $A.util.removeClass(outer, "fadein");
        $A.util.addClass(outer, "fadeout");
        var config = {
            dashboardId: dashboardId,
            height: 800,
            openLinksInNewWindow: true,
            showHeader: false,
            showTitle: false,
            showSharing: false
        };
        console.warn('config: ', config);
        $A.createComponent("wave:waveDashboard", config, function(cmp, msg, err) {
            var dashboard = component.find("dashboard");
            if (err) {
                console.warn("error: ", err);
            } else {
                $A.util.addClass(cmp, "dashboard-container");
                //$A.util.addClass(outer, "hidden");
                dashboard.set("v.body", [cmp]);
                setTimeout($A.getCallback(function() {
                    //$A.util.removeClass(outer, "hidden");
                    $A.util.removeClass(outer, "fadeout");
                    $A.util.addClass(outer, "fadein");
                }), 500);
            }            
        });
    }

})