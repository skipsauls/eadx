({
    doInit: function(component, event, helper) {
        
        var empApi = component.find("empApi");
        console.warn('empApi: ', empApi);
        var channel = '/event/WaveAssetEvent';
        var replayId = -1;
        
        var callback = function (message) {
            var t2 = Date.now();
            var t1 = component.get('v.timestamp');
            if (message.channel === '/event/WaveAssetEvent') {
                if (message.data && message.data.payload) {
                    var payload = message.data.payload;
                    //console.warn('payload: ', payload, JSON.stringify(payload, null, 2));                    
                    if (payload.EventType === 'ExternalData' && payload.FolderId === 'Demo_App' && payload.ItemName === 'fortnite_players') {
	                    //console.warn('Relevant payload: ', payload);
                        if (payload.Status === 'Success') {
                            //console.warn('success!!!!');
                            //console.warn('now fire Lightning events, etc. to show updated dataset');
                            //console.warn('timing: ', (t2 - t1) + ' ms');
                            helper.fireUpdate(component, true);
                        }
                    }
                }
            }
        }.bind(this);
        
        var errorHandler = function (message) {
            console.error("Received error ", message);
        }.bind(this);
        
        empApi.onError(errorHandler);
        
        var sub = null;
        empApi.subscribe(channel, replayId, callback).then(function(value) {
            //console.log("Subscribed to channel " + channel);
            sub = value;
            component.set("v.sub", sub);
        });
    },

    handlePlayerDataUpdated: function(component, event, helper) {
        helper.loadFortnitePlayers(component);
    },
    
    handleGetFortnitePlayers: function(component, event, helper) {
        var action = component.get("c.getFortnitePlayers");
        action.setParams({
        });
        var self = this;
        action.setCallback(this, function(response) {
            var state = response.getState();
            console.warn('state: ', state);
            if (state === "SUCCESS") {
                var players = response.getReturnValue();
                console.warn('players: ', players);
            }
            else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.error("Error message: " + errors[0].message);
                    }
                } else {
                    console.error("Unknown error");
                }
            }            
        });
        $A.enqueueAction(action);			
    },
    
    handleGetFortnitePlayersCsv: function(component, event, helper) {
        var action = component.get("c.getFortnitePlayersCsv");
        action.setParams({
        });
        var self = this;
        action.setCallback(this, function(response) {
            var state = response.getState();
            console.warn('state: ', state);
            if (state === "SUCCESS") {
                var val = response.getReturnValue();
                console.warn('val: ', val);
                
                var csv = val.csv;
                console.warn('csv: ', csv);
                
                console.warn('val.schema: ', val.schema);
                
                var schema = JSON.parse(val.schema);
                console.warn('schema: ', schema);
            }
            else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.error("Error message: " + errors[0].message);
                    }
                } else {
                    console.error("Unknown error");
                }
            }            
        });
        $A.enqueueAction(action);			
    },
    
    handleLoadFortnitePlayers: function(component, event, helper) {
        helper.loadFortnitePlayers(component);
    },
    
    test: function(component, event, helper) {
        var action = component.get("c.testLoad");
        action.setParams({
        });
        var self = this;
        action.setCallback(this, function(response) {
            var state = response.getState();
            console.warn('state: ', state);
            if (state === "SUCCESS") {
                var val = response.getReturnValue();
                console.warn('val: ', val);
                var obj = JSON.parse(val);
                console.warn('obj: ', obj);
            }
            else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.error("Error message: " + errors[0].message);
                    }
                } else {
                    console.error("Unknown error");
                }
            }            
        });
        $A.enqueueAction(action);			
    }
    
})