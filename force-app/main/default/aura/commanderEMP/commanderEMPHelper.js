({
    setup: function(cmp) {
    	var subscribed = cmp.get('v.subscribed');
        console.warn('setup: ', subscribed);
        if (subscribed === true) {
            this.subscribe(cmp);
        } else {
            this.unsubscribe(cmp);
        }        
    },
    
    subscribe: function(component) {
        console.warn('commanderEMPHelper.subscribe');
        
        let empApi = component.find("empApi");
        let channel = '/event/Command__e';
        let replayId = -1;
        let self = this;
        
        let callback = function (message) {
            let command = JSON.parse(JSON.stringify(message.data.payload));
            let payload = JSON.parse(command.eadx__payload__c);
            
            let evtSim = {
                params: {
                    payload: payload
                },
                getParams: function() {
                    return this.params;
                },
                getParam: function(key) {
                    return this.params[key]
                }
            };
            self.fireActionableEvent(component, evtSim);
            
        }.bind(this);
        
        let errorHandler = function (message) {
            console.error("received error ", message);
        }.bind(this);
        
        empApi.onError(errorHandler);
        
        let sub = component.get('v.sub');
        if (sub !== null && typeof sub !== 'undefined') {
            empApi.unsubscribe(sub, function(resp) {
                empApi.subscribe(channel, replayId, callback).then(function(value) {
                    console.warn("subscribed to channel: ", channel);
                    sub = value;
                    component.set("v.sub", sub);
                });         
            });
        } else {
            console.warn('calling subscribe');
            empApi.subscribe(channel, replayId, callback).then(function(value) {
                console.warn("subscribed to channel: ", channel);
                sub = value;
                component.set("v.sub", sub);
            });         
        }        
    },
    
	unsubscribe: function(component) {
        console.warn('commanderEMPHelper.unsubscribe');
        let empApi = component.find("empApi");
        let sub = component.get('v.sub');
        if (sub !== null && typeof sub !== 'undefined') {
            empApi.unsubscribe(sub, function(resp) {
				component.set('v.sub', null);
            });
        }
    },
    
    setupEMP: function(component) {
        console.warn('commanderEMPHelper.setupEMP');
        let empApi = component.find("empApi");
        let channel = '/event/Command__e';
        let replayId = -1;
        let self = this;
        let callback = function (message) {
            console.warn('received: ', message.channel, message.data.event.replayId);
            console.warn('message.data.payload: ', message.data.payload);
            console.warn('json message.data.payload: ', JSON.stringify(message.data.payload, null, 2));
            let command = JSON.parse(JSON.stringify(message.data.payload));
            console.warn('command: ', command);
            let payload = JSON.parse(command.eadx__payload__c);
            console.warn('payload: ', payload);
            
            let evtSim = {
                params: {
                    payload: payload
                },
                getParams: function() {
                    return this.params;
                },
                getParam: function(key) {
                    return this.params[key]
                }
            };
            //let params = {payload: payload};      
            //helper.handleCommanderEvent(component, params);
            self.fireActionableEvent(component, evtSim);
            
        }.bind(this);
        
        var errorHandler = function (message) {
            console.error("received error ", message);
        }.bind(this);
        
        empApi.onError(errorHandler);
        
        var sub;
        console.warn('calling subscribe');
        empApi.subscribe(channel, replayId, callback).then(function(value) {
            console.warn("subscribed to channel: ", channel);
            sub = value;
            component.set("v.sub", sub);
        });         
    },
    
    fireActionableEvent: function(cmp, evt){
        let payload = evt.getParam('payload');
        let actionType = payload.action.type;
        let state = payload.response ? payload.response.state : null;
        if (state){
            cmp.set('v.commanderState', state);
        }
        let event = cmp.getEvent(actionType);
        if (event){
            switch(actionType){
                case "ViewSobjectType":
                    event.setParam('sobjects', 
                                   payload.response.sobjects);
                    break;
                case "ViewAnalyticsDashboard":
                    event.setParam('dashboards', 
                                   payload.response.items);
                    break;
                case "AnalyticsDashboardUpdatePage":
                    event.setParam('pages', 
                                   payload.response.items);
                    break;
                case "InvocableActionApex":
                    event.setParam('target', 
                                   payload.action.target);
                    event.setParam('actionResults', 
                                   payload.response.actionResults);
                    break;
            }
            event.fire();
        }
    }    
})