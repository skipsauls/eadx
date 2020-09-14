({
	handleSubscribe: function(component, event, helper) {
        
        const empApi = component.find('empApi');
        
		let topic = component.get('v.topic');
        
        let callback = function (message) {
            let json = JSON.stringify(message, null, 2);
            console.warn('message: ', json);
        }
        
        const replayId = -1;
            
        console.warn('calling subscribe: ', topic, replayId, callback);
        empApi.subscribe(topic, replayId, callback).then(function(value) {
            console.warn('subscribe returned: ', value);
         	component.set('v.subscription', value); 
        }).finally(function(value) {
            console.warn('finally: ', value);
        });
	}
})