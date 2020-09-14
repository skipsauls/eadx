({
    init: function(component, event, helper) {
        helper.setup(component);
        helper.setupSelections(component);
    },
    
    handleSessionIndexChange: function(component, event, helper) {
        helper.setupSelections(component);
        return;
        let index = component.get('v.sessionIndex');
        let sessions = component.get('v.sessions');
        let session = sessions[index];
        component.set('v.session', session);
        component.set('v.commandIndex', 0);
    },
    
    handleCommandIndexChange: function(component, event, helper) {
        let index = component.get('v.commandIndex');
        let session = component.get('v.session');
        let command = session.commands[index] || null;
        component.set('v.command', command);
        if (command !== null && typeof command !== 'undefined') {
            let currentCommand = {
                text: command.text,
                partial: '',
                tokens: command.text.split(' '),
                index: 0
            };
            component.set('v.currentCommand', currentCommand);
        }
        
    },
    
    selectCommand: function(component, event, helper) {
        let input = event.getSource();
        let idx = input.get('v.name');
        component.set('v.commandIndex', idx);
    },
    
    updateCommand: function(component, event, helper) {
        let input = event.getSource();
        let idx = input.get('v.name');
        let session = component.get('v.session');
        let command = session.commands[idx];
        let value = input.get('v.value');
        command.text = value;
        component.set('v.session', session);
    },
    
    previousCommand: function(component, event, helper) {
        helper.previousCommand(component);
    },
    
    nextCommand: function(component, event, helper) {
        helper.nextCommand(component);
    },
    
    playPause: function(component, event, helper) {
        helper.playPause(component);
    }
})