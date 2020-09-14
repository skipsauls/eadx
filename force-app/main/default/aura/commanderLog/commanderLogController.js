({
    init: function(component, event, helper) {
        helper.setup(component);
        helper.setupSelections(component);
    },
    handleSessionIdChange: function(component, event, helper) {
        helper.setupSelections(component);
    },
    onRecordingSessionChange: function(component, event, helper){
        // Null recording means that recording must have
        // stopped.  Let's reload...
        if (!event.getParam('value')){
            helper.setup(component);
            helper.setupSelections(component);
        }
    },
    handleGlobalRecordingSessionReloadEvent: function(component, event, helper){
        helper.setup(component);
        helper.setupSelections(component);        
    },
    handlePhraseIndexChange: function(component, event, helper) {
        let index = component.get('v.phraseIndex');
        let session = component.get('v.session');
        let phrases = component.get('v.phrases');
        let phrase = phrases[index];
        console.warn('phrase: ', phrase);
        return;
        
        if (session !== null && typeof session !== 'undefined') {
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
        }
    },
    selectPhrase: function(component, event, helper) {
        let input = event.getSource();
        let idx = input.get('v.name');
        component.set('v.phraseIndex', idx);
    },
    handleKeypress: function(component, event, helper) {
        if(event.which === 13) {
            helper.checkForUpdates(component, event);
        }        
    },
    handleBlur: function(component, event, helper) {
        helper.checkForUpdates(component, event);
    },
    handleFocusOut: function(component, event, helper) {
        helper.checkForUpdates(component, event);
    },
    updatePhrase: function(component, event, helper) {
        //helper.updatePhrase(component, event);
    },
    previousPhrase: function(component, event, helper) {
        helper.previousPhrase(component);
    },
    nextPhrase: function(component, event, helper) {
        helper.nextPhrase(component);
    },
    goPreviousAndExecute: function(component, event, helper){
        var phrases = component.get('v.phrases');
        var phraseIndex;
        if (phrases){
            helper.previousPhrase(component);
            phraseIndex = component.get('v.phraseIndex')
            helper.executeCommand(component, phrases[phraseIndex]);            
        }
    },
    executeAndGoNext: function(component, event, helper){
        var phrases = component.get('v.phrases');
        var phraseIndex = component.get('v.phraseIndex');
        if (phrases && phrases[phraseIndex]){
            helper.executeCommand(component, phrases[phraseIndex]);            
            helper.nextPhrase(component);
        }
    },
    playPause: function(component, event, helper) {
        helper.playPause(component);
    }
})