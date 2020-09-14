({
	getState : function(component, event, helper) {
        let d = component.find("mydashboard");
        let config = {};
        
        console.log( d.get("v.isLoaded"));
        d.getState(config, function(res, err) {
            console.log( 'function return' );
            if (err) {
                console.log(err);
            }
            if (res) {
                console.log( JSON.stringify(res.payload, null, 4) );
            }
        });
	}
})