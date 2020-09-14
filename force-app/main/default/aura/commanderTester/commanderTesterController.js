({
	init: function(component, event, helper) {
        console.warn('config: ', JSON.stringify(helper.config, null, 2));
        component.set('v.config', JSON.stringify(helper.config, null, 2));
        component.set('v.config2', JSON.stringify(helper.config2, null, 2));

        component.set('v.commands', helper.commands);
        component.set('v.command', helper.commands[0]);

    },
    
	handleCommandChange: function(component, event, helper) {
		var commandIndex = component.get('v.commandIndex');
        var commands = component.get('v.commands');
        var command = commands[commandIndex];
        if (typeof command.config !== 'string') {
	        command.config = JSON.stringify(command.config, null, 2);        
        }
        component.set('v.command', command);
    },
    
    cloneCommand: function(component, event, helper) {
        var commands = component.get('v.commands');
		var command = component.get('v.command');

        var command2 = {
            name: command.name,
            label: command.label,
            type: command.type,
            config: command.config
        };

		commands.push(command2);
        
        component.set('v.commands', commands);
        component.set('v.commandIndex', commands.length - 1);
        
    },

    newCommand: function(component, event, helper) {
        var commands = component.get('v.commands');
		var command = component.get('v.command');

        var command2 = {
            name: 'changeMe',
            label: 'Change Me',
            type: '',
            config: {}
        };

		commands.push(command2);
        
        component.set('v.commands', commands);
        component.set('v.commandIndex', commands.length - 1);
        
    },
   
    execCommand: function(component, event, helper) {        
        var command = component.get('v.command');
        console.warn('execCommand: ', command);

        var commander = component.find('commander');
        commander.execCommand(command.name, command.config, null, function(resp) {
            console.warn('execCommand response: ', resp);
            var analyticsCommander = component.find('analyticsCommander');
            analyticsCommander.execCommand(command, function(ret) {
                console.warn('analyticsCommander.execCommand returned: ', ret);
            });
            
        });
        
    },
    
    execCommand2: function(component, event, helper) {        
        var command = component.get('v.command');
        console.warn('execCommand2: ', command);

        var commander = component.find('commander');
        commander.execCommand2(command.name, command.config, null, function(resp) {
            console.warn('execCommand2 response: ', resp);
            var analyticsCommander = component.find('analyticsCommander');
            analyticsCommander.execCommand2(command, function(ret) {
                console.warn('analyticsCommander.execCommand2 returned: ', ret);
            });
            
        });
        
    },
    
    remoteTest: function(component, event, helper) {
        var commander = component.find('commander');
        
        var name = component.get('v.name');
        var config = component.get('v.config');
        var uid = component.get('v.uid');
        commander.execCommand(name, config, uid, function(resp) {
            console.warn('resp: ', resp, JSON.parse(JSON.stringify(resp)));
            var command = JSON.parse(JSON.stringify(resp));
            if (command.name === 'showDashboard') {
                var analyticsCommander = component.find('analyticsCommander');
                var cmpConfig = JSON.parse(resp.config);
                analyticsCommander.showDashboard(cmpConfig, function(ret) {
                    
                });
            }
            
        });
    },

	remoteTest2: function(component, event, helper) {
        var commander = component.find('commander');
        
        var name = component.get('v.name');
        var config = component.get('v.config2');
        var uid = component.get('v.uid');
        commander.execCommand(name, config, uid, function(resp) {
            console.warn('resp: ', resp, JSON.parse(JSON.stringify(resp)));
            var command = JSON.parse(JSON.stringify(resp));
            if (command.name === 'showDashboard') {
                var analyticsCommander = component.find('analyticsCommander');
                var cmpConfig = JSON.parse(resp.config);
                analyticsCommander.showDashboard(cmpConfig, function(ret) {
                    
                });
            }
            
        });
    },

    remoteTest3: function(component, event, helper) {        
        var config = component.get('v.config');
        
        config = JSON.parse(config);
        
        console.warn('config: ', config);
        
        var filter = JSON.stringify(helper.filter);
        
        console.warn('filter: ', filter);
        
        var params = {
            value: filter,
            id: config.dashboardId,
            type: "dashboard"
        };
        console.warn('params: ', params);
        var evt = $A.get('e.wave:update');
        evt.setParams(params);
        evt.fire();        
    },
    
    localTest: function(component, event, helper) {
        var commander = component.find('commander');
        
        var name = component.get('v.name');
        var config = component.get('v.config');
        var uid = component.get('v.uid');
        var analyticsCommander = component.find('analyticsCommander');
        var cmpConfig = JSON.parse(config);
        analyticsCommander.showDashboard(cmpConfig, function(ret) {
                    
        });
    },
    
    localTest2: function(component, event, helper) {
        var commander = component.find('commander');
        
        var name = component.get('v.name');
        var config = component.get('v.config2');
        var uid = component.get('v.uid');
        var analyticsCommander = component.find('analyticsCommander');
        var cmpConfig = JSON.parse(config);
        analyticsCommander.showDashboard(cmpConfig, function(ret) {
                    
        });
    },

    localTest3: function(component, event, helper) {        
        var config = component.get('v.config');
        
        config = JSON.parse(config);
        
        console.warn('config: ', config);
        
        var filter = JSON.stringify(helper.filter);
        
        console.warn('filter: ', filter);
        
        var params = {
            value: filter,
            id: config.dashboardId,
            type: "dashboard"
        };
        console.warn('params: ', params);
        var evt = $A.get('e.wave:update');
        evt.setParams(params);
        evt.fire();        
    },
    
    handleFlowStatusChange: function(component, event, helper) {
        console.warn('commanderTesterController.handleFlowStatusChange');        
        var params = event.getParams();
        console.warn('params: ', JSON.stringify(params, null, 2));
        console.warn('params: ', JSON.parse(JSON.stringify(params)));
        if (params && params.status === 'FINISHED' && params.outputVariables) {
            params.outputVariables.forEach(function(outputVariable) {
                console.warn('outputVariable: ', outputVariable);
                /*
                if (outputVariable.name === 'config') {
                    component.set('v.config', outputVariable.value);
                } else if (outputVariable.name === 'configId') {
                    component.set('v.configId', outputVariable.value);
                
                */
            });
        }
    } 
})