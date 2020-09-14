({
    loadDashboard: function(component) {
        let developerName = component.get('v.developerName');
        let dashboard = component.find("dashboard_old");
        let config = {
            developerName: developerName,
            height: "700"
        };
        $A.createComponent("wave:waveDashboard", config, function(cmp, msg, err) {
            if (err) {
                console.warn("error: ", err);
            } else {
                dashboard.set("v.body", [cmp]);
            }            
        });                
    },
    
	determineReadiness: function(component) {
        let self = this;
        let ready = component.get('v.ready');
        console.warn('ready: ', ready);
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