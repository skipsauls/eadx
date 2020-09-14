({
    setup: function(component) {
        let sessionRecordingApi = component.find('sessionRecordingApi');
        sessionRecordingApi.getSessions(null,
                                        function(results) {
                                            console.warn('getSessions results: ', results);
                                            component.set('v.sessions', results);
                                        },
                                        function (err) {
                                            console.error('getSessions error: ', err);
                                        });
    },
    
    setupSelections: function(component) {
        let sessionId = component.get('v.sessionId');
        console.warn('sessionId: ', sessionId);
        let sessions = component.get('v.sessions');
        let session = null;
        sessions.forEach(function(s) {
            if (s.Id === sessionId) {
                session = s;
            }
        });
        component.set('v.session', session);
        
        let sessionRecordingApi = component.find('sessionRecordingApi');
        sessionRecordingApi.getSessionPhrases(sessionId,
                                              function(results) {
                                                  console.warn('getSessionPhrases results: ', results);
                                                  results.forEach(function(phrase) {
                                                      // Copy the value for display/edits
                                                      phrase.text = phrase.phrase__c;
                                                  })
                                                  component.set('v.phrases', results);
                                              },
                                              function (err) {
                                                  console.error('getSessionPhrases error: ', err);
                                              });

    },

    checkForUpdates: function(component, event) {
        let self = this;
    	console.warn('checkForUpdates');
        let session = component.get('v.session');
        let phrases = component.get('v.phrases');
        console.warn('phrases: ', phrases);
        phrases.forEach(function(phrase, idx) {
            console.warn('phrase: ', idx, phrase.phrase__c, phrase.text);
            if (phrase.phrase__c !== phrase.text) {
                self.updatePhrase(component, phrase);
            }
        });
	},
    
    updatePhrase: function(component, phrase) {
        console.warn('updatePhrase: ', phrase);
        let self = this;
        //let phrases = component.get('v.phrases');
        phrase.phrase__c = phrase.text;
        //component.set('v.phrases', phrases);
        let sessionRecordingApi = component.find('sessionRecordingApi');
        sessionRecordingApi.updatePhrase(phrase.Id,
                                         phrase.phrase__c,
                                         function(results) {
                                             console.warn('updatePhrase results: ', results);
                                         },
                                         function (err) {
                                             console.error('updatePhrase error: ', err);
                                         });
    },
    
    previousPhrase: function(component) {
        let index = component.get('v.phraseIndex');
        let session = component.get('v.session');
        let phrases = component.get('v.phrases');
        index = (--index < 0) ? index = phrases.length-1 : index; 
        component.set('v.phraseIndex', index);
    },
    
    nextPhrase: function(component) {
        let index = component.get('v.phraseIndex');
        let session = component.get('v.session');
        let phrases = component.get('v.phrases');
        index = (++index >= phrases.length) ? 0 : index; 
        component.set('v.phraseIndex', index);
    },
    
    playPause: function(component, event, helper) {
        let self = this;
        let interval = component.get('v.interval');
        if (interval !== null && typeof interval !== 'undefined') {
            window.clearInterval(interval);
            component.set('v.interval', null);            
        } else {
            component.set('v.commandIndex', 0);
            let intervalDelay = component.get('v.intervalDelay');
            interval = window.setInterval(function() {
                let command = component.get('v.command');
                let session = component.get('v.session');
                if (command === null || typeof command === 'undefined') {
                    component.set('v.commandIndex', 0);
                    command = session.commands[0];
                }
                let currentCommand = component.get('v.currentCommand');
                
                self.executeCommand(component, currentCommand, function(err, result) {
                    let index = component.get('v.commandIndex');
                    let session = component.get('v.session');
                    if (index >= session.commands.length - 1) {
                        window.clearInterval(interval);
                        component.set('v.interval', null);
                        component.set('v.currentCommand', null);
                    } else {
                        self.nextCommand(component);                            
                    }
                });
                
            }, intervalDelay);
            component.set('v.interval', interval);
        }
    },
    
    typing_playPause: function(component, event, helper) {
        let self = this;
        let interval = component.get('v.interval');
        if (interval !== null && typeof interval !== 'undefined') {
            window.clearInterval(interval);
            component.set('v.interval', null);            
        } else {
            component.set('v.commandIndex', 0);
            let intervalDelay = component.get('v.intervalDelay');
            interval = window.setInterval(function() {
                let command = component.get('v.command');
                let session = component.get('v.session');
                if (command === null || typeof command === 'undefined') {
                    component.set('v.commandIndex', 0);
                    command = session.commands[0];
                }
                let currentCommand = component.get('v.currentCommand');
                
                if (currentCommand === null || typeof currentCommand === 'undefined') {
                    currentCommand = {
                        text: command.text,
                        partial: '',
                        tokens: command.text.split(' '),
                        index: 0
                    };
                }
                if (currentCommand.partial.length === currentCommand.text.length) {
                    self.executeCommand(component, currentCommand, function(err, result) {
                        let index = component.get('v.commandIndex');
                        let session = component.get('v.session');
                        if (index >= session.commands.length - 1) {
                            window.clearInterval(interval);
                            component.set('v.interval', null);
                            component.set('v.currentCommand', null);
                        } else {
                            self.nextCommand(component);                            
                        }
                    });
                } else {
                    if (++currentCommand.index > currentCommand.tokens.length) {
                        self.nextCommand(component);
                    } else {
                        currentCommand.partial = currentCommand.tokens.slice(0, currentCommand.index).join(' ');
                        component.set('v.currentCommand', currentCommand);
                    }
                }
            }, intervalDelay);
            component.set('v.interval', interval);
        }
        
    },
    
    executeCommand: function(component, command, callback) {
        console.warn('executeCommand: ', command.text);
        component.set('v.executeCommand', command);
        
        var event = $A.get("e.c:ExternalCommanderPhraseEvent");
        console.warn('event: ', event);
        event.setParam('phrase', command.text);
        event.fire();
        
        if (typeof callback === 'function') {
            callback(null, {msg: 'success'});
        }
        
    }
    
})