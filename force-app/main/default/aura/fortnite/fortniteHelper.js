({
    getPlayers: function (component, event) {
		var params = event.getParam('arguments');
        var action = component.get("c.getPlayers");
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
                var err = null;
                if (obj.error === true) {
                    err = obj;
                    obj = null;
                }
                if (typeof params.callback === 'function') {
                    params.callback(err, obj);
                }
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
                if (typeof params.callback === 'function') {
                    params.callback({errors: errors}, null);
                }
            }            
        });
        $A.enqueueAction(action);         
    },
    
    getPlayerInfo: function (component, event) {
		var params = event.getParam('arguments');
        var action = component.get("c.getPlayerInfo");
        action.setParams({
            username: params.username,
            refresh: params.refresh
        });
        var self = this;       
        action.setCallback(this, function(response) {
            var state = response.getState();
            console.warn('state: ', state);
            if (state === "SUCCESS") {
                var val = response.getReturnValue();
                var obj = JSON.parse(val);
                var err = null;
                if (obj.error === true) {
                    err = obj;
                    obj = null;
                }
                if (typeof params.callback === 'function') {
                    params.callback(err, obj);
                }
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
                if (typeof params.callback === 'function') {
                    params.callback({errors: errors}, null);
                }
            }            
        });
        $A.enqueueAction(action);         
    },

    getPlayerInfo2: function (component, event) {
		var params = event.getParam('arguments');
        var action = component.get("c.getPlayerInfo2");
        action.setParams({
            username: params.username,
            refresh: params.refresh
        });
        var self = this;       
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var val = response.getReturnValue();
                var obj = JSON.parse(val);
                var err = null;
                if (obj.error === true) {
                    err = obj;
                    obj = null;
                }
                if (typeof params.callback === 'function') {
                    params.callback(err, obj);
                }
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
                if (typeof params.callback === 'function') {
                    params.callback({errors: errors}, null);
                }
            }            
        });
        $A.enqueueAction(action);         
    },

    getPlayerInfo3: function (component, event) {
		var params = event.getParam('arguments');
        var action = component.get("c.getPlayerInfo3");
        action.setParams({
            username: params.username,
            refresh: params.refresh
        });
        var self = this;       
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var val = response.getReturnValue();
                var obj = JSON.parse(val);
                var err = null;
                if (obj.error === true) {
                    err = obj;
                    obj = null;
                }
                if (typeof params.callback === 'function') {
                    params.callback(err, obj);
                }
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
                if (typeof params.callback === 'function') {
                    params.callback({errors: errors}, null);
                }
            }            
        });
        $A.enqueueAction(action);         
    },
    
    getPlayerData: function(component, event) {
		var params = event.getParam('arguments');
        var action = component.get("c.getPlayerData");
        action.setParams({
            userId: params.userId,
            platform: params.platform,
            window: params.window,
            refresh: params.refresh
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            console.warn('state: ', state);
            if (state === "SUCCESS") {
                var val = response.getReturnValue();
                console.warn('val: ', val);
                var obj = JSON.parse(val);
                console.warn('obj: ', obj);
                if (typeof params.callback === 'function') {
                    params.callback(null, obj);
                }
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
                if (typeof params.callback === 'function') {
                    params.callback({errors: errors}, null);
                }                
            }            
        });
        $A.enqueueAction(action);         
    },

    getPlayerData2: function(component, event) {
		var params = event.getParam('arguments');
        var action = component.get("c.getPlayerData2");
        action.setParams({
            username: params.username,
            platform: params.platform,
            window: params.window,
            refresh: params.refresh
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            console.warn('state: ', state);
            if (state === "SUCCESS") {
                var val = response.getReturnValue();
                console.warn('val: ', val);
                var obj = JSON.parse(val);
                console.warn('obj: ', obj);
                if (typeof params.callback === 'function') {
                    params.callback(null, obj);
                }
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
                if (typeof params.callback === 'function') {
                    params.callback({errors: errors}, null);
                }                
            }            
        });
        $A.enqueueAction(action);         
    },

    getPlayerData3: function(component, event) {
		var params = event.getParam('arguments');
        var action = component.get("c.getPlayerData3");
        action.setParams({
            username: params.username,
            platform: params.platform,
            window: params.window,
            refresh: params.refresh
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            console.warn('state: ', state);
            if (state === "SUCCESS") {
                var val = response.getReturnValue();
                console.warn('val: ', val);
                var obj = JSON.parse(val);
                console.warn('obj: ', obj);
                if (typeof params.callback === 'function') {
                    params.callback(null, obj);
                }
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
                if (typeof params.callback === 'function') {
                    params.callback({errors: errors}, null);
                }                
            }            
        });
        $A.enqueueAction(action);         
    },

	getStore: function (component, event) {
		var params = event.getParam('arguments');
        var action = component.get("c.getStore");
        action.setParams({
            refresh: params.refresh
        });
        var self = this;
        action.setCallback(this, function(response) {
            var state = response.getState();
            //console.warn('state: ', state);
            if (state === "SUCCESS") {
                var val = response.getReturnValue();
                //console.warn('val: ', val);
                var obj = JSON.parse(val);
                //console.warn('obj: ', obj);
                if (typeof params.callback === 'function') {
                    params.callback(null, obj);
                }
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
                if (typeof params.callback === 'function') {
                    params.callback({errors: errors}, null);
                }                
            }            
        });
        $A.enqueueAction(action);         
    }    
})