({
	createUpdateEvent: function(component, event, helper) {
		let params = event.getParam('arguments');        
        console.warn('params: ', params);
		
        params.sdk_key = '1234567890';
        
        let evt = $A.get('e.c:eadlWaveUpdate');
        console.warn('evt: ', evt);
        
        for (var key in params) {
            if (params[key]) {
	            evt.setParam(key, params[key]);
            }
        }
        
        //evt.setParams(params);
        
        console.warn('firing event: ', evt);
        
        evt.fire();
        
        console.warn('done');
	}
})