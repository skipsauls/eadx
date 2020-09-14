({
    loadDashboard: function(component) {
        let developerName = component.get('v.developerNameB');
        let dashboard = component.find("dashboard_old");
        let height = component.get('v.height');
        let config = {
            developerName: developerName,
            height: height,
            showSharing: false,
            showHeader: false,
            showTitle: false
        };
        $A.createComponent("wave:waveDashboard", config, function(cmp, msg, err) {
            if (err) {
                console.warn("error: ", err);
            } else {
                dashboard.set("v.body", [cmp]);
            }            
        });                
    },
    
    listAssets: function(component, methodName, callback) {
        var sdk = component.find("sdk");
        
        var context = {apiVersion: "43"};
        var methodName = methodName;
        var methodParameters = {
        };
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            if (err !== null) {
                console.error("listAssets error: ", err);
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(err, null);
                } else {
                    return err;
                }
            } else {
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(null, data);
                } else {
                    return data;
                }
            }
        }));		
    },
    
    listDashboards: function(component, callback) {
        this.listAssets(component, "listDashboards", function(err, data) {
            callback(err, data ? data.dashboards : null); 
        });
    },
    
	determineReadiness: function(component) {
        let self = this;
        let ready = component.get('v.ready');
        if (ready === false) {
            
	        let evt = $A.get('e.wave:discover');
			evt.setParam('UID', Date.now());
			evt.fire();
            
            setTimeout(function() {
                self.determineReadiness(component);
            }, 500);
            
        }
	}
})