({
	setupSubscriptions: function(component) {
        var empApi = component.find("empApi");
        var channel = '/event/eadx__EinsteinAnalyticsEvent__e';
        var replayId = -1;
        var callback = function (message) {
            console.warn('received: ', message.channel, message.data.event.replayId);
            console.warn('message.data.payload: ', message.data.payload);
            console.warn('json message.data.payload: ', JSON.stringify(message.data.payload, null, 2));
  
            if (message.data.payload.eadx__type__c == 'command') {
               	let payload = JSON.parse(message.data.payload.eadx__payload__c);
                console.warn('payload: ', payload);
                var phrase = payload.phrase;
                console.warn('phrase: ', phrase);
                component.set('v.phrase', phrase);
            }
  
        }.bind(this);
        
        var errorHandler = function (message) {
            console.error("received error ", message);
        }.bind(this);
        
        empApi.onError(errorHandler);
        
        var sub;
        empApi.subscribe(channel, replayId, callback).then(function(value) {
            console.warn("subscribed to channel: ", channel);
            sub = value;
            component.set("v.sub", sub);
        });  		
	}
})