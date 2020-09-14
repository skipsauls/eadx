({
    
    showDashboard: function(component) {
        
        var self = this;
        
        var dashboardId = component.get('v.dashboardId');
        
        var outer = component.find("dashboard-outer");
        $A.util.removeClass(outer, "fadein");
        $A.util.addClass(outer, "fadeout");
        
        var config = {
            dashboardId: dashboardId,
            height: "250",
            openLinksInNewWindow: true,
            showHeader: false,
            showTitle: false,
            showSharing: false
        };
        //console.warn('config: ', config);
        
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
    },
    
    // Forces dashboard to redraw
    updateSelection: function(component, init, target) {
        // Use A/B switching
        var fieldSwitch = component.get("v.fieldSwitch");
        var values = null;
        if (fieldSwitch === 'A') {
			values = [component.get("v.fieldValue")];
            fieldSwitch = 'B';
        } else {
            values = [null];
            fieldSwitch = 'A';
        }
        component.set("v.fieldSwitch", fieldSwitch);
        
        //console.warn('values: ', values);

        var self = this;
        var selection = {
            datasets: {}
		};
 
        
 		selection.datasets[component.get("v.datasetName")] = [
	    	{
        		fields: [component.get('v.fieldName')],
        		selection: values
    		}
		];
    	

        //console.warn('selection: ', selection);
        
		var json = JSON.stringify(selection);
        
        //console.warn('json: ', json);
        
        var dashboardId = target;
        var evt = $A.get('e.wave:update');
        var params = {
            value: json,
            id: dashboardId,
            type: "dashboard"
        };
        evt.setParams(params);
        evt.fire();

    },
    
	updateQuery: function(component, saql, callback) {
        var self = this;
        
		var queryName = component.get('v.queryName');
        var action = component.get("c.updateQuery");
        
        action.setParams({queryName: queryName, saql: saql});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var id = response.getReturnValue();
                //console.warn('update id: ', id);
                if (typeof callback === 'function') {
                    callback(null, id);
                }
                
            } else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var err = response.getError();
                console.error('error: ', err);
                if (typeof callback === 'function') {
                    callback(err, null);
                }
            }            
        });
        $A.enqueueAction(action); 		
		
	}    
})