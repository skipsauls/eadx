({
    updateDashboard: function(cmp) {
        var dashboardId = cmp.get('v.dashboardId');
        
        var outer = cmp.find('dashboard-outer');
        $A.util.removeClass(outer, "fadein");
        $A.util.addClass(outer, "fadeout");
        if (dashboardId){
            var config = {
                dashboardId: dashboardId,
                height: "2048",
                openLinksInNewWindow: false,
                showHeader: false,
                showTitle: false,
                showSharing: false
            };
            $A.createComponent("wave:waveDashboard", config, function(dashboardCmp, msg, err) {
                var dashboardDiv = cmp.find("dashboard-div");
                if (err) {
                    $A.log("error: ", err);
                } else {
                    $A.util.addClass(dashboardCmp, "dashboard-container");
                    dashboardDiv.set("v.body", [dashboardCmp]);
                    setTimeout($A.getCallback(function() {
                        $A.util.removeClass(outer, "fadeout");
                        $A.util.addClass(outer, "fadein");
                    }), 500);
                }
            });
        } else{
            var dashboardDiv = cmp.find("dashboard-div");            
            dashboardDiv.set("v.body", []);
        }
    },
    updatePage: function(cmp) {
        var updatedPageId = cmp.get('v.pageId');
        if (updatedPageId){            
            var event = $A.get('e.wave:pageChange');
            var params = {
                devName: cmp.get('v.dashboardId'),
                pageid: updatedPageId
            };
            event.setParams(params);
            event.fire();
        }
    }, 
    updateFilters: function(cmp){
        var event = $A.get('e.wave:update');
        var params = {
            value: cmp.get('v.filters'),
            id: cmp.get('v.dashboardId'),
            type: 'dashboard'
        };
        event.setParams(params);
        event.fire();
    }
})