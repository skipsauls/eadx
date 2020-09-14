({
    refreshData: function(component) {
        
        var action = component.get("c.getAll");
        var self = this;
        
        action.setParams({});
        action.setCallback(this, function(response) {
            console.warn('getCommands response: ', response);
            var state = response.getState();
            console.warn('state: ', state);
            if (state === "SUCCESS") {
                var commands = response.getReturnValue();
                console.warn('commands: ', commands);
                component.set('v.commands', commands);
                
                var commandMap = {};
                commands.forEach(function(command) {
                   	commandMap[command.Id] = command; 
                });
                
                component.set('v.commandMap', commandMap);
                
                self.createTree(component, commands);
                
            } else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var err = response.getError();
                console.error('error: ', err);
            }            
        });
        $A.enqueueAction(action);        
        
    },
    
    createTree: function(component, commands) {
        var items = [];
        var commandItems = [];
        var commandItem = null;
        var commandTargetItem = null;
       	var commandTargetItems = [];
        var commandActionableItem = null;
       	var commandActionableItems = [];
        var grammarCommandItem = null;
       	var grammarCommandItems = [];
        commands.forEach(function(command, i) {
            console.warn('command: ', command);
            
            command.objectApiName = 'eadx__Command__c';
            
            commandItem = {
                label: command.Name,
                name: 'Command:' + command.Id,
                items: [],
                expanded: false,
                command: command                
            };
            
            // Command Target
            commandTargetItem = {
                label: 'Command Target: ' + command.eadx__CommandTarget__c,
                name: 'CommandTarget:' + command.eadx__CommandTarget__c             
            };
            
            commandItem.items.push(commandTargetItem);
            
            // Command Actionables
            commandActionableItems = {
                label: 'Command Actionable',
                name: 'CommandActionable',
                items: [],
                expanded: false
            };
            
            commandActionableItem = {
                label: 'Id: ' + command.eadx__CommandActionable__r.Id,
                name: 'CommandActionableId:' + command.eadx__CommandActionable__r.Id
            }            
			commandActionableItems.items.push(commandActionableItem);

            commandActionableItem = {
                label: 'Action Type: ' + command.eadx__CommandActionable__r.eadx__ActionType__c,
                name: 'ActionType:' + command.eadx__CommandActionable__r.eadx__ActionType__c
            }            
			commandActionableItems.items.push(commandActionableItem);
            
            commandItem.items.push(commandActionableItems);
            
            // Grammar Commands
            grammarCommandItems = {
                label: 'Grammar Commands',
                name: 'GrammarCommands',
                items: [],
                expanded: false
            };
 
            command.eadx__GrammarCommands__r.forEach(function(grammarCommand) {
                console.warn('grammarCommand: ', grammarCommand);
                
                grammarCommandItem = {
                    label: '' + grammarCommand.eadx__ActionablePhrase__r.eadx__PhraseText__c + ' ' + grammarCommand.eadx__Grammar__r.Name,
                    name: 'GrammarCommand:' + grammarCommand.Id,
                    items: []
                };
                grammarCommandItem.items.push({
                    label: 'Id: ' + grammarCommand.Id,
                    name: 'GrammarCommandId:' + grammarCommand.Id                                        
                });
                grammarCommandItem.items.push({
                    label: 'Actionable Phrase',
                    name: 'ActionablePhrase',
                    items: [
                        {
                    		label: 'Id: ' + grammarCommand.eadx__ActionablePhrase__r.Id,  
                    		name: 'ActionablePhraseId:' + grammarCommand.eadx__ActionablePhrase__r.Id                        
                        },
                        {
                    		label: 'Phrase Text: ' + grammarCommand.eadx__ActionablePhrase__r.eadx__PhraseText__c,
                    		name: 'PhraseText:' + grammarCommand.eadx__ActionablePhrase__r.eadx__PhraseText__c                                                   
                        }
					]
                });
                grammarCommandItem.items.push({
                    label: 'Grammar',
                    name: 'Grammar',
                    items: [
                        {
                    		label: 'Id: ' + grammarCommand.eadx__Grammar__r.Id,  
                    		name: 'GrammarId:' + grammarCommand.eadx__Grammar__r.Id                        
                        },
                        {
                    		label: 'Name: ' + grammarCommand.eadx__Grammar__r.Name,
                    		name: 'Name:' + grammarCommand.eadx__Grammar__r.Name                                                   
                        }
					]
                });
                grammarCommandItems.items.push(grammarCommandItem);
            });


			commandItem.items.push(grammarCommandItems);
            
            commandItems.push(commandItem);
            
        });
        
        /*
        items.push({
            label: 'Commands',
            name: 'commands',
            items: commandItems,
            expanded: true
        });
        component.set('v.items', items);
        */
        
        component.set('v.items', commandItems);
        
    }
    
})