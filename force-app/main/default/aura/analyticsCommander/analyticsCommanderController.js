({
    showDashboard: function(component, event, helper) {
        var params = event.getParam('arguments');
        console.warn('analyticsCommanderController.showDashboard - params: ', params);
        if (params) {
            var name = params.name;
            var id = params.id;
            var config = params.config;
            var callback = params.callback;
            
            
            helper.showDashboard(component, name, id, config);
        }
    },
    
    execCommand: function(component, event, helper) {
        var params = event.getParam('arguments');
        console.warn('analyticsCommanderController.execCommand - params: ', params);
        if (params) {
            var command = params.command;
			var config = JSON.parse(command.config);
            var name = command.name;
            var type = command.type;
            
            console.warn('command: ', command);
            console.warn('config: ', config);
            console.warn('name: ', name);
            console.warn('type: ', type);
            
            if (name === 'showDashboard') {
	            helper.showDashboard(component, config);
            } else if (name === 'filterBy') {
	            helper.filterBy(component, config);                
            }
        }
    },
    
    execCommand2: function(component, event, helper) {
        var params = event.getParam('arguments');
        console.warn('analyticsCommanderController.execCommand2 - params: ', params);
        if (params) {
            var command = params.command;
			var config = JSON.parse(command.config);
            var name = command.name;
            var type = command.type;
            
            console.warn('command: ', command);
            console.warn('config: ', config);
            console.warn('name: ', name);
            console.warn('type: ', type);
            
			// Change to configurable attribute            
			var limit = 10;
            
            var action = component.get("c.commander");
            var self = this;
            
            action.setParams({commandPhrase: command.transcript, limitParam: limit.toString()});
            action.setCallback(this, function(response) {
                console.warn('execCommand2 response: ', response);
                var state = response.getState();
                console.warn('state: ', state);
                if (state === "SUCCESS") {
                    var val = response.getReturnValue();
                    console.warn('val: ', val);
                        
                } else if (state === "INCOMPLETE") {
                    // do something
                } else if (state === "ERROR") {
                    var err = response.getError();
                    console.error('error: ', err);
                }            
            });
            $A.enqueueAction(action);
            
        }
    }
    
    
})