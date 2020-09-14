({
    testSessions: [
        {
            label: 'Alpha', 
            commands: [
                {
                    text: 'show dashboard quarterly results',
                },
                {
                    text: 'select stage by needs analysis'
                },
                {
                    text: 'select stage by closed won'
                },
                {
                    text: 'select stage by negotiation review'
                },
                {
                    text: 'clear stage'
                },
                {
                    text: 'filter lead source by advertisement'
                },
                {
                    text: 'reset lead source'
                },
                {
                    text: 'next page'
                },
                {
                    text: 'next page'
                },
                {
                    text: 'first page'
                },
            ]
        },
        {
        	label: 'Beta', 
        	commands: [
                {
                text: 'Who is the AVP for Spencer',
                },
                {
                text: 'What is the ACV for Spencer'
                }                
            ]
        }  
    ],
    
    setup: function(component) {
        component.set('v.sessions', this.testSessions);
        component.set('v.session', this.testSessions[0]);
        
    },
    
    setupSelections: function(component) {
        let sessionIndex = component.get('v.sessionIndex');
        let sessions = component.get('v.sessions');
        let session = sessions[sessionIndex];
        component.set('v.session', session);
        component.set('v.commandIndex', -1);

    },
    
    previousCommand: function(component) {
      	let index = component.get('v.commandIndex');
        let session = component.get('v.session');
        index = (--index < 0) ? index = 0 : index; 
        component.set('v.commandIndex', index);
    },
    
    nextCommand: function(component) {
      	let index = component.get('v.commandIndex');
        let session = component.get('v.session');
        index = (++index >= session.commands.length) ? session.commands.length - 1 : index; 
        component.set('v.commandIndex', index);
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
        
        if (typeof callback === 'function') {
            callback(null, {msg: 'success'});
        }
        
    }
    
})