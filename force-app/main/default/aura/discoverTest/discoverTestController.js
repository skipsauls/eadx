({
    handleDiscoverClicked: function(component, event, helper) {
		console.warn('handleDiscoverClicked');
        var evt = $A.get('e.wave:discover');
        var params = {
            UID: 'Test_' + Date.now()
        };
        evt.setParams(params);
        evt.fire();        
    },
    
    handleDiscoverResponse: function(component, event, helper) {
        var params = event.getParams();
        console.warn('handleDiscoverReponse: ', JSON.parse(JSON.stringify(params)));
        helper.describeDashboard(component, params.id, function(err, dashboard) {
            if (err) {
                console.error('describeDashboard error: ', error);
            } else {                
	            console.warn('describeDashboard returned: ', JSON.parse(JSON.stringify(dashboard))); 
            }
        });
    },
    
    handleSelectionChanged: function(component, event, helper) {
        var params = event.getParams();
        console.warn('handleSelectionChanged: ', JSON.parse(JSON.stringify(params)));    
    }
    
    
})