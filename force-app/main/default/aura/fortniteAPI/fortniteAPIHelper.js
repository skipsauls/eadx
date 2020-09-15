({
	handleLookupAccountIdByUsername: function(component, event) {
		var params = event.getParam('arguments');
        var action = component.get("c.lookupAccountIdByUsername");
        action.setParams({
            username: params.username
        });
        var self = this;       
        action.setCallback(this, function(response) {
            var state = response.getState();
            console.warn('state: ', state);
            console.warn('response.getReturnValue(): ', response.getReturnValue());
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

	handleGetGlobalPlayerStats: function(component, event) {
		var params = event.getParam('arguments');
        var action = component.get("c.getGlobalPlayerStats");
        action.setParams({
            username: params.username
        });
        var self = this;       
        action.setCallback(this, function(response) {
            var state = response.getState();
            console.warn('state: ', state);
            console.warn('response.getReturnValue(): ', response.getReturnValue());
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

	handleGetRecentMatches: function(component, event) {
		var params = event.getParam('arguments');
        var action = component.get("c.getRecentMatches");
        action.setParams({
            username: params.username
        });
        var self = this;       
        action.setCallback(this, function(response) {
            var state = response.getState();
            console.warn('state: ', state);
            console.warn('response.getReturnValue(): ', response.getReturnValue());
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
    
	callAPI: function(component, event, methodName) {
		var params = event.getParam('arguments');
        console.warn('params: ', params);
        var actionName = 'c.' + methodName;
        var action = component.get(actionName);
        console.warn('action: ', action);
        action.setParams(params);
        var self = this;       
        action.setCallback(this, function(response) {
            var state = response.getState();
            console.warn('state: ', state);
            console.warn('response.getReturnValue(): ', response.getReturnValue());
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
    
})