({
    stateList: [
        {
            label: 'Suggest',
            name: 'suggest',
            message: {
                title: 'Try asking things like...',
                subtitle: 'Speak or click the action'
            }
        },
        {
            label: 'Dictating',
            name: 'dictating',
            message: null           
        },
        {
            label: 'Command Response',
            name: 'command_response',
            message: null
        },
        {
            label: 'Prompt',
            name: 'prompt',
            message: {
                title: 'Ready',
                subtitle: null
            }
        },
        {
            label: 'Prompt 2',
            name: 'prompt2',
            message: {
                title: 'Try asking things like...',
                subtitle: 'Speak or click the action'
            }
        },
        {
            label: 'Asleep',
            name: 'asleep',
            message: {
                title: 'Click the mic or say "Einstein"',
                subtitle: null
            }
        },
        {
            label: 'Analytics Query',
            name: 'analytics_query',
            message: null
        },
        {
            label: 'Chart Response',
            name: 'chart_response',
            message: null
        },
        {
            label: 'Did Not Understand',
            name: 'did_not_understand',
            message: {
                title: 'Sorry, I didn\'t understand. Try saying...',
                subtitle: null
            }
        }

    ],
    
    // Can we build this in some way from the commands?
    // Need backward-forward chaining of command targets
    // These should be configurable by an admin, perhaps using a dueling picklist for available/selected
    commandFlow: {
        'Home': {
            type: 'Home',
            target: null,
            childCommands: ['ViewAnalyticsDashboard','ViewSObject','ShowListView','OpenLightningFlow']
        },
        'ViewAnalyticsDashboard': {
            type: 'ViewAnalyticsDashboard',
            target: 'Dashboard',
            childCommands: ['ListFilterFields','ListSelectionFields','NLQ','GoToPage']
        },
        'ListFilterFields': {
            type: 'ListFilterFields',
            target: 'FilterFields',
            childCommands: ['ListFilterFieldValues']
        },
        'ListSelectionFields': {
            name: 'ListSelectionFields',
            target: 'SelectionFields',
            childCommands: ['ListSelectionFieldValues']
        },
        'ListFilterFieldValues': {
            name: 'ListFilterFieldValues',
            target: 'FilterFieldValues',
            childCommands: ['FilterAnalyticsDashboard']
        },
        'ListSelectionFieldValues': {
            name: 'ListSelectionFieldValues',
            target: 'SelectionFieldValues',
            childCommands: ['SelectAnalyticsDashboard']
        },
        'SelectAnalyticsDashboard': {
            name: 'SelectAnalyticsDashboard',
            target: 'DashboardSelection',
            childCommands: ['SelectAnalyticsDashboard','ClearAnalyticsSelection']
        },
        'ClearAnalyticsSelection': {
            name: 'ClearAnalyticsSelection',
            target: 'DashboardSelection',
            childCommands: ['ListSelectionFieldValues']
        },        
        'FilterAnalyticsDashboard': {
            name: 'FilterAnalyticsDashboard',
            target: 'DashboardFilter',
            childCommands: ['FilterAnalyticsDashboard','ResetAnalyticsFilter']
        },
        'ResetAnalyticsFilter': {
            name: 'ResetAnalyticsFilter',
            target: 'DashboardFilter',
            childCommands: ['ListFilterFieldValues']
        }
        
    },
    
    hotKeys: {
        'F1': {
            command: 'Show Dashboard Coffee Time'
        },
        'F2': {
            command: 'Select Channel by Stores'
        },
        'F3': {
            command: 'Clear Channel'
        },        
        'F4': {
            command: 'Filter Type by Cold Drinks'
        },
        'F5': {
            command: 'Reset Type'
        },
    },
    
    setup: function(component) {
    	var self = this;
        
        
        // Loaded by init
        //self.getCommandReference(component);
        
        var stateMap = {};
        self.stateList.forEach(function(state) {
           stateMap[state.name] = state;
        });
        
        component.set('v.stateList', self.stateList);
        component.set('v.stateMap', stateMap);
        
        self.setupListening(component);
        
        self.handleStateChange(component);
        
    },

    setupSubscriptions: function(component) {
        var empApi = component.find("empApi");
        var channel = '/event/eadx__EinsteinAnalyticsEvent__e';
        var replayId = -1;
        var callback = function (message) {
            console.warn('received: ', message.channel, message.data.event.replayId);
            console.warn('message.data.payload: ', message.data.payload);
            console.warn('json message.data.payload: ', JSON.stringify(message.data.payload, null, 2));
  
            if (message.data.payload.eadx__type__c == 'command') {
               	let payload = JSON.parse(message.data.payload.eadx__payload__c);
                console.warn('payload: ', payload);
                var phrase = payload.phrase;
                console.warn('phrase: ', phrase);
                
                var voiceResults = component.get('v.voiceResults') || [];
                voiceResults.reverse();
                voiceResults.push({
                    transcript: phrase,
                    command: phrase,
                    confidence: 1.0
                });
                voiceResults.reverse();
        
                component.set('v.voiceResults', voiceResults);
                
            }
  
        }.bind(this);
        
        var errorHandler = function (message) {
            console.error("received error ", message);
        }.bind(this);
        
        empApi.onError(errorHandler);
        
        var sub;
        empApi.subscribe(channel, replayId, callback).then(function(value) {
            console.warn("subscribed to channel: ", channel);
            sub = value;
            component.set("v.sub", sub);
        });        
    },
    
    handleKeyUp: function(component, key) {
        //console.warn('key: ', key);
        var self = this;
        var hotKeys = component.get('v.hotKeys');
        //console.warn('hotKeys: ', hotKeys);
        hotKeys.forEach(function(hotKey) {
            //console.warn('hotKey: ', hotKey);
            if (hotKey.key === key) {
                var command = hotKey.command;
                //console.warn('command: ', command);
                component.set('v.inputText', command);
                
                var voiceResults = component.get('v.voiceResults') || [];
                voiceResults.reverse();
                voiceResults.push({
                    transcript: command,
                    command: command,
                    confidence: 1.0
                });
                voiceResults.reverse();
        
                component.set('v.voiceResults', voiceResults);            
            } 
        });
    },
    
    handleStateChange: function(component) {
        var stateMap = component.get('v.stateMap');
        if (stateMap !== null && typeof stateMap !== 'undefined') {
            var stateName = component.get('v.currentState');
            var state = stateMap[stateName];
            if (state) {
                component.set('v.message', state.message ? state.message : null);
            }
        }
    },
    
    toggleAwake: function(component, awakeVal) {
        console.warn('toggleAwake: ', awakeVal);
        
        return;
        // Old code that we _might_ not need now...
        /*
        var self = this;
        var recurring = component.get('v.recurring');
        var awake = component.get('v.awake');
        if (awakeVal !== null && typeof awakeVal !== 'undefined') {
            awake = awakeVal;
        } else {
	        awake = !awake;
        }

        self.stopDictation(component);
        
        if (awake === true) {
            self.playSound(component, 'listening/HeyEinstein.wav');
	        component.set('v.awake', true);
	        component.set('v.interimResults', false);
	        //helper.resetWakeTimeout(component);
	        self.startVisualization(component);
            component.set('v.currentState', 'suggest');
        } else {
            self.playSound(component, 'listening/MicOff.wav');
	        component.set('v.awake', false);
	        component.set('v.interimResults', true);
	        self.stopVisualization(component);
            component.set('v.currentState', 'asleep');
        }

        if (recurring === true) {
            console.warn('calling startDictation');
            self.startDictation(component);
        }
        */
    },

    handleAwakeChange: function(component, awakeVal) {
        console.warn('handleAwakeChange');
        var self = this;
        var recurring = component.get('v.recurring');
        var awake = component.get('v.awake');
		var listening = component.get('v.listening');

        self.stopDictation(component);
        
        if (awake === true) {
            self.playSound(component, 'listening/HeyEinstein.wav');
	        component.set('v.interimResults', false);
	        //helper.resetWakeTimeout(component);
	        self.startVisualization(component);
            component.set('v.currentState', 'suggest');
            self.getSuggestions(component, null);
        } else {
            self.playSound(component, 'listening/MicOff.wav');
	        component.set('v.interimResults', true);
	        self.stopVisualization(component);
            component.set('v.currentState', 'asleep');
            component.set('v.transcript', '');
        }

        if (recurring === true) {
            //console.warn('calling startDictation');
            self.startDictation(component);
        }

    },

	playSound: function(component, name) {
		var sfx = component.find('sfx');
        sfx.playSound(name);
	},
    
    handleDidUnderstand: function(component, command, state) {
    	var self = this;
        
        //console.warn('Understood command: ', command);
        
        component.set('v.currentState', state);
        
        self.playSound(component, 'speaking/Answer.wav');
        
        self.getSuggestions(component, command, true);
        
    },
    
    handleDidNotUnderstand: function(component, command, state) {
    	var self = this;
        
        console.error('Did not understand command: ', command);
        
        component.set('v.currentState', state);
        
        self.playSound(component, 'speaking/DidNotUnderstand.wav');
        
        self.getSuggestions(component, command, false);
        
	},

    setSuggestedCommands: function(component, suggestedCommands) {
        //console.warn('setSuggestedCommands: ', suggestedCommands);
        component.set('v.suggestedCommands', suggestedCommands);
    },
    
    setCommands: function(component, commands) {
        //console.warn('setCommands: ', commands);
        component.set('v.commands', commands);        
    },    
    
    getSuggestedCommandsByType: function(component, types, callback) {
        //console.warn('getSuggestedCommandsByType: ', types);
        //global static List<Map<String, Object>> getCommandsByType(List<String> types) 
        var action = component.get("c.getCommandsByType");
        action.setParams({types: types});
        action.setCallback(this, function(response) {
            //console.warn('getCommandsByType response: ', response);
            var state = response.getState();
            //console.warn('state: ', state);
            if (state === "SUCCESS") {
                var commands = response.getReturnValue();
                //console.warn('commands: ', commands);
                
                // Ensure the order matches the requested types
                // Note that this doesn't handle duplicates well!!!
                var commandMap = {};
                commands.forEach(function(command) {
                   commandMap[command.actionable.actionType] = command; 
                });
                var sortedCommands = [];
                types.forEach(function(t, i) {
                    //console.warn('type t: ', t, ' - i: ', i);
                    if (commandMap[t] !== null && typeof commandMap[t] !== 'undefined') {
	                   	sortedCommands[i] = commandMap[t]; 
                    }
                });
                //console.warn('sortedCommands: ', sortedCommands);
                if (typeof callback === 'function') {
                    callback(null, sortedCommands);
                }                
                
            } else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var err = response.getError();
                console.error('error: ', err);
                if (typeof callback === 'function') {
                    callback(err, null);
                }                
            }            
        });
        $A.enqueueAction(action)        
    },
    
    getSuggestions: function(component, commandWrapper, understood) {
        var self = this;
        /*
        console.warn('getSuggestions');
        console.warn('commandWrapper: ', commandWrapper);
        console.warn('understood: ', understood);
        */
		var command = null;
        var target = null;
        var commandType = null;
        var phrase = null;
        var type = 'Home';
        var flow = null;

        if (commandWrapper !== null && typeof commandWrapper !== 'undefined') {
            command = commandWrapper.command || commandWrapper;
            type = command.action ? command.action.type : command.type;
            target = command.target;
            target = target ? target.toLowerCase() : null;
            commandType = command.action ? command.action.type : command.type;
            //phrase = command.rankingPhrase.phrase;
        }
        
        flow = self.commandFlow[type];
        
        /*
        console.warn('command: ', command);
        console.warn('target: ', target);
        console.warn('action type: ', type);               
        console.warn('commandType: ', commandType);
        //console.warn('phrase: ', phrase);
        console.warn('flow: ', flow);


		*/

        //flow = null;
        
        
        if (flow !== null && typeof flow !== 'undefined') {
            var childCommands = flow.childCommands;
            //console.warn('childCommands: ', childCommands);


            
            
            
            //
            // FLIP THE LOGIC AROUND!
            // - Iterate over each childCommand type
            //   - For each type get the list of suggested commands
            //   - Display the top N commands  
            //
            //
            
            self.getSuggestedCommandsByType(component, childCommands, function(err, commandsByType) {
                //console.warn('commandsByType: ', commandsByType);
                
                var suggestedCommands = [];
                
                //self.setSuggestedCommands(component, suggestedCommands);
                //self.setCommands(component, suggestedCommands);                  
                
                var suggestedCommand = null;
                var suggestionLimit = component.get('v.suggestionLimit');
	            //console.warn('suggestionLimit: ', suggestionLimit);
                
                var target = null;
                commandsByType.forEach(function(c) {
                    //console.warn('c: ', c);
                    target = c.target ? c.target.toLowerCase() : null;
                    //console.warn('target: ', target);
                    
					var phrase = (c.phrases && c.phrases.length > 0) ? c.phrases[0].text : null;                    
                    
                    var commandType = c.actionable.actionType;                    
                    
                    suggestedCommand = {
                        text: phrase,
                        name: c.name,
                        id: c.id,
                        type: commandType,
                        command: c,
                        config: {                            
                        }
                    };
                    //suggestedCommands.push(suggestedCommand);                    
                    
                    
                    if (target === 'dashboard') {
                        
                        // Use the first phrase for the suggestion
                        // Need a better weighting alorithm
                        // See dueling-picklist idea elsewhere
						var phrase = (c.phrases && c.phrases.length > 0) ? c.phrases[0].text : null;                        
                        var commandType = c.actionable.actionType;
                        
                        self.listDashboards(component, function(err, dashboards) {
                            //console.warn('listDashboards returned: ', err, dashboards);
                            if (dashboards) {
                                suggestedCommands = component.get('v.suggestedCommands');
                                var dashboard = null;
                                var max = dashboards.length < suggestionLimit ? dashboards.length : suggestionLimit;
                                //console.warn('max: ', max);
                                for (var i = 0; i < max; i++) {
                                    dashboard = dashboards[i];
                                    //console.warn('dashboard: ', dashboard);
                                    suggestedCommand = {
                                        text: phrase + ' dashboard ' + dashboard.label,
                                        name: dashboard.name,
                                        id: dashboard.id,
                                        type: commandType,
                                        command: command,
                                        config: {
                                            id: dashboard.id
                                        }
                                    };
                                    suggestedCommands.push(suggestedCommand);
                                }
                                self.setSuggestedCommands(component, suggestedCommands);
                                self.setCommands(component, suggestedCommands);                    
                                //component.set('v.suggestedCommands', suggestedCommands);
                                //component.set('v.commands', suggestedCommands);
                            }
                        });
                        
                    } else if (target === 'datasetfields') {

                        
                    } else if (target === 'datasetfieldvalues') {
                     
                    }

                    
                });
                
                if (suggestedCommands.length > 0) {
                    self.setSuggestedCommands(component, suggestedCommands);
                    self.setCommands(component, suggestedCommands);                                        
                }
                
            });

        } else {
            
            // NOT REALLY WHAT WE WANT TO DO, BUT A PLACEHOLDER
            var suggestedCommands = [];
            var suggestedCommand = null;
            var suggestionLimit = component.get('v.suggestionLimit');
            //console.warn('suggestionLimit: ', suggestionLimit);
            
            if (target === 'dashboard') {
                self.listDashboards(component, function(err, dashboards) {
                    //console.warn('urned: ', err, dashboards);
                    if (dashboards) {
                        var dashboard = null;
                        var max = dashboards.length < suggestionLimit ? dashboards.length : suggestionLimit;
                        //console.warn('max: ', max);
                        for (var i = 0; i < max; i++) {
                            dashboard = dashboards[i];
                            //console.warn('dashboard: ', dashboard);
                            suggestedCommand = {
                                text: phrase + ' ' + dashboard.label,
                                name: dashboard.name,
                                id: dashboard.id,
                                type: commandType,
                                command: command
                            };
                            suggestedCommands.push(suggestedCommand);
                        }
                        self.setSuggestedCommands(component, suggestedCommands);
                        self.setCommands(component, suggestedCommands);                    
                        //component.set('v.suggestedCommands', suggestedCommands);
                        //component.set('v.commands', suggestedCommands);
                    }
                });
            }
            
        }

    },
    
    getSuggestionsByType: function(component, type, callback) {
        //console.warn('----------------------> getSuggestionsByType: ', type);
        var self = this;
        var flow = self.commandFlow[type];
        //console.warn('----------------------> flow: ', flow);
        if (flow !== null && typeof flow !== 'undefined') {
            var childCommands = flow.childCommands;    
        	//console.warn('----------------------> childCommands: ', childCommands);
            self.getSuggestedCommandsByType(component, childCommands, function(err, commandsByType) {
                //console.warn('----------------------> commandsByType: ', commandsByType);
                
                var suggestedCommands = [];
                
                var suggestedCommand = null;
                var suggestionLimit = component.get('v.suggestionLimit');
                var phrase = null;
                var commandType = null;                
                var target = null;
                var regex = new RegExp('(\{{.*?\}})', 'g');
                
                commandsByType.forEach(function(c) {
                    //console.warn('c: ', c);
                    target = c.target? c.target.toLowerCase() : null;
                    //console.warn('target: ', target);
                    
					phrase = (c.phrases && c.phrases.length > 0) ? c.phrases[0].text : null;
                    
                    commandType = c.actionable.actionType;

                    suggestedCommand = {
                        text: phrase,
                        name: c.name,
                        id: c.id,
                        type: commandType,
                        command: c,
                        config: null
                    };
                    suggestedCommands.push(suggestedCommand);
                });
                
                if (typeof callback !== 'undefined' && flow !== null) {
                    callback(null, suggestedCommands);
                }
            });
        }
    },
   
    setupHotkeys: function(component) {
        //console.warn('setupHotkeys');
        var self = this;
        window.addEventListener('keyup', function(e) {
            var keyCode = e.keyCode ? e.keyCode : e.which;
            //console.warn('keyCode: ', keyCode);
            var useHotKeys = component.get('v.useHotKeys');
            if (useHotKeys === true) {
                var key = e.key;
                self.handleKeyUp(component, key);
            }
        });
        /*
        window.onkeyup = function(e) {
            //var keyCode = e.keyCode ? e.keyCode : e.which;
            var useHotKeys = component.get('v.useHotKeys');
            if (useHotKeys === true) {
                var key = e.key;
                self.handleKeyUp(component, key);
            }
        } 
        */
    },
    
    defaultConfig: {
        wakeWords: 'Einstein',
        voiceName: 'Alex',
        wakeTimeout: 10,
    },
    
    getVoiceConfig: function(component, callback) {
        var self = this;
        var action = component.get("c.getVoiceConfig");
        action.setParams({});
        action.setCallback(this, function(response) {
            //console.warn('getVoiceConfig response: ', response);
            var state = response.getState();
            //console.warn('state: ', state);
            if (state === "SUCCESS") {
                var config = response.getReturnValue();
                config = JSON.parse(config);
                console.warn('config: ', config);
                
                if (config === null || typeof config === 'undefined') {
                    config = self.defaultConfig;
                }
                
                component.set('v.config', config);
                self.applyVoiceConfig(component);
                
                if (typeof callback === 'function') {
                    callback(config);
                }
                
            } else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var err = response.getError();
                console.error('error: ', err);
            }            
        });
        $A.enqueueAction(action);        
    },
    
    applyVoiceConfig: function(component) {
        console.warn('applyVoiceConfig');
        var self = this;
        var config = component.get('v.config');
        var value = null;
        for (var key in config) {
            value = config[key];
            console.warn('setting ', key, ' to ', value);
            try {
	            component.set('v.' + key, value);
            } catch (e) {
                console.err(e);
            }
        }
    },
    
    saveVoiceConfig: function(component) {
        var self = this;
        var configName = component.get('v.configName');
		var config = component.get('v.config');
        console.warn('saveVoiceConfig - config: ', config);
        if (config === null || typeof config === 'undefined') {
            config = self.defaultConfig;
        }

        for (var key in config) {
            config[key] = component.get('v.' + key);
        }

        console.warn('save config: ', config);        
        
        var action = component.get("c.updateVoiceConfig");
        var json = JSON.stringify(config);
        console.warn('config json: ', json);
        console.warn('configName: ', configName);
        action.setParams({name: configName, config: json});
        action.setCallback(this, function(response) {
            console.warn('updateVoiceConfig response: ', response);
            var state = response.getState();
            console.warn('state: ', state);
            if (state === "SUCCESS") {
                var config = response.getReturnValue();
                console.warn('updateVoiceConfig returned: ', config);
                component.set('v.config', JSON.parse(config));
                self.notifyVoiceConfig(component);                
            } else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var err = response.getError();
                console.error('error: ', err);
            }            
        });
        $A.enqueueAction(action);
    },
    
    getVoices: function(component, callback) {
		var voiceProxy = component.find('voiceProxy');
        //console.warn('voiceProxy: ', voiceProxy);
        //console.warn('voiceProxy.vf_voice_proxy_id: ', voiceProxy.get('v.vf_voice_proxy_id'));
        //console.warn('voiceProxy.ready: ', voiceProxy.get('v.ready'));
        var self = this;
        if (voiceProxy.get('v.ready') !== true) {
            setTimeout(function() {
                self.getVoices(component, callback);
            }, 100);            
        } else {
            var uid = 'Einstein_Assistant_Settings_Get_Voices';
            voiceProxy.getVoices(uid, function(voices) {
                //console.warn('getVoices returned: ', voices);
                component.set('v.voices', voices);
                //console.warn('callback: ', callback, typeof callback);
                if (typeof callback === 'function') {
                    callback(voices);
                }
            });                    
        }
    },  
    
    reset: function(component) {
        /*
		var baseCommandMap = component.get('v.baseCommandMap');
		var commandMap = component.get('v.commandMap');
        var commands = [];
        var command = null;
        for (var word in baseCommandMap) {
            command = baseCommandMap[word];
            commands.push(command);
        }
        component.set('v.commands', commands);                        
        component.set('v.commandMap', baseCommandMap);
        */
        
        component.set('v.inputText', '');
    },
    
    setupListening: function(component, callback) {
        var self = this;
		var voiceProxy = component.find('voiceProxy');        
        
        if (voiceProxy.get('v.ready') !== true) {
            setTimeout(function() {
                self.setupListening(component, callback);
            }, 100);            
        } else {

            var listening = component.get('v.listening');
            
            var utilityAPI = component.find("utilitybar");
            
            if (utilityAPI !== null && typeof utilityAPI !== 'undefined') {
                // This changes the microphone icon
                //var iconName = 'utility:' + (listening ? 'unmuted' : 'muted');
                var iconName = 'einstein';
                
                utilityAPI.setUtilityIcon({icon: iconName});        
                
                utilityAPI.setPanelHeaderIcon({icon: iconName});        
                
                //utilityAPI.setUtilityHighlighted({highlighted: listening});                
            } 
    
            console.warn('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> listening: ', listening);
                    
            if (listening === true) {
                //self.clearTimeout(component);
                //self.startVisualization(component);
                //console.warn('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> calling startDictation from toggleListening (true)');
                self.startDictation(component);	            
            } else {
                //self.clearTimeout(component);
                self.stopDictation(component);
                component.set('v.awake', false);
                component.set('v.interimResults', true);
                //self.stopVisualization(component);
            }
            
        }        
    },
    
	startDictation: function(component) {
        //console.warn('startDictation');
        
        var voiceProxy = component.find('voiceProxy');
        var continuous = component.get('v.continuous');
        var interimResults = component.get('v.interimResults');
        var maxAlternatives = component.get('v.maxAlternatives');
        var recurring = component.get('v.recurring');
        var self = this;
        
        var uid = 'Einstein_Assistant_Speech_Recognition';

        voiceProxy.startDictation('en-US', continuous, interimResults, maxAlternatives, uid, function(response) {
            //console.warn('voiceUtilityBarHelper voiceProxyStartDictation response: ', response, response.source, response.phase, response.results);
            if (response.source !== 'SpeechRecognition') {
                return;
            }
            
            // Use the phase to control animations via CSS, etc.
            component.set('v.phase', response.phase);
            
            var awake = component.get('v.awake');
            //console.warn('awake: ', awake);
            
            if (response.phase === 'onresult' && response.results) {

                //interimResults = !awake;
                //console.warn('interimResults: ', interimResults);
                
                if (interimResults === true) {
                    
                    var results = JSON.parse(JSON.stringify(response.results));
                    //console.warn('startDictation - results: ', results);                
                    
                    // Wake word testing
                    var wakeWords = component.get('v.wakeWords');
                    //console.warn('wakeWords: ', wakeWords);

                    var awake = component.get('v.awake');
                    //console.warn('awake: ', awake);
                    
                    var transcript = null;
                    var confidence = null;
                    var isFinal = false;
                    var index = -1;
                    var wakeWordDetected = false;
                    results.forEach(function(result) {
                        //console.warn('result: ', result);
                        result.forEach(function(alternative) {
                            transcript = alternative.transcript;
                            confidence = alternative.confidence;
                            isFinal = alternative.isFinal || false;
                            /*
                            console.warn('alternative: ', alternative);                            
                            console.warn('transcript: ', transcript);
                            console.warn('confidence: ', confidence);
                            console.warn('isFinal: ', isFinal);
                            */
                            if (isFinal === true) {
                                var index = transcript.toLowerCase().indexOf(wakeWords.toLowerCase());
                                if (index === 0) {
                                    //console.warn('Wake word detected!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                                    wakeWordDetected = true;
                                } else {
                                }
                            }                            
                        });
                    });

                    if (wakeWordDetected === true) {
                        
                        var awake = component.get('v.awake');
                        
                        if (awake === false) {
                            self.stopDictation(component);
                            
                            component.set('v.awake', true);
                            component.set('v.interimResults', false);
                            self.startVisualization(component);
                            
                            if (recurring === true) {
                                //console.warn('calling startDictation');
                                self.startDictation(component);
                            }
                            
                        } else {
                            
                        }

                    }
                    
                } else {
                    //console.warn('########### Not in interim mode');
                    var results = JSON.parse(JSON.stringify(response.results));
                    //console.warn('startDictation - results: ', results);                
                    
                    // Wake word testing
                    var wakeWords = component.get('v.wakeWords');
                    //console.warn('wakeWords: ', wakeWords);
                    
                    var transcript = null;
                    var confidence = null;
                    var isFinal = false;
                    var index = -1;
                    results.forEach(function(result) {
                        //console.warn('result: ', result);
                        result.forEach(function(alternative) {
                            transcript = alternative.transcript;
                            confidence = alternative.confidence;
                            isFinal = alternative.isFinal || false;
                            /*
                            console.warn('alternative: ', alternative);
                            console.warn('transcript: ', transcript);
                            console.warn('confidence: ', confidence);
                            console.warn('isFinal: ', isFinal);
    						*/
                            
                            transcript = transcript.replace('one', 'won');
                            transcript = transcript.replace('a mount', 'amount');
                            
                            var voiceTranscripts = component.get('v.voiceTranscripts') || [];
                            voiceTranscripts.reverse();
                            voiceTranscripts.push({
                                transcript: transcript,
                                confidence: confidence,
                                isFinal: isFinal
                            });
                            voiceTranscripts.reverse();
                            component.set('v.voiceTranscripts', voiceTranscripts);                            

                            var substring = transcript;
                            
                            var voiceResults = component.get('v.voiceResults') || [];
                            voiceResults.reverse();
                            voiceResults.push({
                                transcript: transcript,
                                command: substring,
                                confidence: confidence
                            });
                            voiceResults.reverse();
                            component.set('v.voiceResults', voiceResults);                            

                        });
                    });                
               
                    //console.warn('recurring: ', recurring);
                    if (recurring === true) {
                        self.startDictation(component);
                    }
                }             
            } else if (response.phase === 'onend') {
                if (recurring === true) {
                    self.startDictation(component);
                }
            } else if (response.error) {
                if (response.error.error) {
                    if (response.error.error === 'no-speech') {
                    } else {
                        self.stopDictation(component);
                        console.error('voiceUtilityBarHelper voiceProxyStartDictation error: ', response.error);
                        console.error('response.error.error: ', response.error.error);
                        console.error('response.error.message: ', response.error.message);
                    }
                    
                    if (recurring === true) {
                        //self.startDictation(component);                                        
                    }
                }
                
            } else if (response.message) {
                console.warn('voiceUtilityBarHelper voiceProxyStartDictation message: ', response.message);
            }
        });
	},
    
	stopDictation: function(component) {
        console.warn('stopDictation');
        
        // Never stop?
        return;
        
        var voiceProxy = component.find('voiceProxy');
        var self = this;
        var uid = 'Einstein_Assistant_Speech_Recognition';
        voiceProxy.stopDictation(uid, function(response) {
            console.warn('stopDictation - response: ', response);
            var results = JSON.parse(JSON.stringify(response));
            console.warn('stopDictation - results: ', results);
            
			// Move state changes to function
            component.set('v.phase', 'stopped');
            //component.set('v.interimResults', true);
            //component.set('v.awake', false);
        });
	},
    
    _wakeTimeout: null,
    _wakeInterval: null,
    
    clearTimeout: function(component) {
        var self = this;
        if (self._wakeTimeout !== null && typeof self._wakeTimeout !== 'undefined') {
            clearTimeout(self._wakeTimeout);
        }
        
        if (self._wakeInterval !== null && typeof self._wakeInterval !== 'undefined') {
            clearInterval(self._wakeInterval);
        }    	    
    },
    
    resetWakeTimeout: function(component) {
        
        return;
        
        
        var self = this;
        var wakeTimeout = component.get('v.wakeTimeout');
        console.warn('wakeTimeout: ', wakeTimeout);
        if (self._wakeTimeout !== null && typeof self._wakeTimeout !== 'undefined') {
            clearTimeout(self._wakeTimeout);
        }
        self._wakeTimeout = setTimeout($A.getCallback(function() {
            console.warn('************************************************************************* timeout handler');
            //self.stopDictation(component);

            component.set('v.awake', false);
            //component.set('v.phase', 'stopped');
            component.set('v.interimResults', true);
            
            var recurring = component.get('v.recurring');
            console.warn('recurring: ', recurring);
            if (recurring === true) {
                //console.warn('calling startDictation from resetWakeTimeout');
                self.startDictation(component);
            }
        }), (wakeTimeout * 1000));

        if (self._wakeInterval !== null && typeof self._wakeInterval !== 'undefined') {
            clearInterval(self._wakeInterval);
        }
        
        self._wakeInterval = setInterval($A.getCallback(function() {
            //console.warn('************************************************************************* interval handler');
            var wakeTimeRemaining = component.get('v.wakeTimeRemaining');
            if (wakeTimeRemaining > 0) {
                wakeTimeRemaining--;
            }
            component.set('v.wakeTimeRemaining', wakeTimeRemaining);

        }), 1000);

        component.set('v.wakeTimeRemaining', wakeTimeout);
        
    },
    
    handleVoiceResultsChange: function(component) {
        //console.warn('handleVoiceResultsChange');
        var results = component.get('v.voiceResults');
        var result = results[0];
        var transcript = result.transcript;
        var command = result.command;
        //console.warn('transcript: ', transcript);
        //console.warn('command: ', command);
        var self = this;

        var executeFirstMatchingCommand = component.get('v.executeFirstMatchingCommand');
        
        
        var lctranscript = transcript.toLowerCase().trim();
        if (lctranscript === 'reset' || lctranscript === 'home' || lctranscript === 'go home') {
            //console.warn('################################################################################');
			component.set('v.currentState', 'suggest');
			//self.getCommandReference(component);
			executeFirstMatchingCommand = false;
            component.set('v.inputText', '');
	        component.set('v.transcript', '');
            
            self.setSuggestedCommands(component, []);
            self.setCommands(component, []);
            
            self.reset(component);
            
	        //self.handleStateChange(component); 
            
            self.handleAwakeChange(component);
            
            return;

        }
        
        component.set('v.transcript', transcript);
        
        self.getCommands(component, command, function(commands) {
            //console.warn(' commands: ', commands);
            
            if (commands !== null && typeof commands !== 'undefined' && commands.length > 0) {
                
                var suggestedCommand = null;
                var suggestedCommands = [];
                var suggestedAlternatives = [];
                var status = null;
                var phrase = null;
                var actionType = null;
                
                commands.forEach(function(command) {
                    
                    //console.warn('command: ', command);
                    
                    if (command.action) {
                        if (command.action.results && command.action.results.length > 0) {
                            command.action.results.forEach(function(result) {
                                //console.warn('result: ', result);
                                
                                phrase = null;
                                actionType = command.action.type;
                                
                                // Special cases for filters, selections, etc.
                                // May need to change this!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                                
                                if (command.action.type === 'FilterAnalyticsDashboard' || command.action.type === 'SelectAnalyticsDashboard') {
                                    if (command.rankingPhrase.missing && command.rankingPhrase.missing.length >= 2) {
                                        phrase = command.rankingPhrase.phrase;
                                        
                                        var fieldValue = result.fieldValue;
                                        var fieldName = result.fieldName;
        
                                        phrase = phrase.replace('{{FIELD_NAME}}', fieldName);
                                        phrase = phrase.replace('{{FIELD_VALUE}}', fieldValue);
                                       
                                    }
                                } else if (command.action.type === 'ResetAnalyticsFilter' || command.action.type === 'ClearAnalyticsSelection') {
                                    if (command.rankingPhrase.missing && command.rankingPhrase.missing.length >= 1) {
                                        phrase = command.rankingPhrase.phrase;
                                        
                                        var fieldName = result.fieldName;
        
                                        phrase = phrase.replace('{{FIELD_NAME}}', fieldName);
                                       
                                    }
                                } else if (command.action.type === 'NavigateToDashboardPage') {
                                    if (command.rankingPhrase.missing && command.rankingPhrase.missing.length >= 1) {
                                        phrase = command.rankingPhrase.phrase;
                                        
                                        var pageName = result.pageName;
        
                                        phrase = phrase.replace('{{Page_NAME}}', pageName);
                                       
                                    }
                                        
                                } else if (command.action.type === 'OpenLightningFlow') {
                                    if (command.rankingPhrase.missing && command.rankingPhrase.missing.length >= 1) {
                                        phrase = command.rankingPhrase.phrase;
                                        
                                        var flowName = result.flowName;
        
                                        phrase = phrase.replace('{{FLOW_NAME}}', flowName);
                                       
                                    }
    
                                } else if (command.action.type === 'ListListViews') {

                                    
                                    //console.warn('command.rankingPhrase: ', command.rankingPhrase);
                                    if (command.rankingPhrase.missing && command.rankingPhrase.missing.length >= 1) {
	                                    var regex = new RegExp('(^\\d)|(__c*)');
                                        if (result.sObjectType.match(regex) == null) {
	                                        var sObjectType = result.sObjectType;
	                                        phrase = command.rankingPhrase.phrase;
    	                                    phrase = phrase.replace('{{TYPE}}', sObjectType);
                                        }
                                    }
                                    executeFirstMatchingCommand = false;
                                    
                                } else if (command.action.type === 'ShowListViews') {
                                    
                                    
                                    //console.warn('command.rankingPhrase: ', command.rankingPhrase);
                                    if (command.rankingPhrase.missing && command.rankingPhrase.missing.length >= 1) {
	                                    var regex = new RegExp('(^\\d)|(__c*)');
                                        if (result.sObjectType.match(regex) == null) {
	                                        var name = result.name;
	                                        phrase = command.rankingPhrase.phrase;
    	                                    phrase = phrase.replace('{{TYPE}}', name);
                                        }
                                    }
                                    executeFirstMatchingCommand = false;
/*
                                    var regex = new RegExp('(^\\d)|(__c*)');
                                    phrase = 'Show ' + result.name + ' list view';
                                    actionType = 'ShowListView';
                                    executeFirstMatchingCommand = false;
*/
                                } else if (command.action.type === 'ShowListView') {
                                    // SOMETHING WRONG HERE!!!!!!!!!!!!!!!!!!!!!!!!!!
                                    /*
                                    console.warn('command.rankingPhrase: ', command.rankingPhrase);
                                    if (command.rankingPhrase.missing && command.rankingPhrase.missing.length >= 1) {
	                                    var regex = new RegExp('(^\\d)|(__c*)');
                                        if (result.sObjectType.match(regex) == null) {
	                                        var name = result.name;
	                                        phrase = command.rankingPhrase.phrase;
    	                                    phrase = phrase.replace('{{LISTVIEW_NAME}}', name);
                                        }
                                    }
                                    executeFirstMatchingCommand = false;
									*/
                                    var regex = new RegExp('(^\\d)|(__c*)');
                                    phrase = 'Show ' + result.name + ' list view';  
                                    executeFirstMatchingCommand = false;
                                    
                                } else {
                                    phrase = command.rankingPhrase.phrase + ' ' + (result.Label || result.label || result.Name || result.name);
                                }
                                
                                if (phrase !== null) {
                                    suggestedCommand = {
                                        text: phrase,
                                        name: result.name,
                                        id: result.id,
                                        type: actionType,
                                        command: command,
                                        config: result
                                    };
                                    if (command.action.status === 'SUCCESS') {
                                        suggestedCommands.push(suggestedCommand);                                
                                    } else {
                                        suggestedAlternatives.push(suggestedCommand);
                                    }
                                }
                            });
                        } else {
                            //console.warn('$$$$$$$$$$$$$$$$$$$$$$$$$ adding list command - command: ', command);
                            phrase = command.rankingPhrase.phrase;
                            suggestedCommand = {
                                text: phrase,
                                name: result.name,
                                id: null,
                                type: command.action.type,
                                command: command,
                                config: command.action.results ? command.action.results[0] : null //config
                            };
                            if (command.action.status === 'SUCCESS') {
                                suggestedCommands.push(suggestedCommand);                                
                            } else {
                                suggestedAlternatives.push(suggestedCommand);
                            }
                        }
                    } 
                });
            }
            
            /*
            var existingCommands = component.get('v.commands');
            existingCommands.forEach(function(existingCommand) {
                console.warn('existingCommand: ', existingCommand); 
            });
            */
            
            if (suggestedCommands && suggestedCommands.length > 0) {

                self.setCommands(component, suggestedCommands);
                
                if (executeFirstMatchingCommand === true) {
                	var command = suggestedCommands[0];
    	            self.executeCommand(component, 0, command.type, command.id);
        	        self.sayResponse(component, command);
                }
            }
/*            
            
            console.warn('suggestedCommands: ', suggestedCommands);
            console.warn('suggestedAlternatives: ', suggestedAlternatives);
            
            var recurring = component.get('v.recurring');
            
            if (suggestedCommands && suggestedCommands.length > 0) {
	            //component.set('v.commands', suggestedCommands);
                self.setCommands(component, suggestedCommands);
                if (executeFirstMatchingCommand === true) {
                	var command = suggestedCommands[0];
	                //console.warn('executing command: ', command);
    	            self.executeCommand(component, 0, command.type, command.id);
        	        self.sayResponse(component, command);
                } else {
                    // What to say here?
		            //component.set('v.suggestedCommands', suggestedCommands);
                    self.setSuggestedCommands(component, suggestedCommands);
                }
            } else if (suggestedAlternatives && suggestedAlternatives.length > 0) {
                self.setSuggestedCommands(component, suggestedAlternatives);
                self.setCommands(component, suggestedAlternatives);
				//component.set('v.suggestedCommands', suggestedAlternatives);
				//component.set('v.commands', suggestedAlternatives);
				//self.sayResponse(component, command);
				//
                if (recurring === true) {
                    self.startDictation(component);
                }
            } else {
                // Default mesasge!
                if (recurring === true) {
                    self.startDictation(component);
                }
            }
*/
            
        });
    },
    
    executeCommand: function(component, index, type, id) {
        //console.warn('executeCommand: ', index, type, id);
		var self = this;
        var commands = component.get('v.commands');
		var command = commands[index];        

        //console.warn('executeCommand: ', command);
        
        /*
        var config = command.config; //command.action.results[0];
        console.warn('config: ', config);

        var criteria = config.criteria;
        console.warn('criteria: ', criteria);
        
        */
        
        // NOTE: The case for the field names may be inconsistent
        
        function callback(err, result) {
            //console.warn('executeCommand callback: ', err, result);
            
            var suggestedCommands = result.suggestedCommands;            
            //console.warn('suggestedCommands: ', suggestedCommands);
            
            self.setSuggestedCommands(component, suggestedCommands);
            self.setCommands(component, suggestedCommands);
            
            self.reset(component);
        }
        
        var success = true;
		var state = 'suggest';
        
        if (type === 'NLQ') {
            state = 'analytics_query';
        }        
        
        if (type === 'NLQ') {
            self.showNLQ(component, command, callback);
        } else if (type === 'ViewAnalyticsDashboard') {
            self.showDashboard(component, command, callback);
        } else if (type === 'GoToPage') {
            self.showDashboardPage(component, command, callback);
        } else if (type === 'FilterAnalyticsDashboard') {
            self.filterDashboard(component, command, function(err, result) {
                //console.warn('filterDashboard returned: ', err, result);
                self.listFieldValues(component, command, true, function(err, result) {
                    // Add reset filter here!
                    callback(err, result);
                });
            });
        } else if (type === 'SelectAnalyticsDashboard') {
            self.selectDashboard(component, command, function(err, result) {
                //console.warn('selectDashboard returned: ', err, result);
                self.listFieldValues(component, command, false, function(err, result) {
                    // Add clear selection here!
                    callback(err, result);
                });                
            });
        } else if (type === 'ResetAnalyticsFilter') {
            self.filterDashboard(component, command, function(err, result) {
                //console.warn('filterDashboard returned: ', err, result);
	            self.listFilterFields(component, command, callback);
            });
        } else if (type === 'ClearAnalyticsSelection') {
            self.selectDashboard(component, command, function(err, result) {
                //console.warn('selectDashboard returned: ', err, result);
	            self.listSelectionFields(component, command, callback);
            });
        } else if (type === 'ListActiveDashboards') {
            self.listActiveDashboards(component, command, callback);
        } else if (type === 'ListFilterFields') {
            self.listFilterFields(component, command, callback);
        } else if (type === 'ListSelectionFields') {
            self.listSelectionFields(component, command, callback);
        } else if (type === 'ListFilterFieldValues') {
            self.listFieldValues(component, command, true, callback);
        } else if (type === 'ListSelectionFieldValues') {
            self.listFieldValues(component, command, false, callback);
        } else if (type === 'NavigateToDashboardPage') {
            self.navigateToDashboardPage(component, command, callback);
        } else if (type === 'OpenLightningFlow') {
            self.showLightningFlow(component, command, callback);
        } else if (type === 'ViewSObject') {
            self.viewRecord(component, command, callback);
        } else if (type === 'EditSObject') {
            self.editRecord(component, command, callback);

        } else if (type === 'ListQuipFolders') {
            self.listQuipFolders(component, command, callback);

        } else if (type === 'OpenQuipFolder') {
            self.openQuipFolder(component, command, callback);

        } else if (type === 'ShowQuipThread') {
            self.showQuipThread(component, command, callback);


        } else if (type === 'ListAllListViews') {
			self.listAllListViews(component, command, callback);
        } else if (type === 'ListListViews') {
			//self.listListViews(component, command, callback);
            var voiceResults = [];
            voiceResults.push({
                transcript: command.text,
                command: command.text,
                confidence: 1.0
            });
            component.set('v.voiceResults', voiceResults);
        } else if (type === 'ShowListViews') {
			//self.showListViews(component, command, callback);
            var voiceResults = [];
            voiceResults.push({
                transcript: command.text,
                command: command.text,
                confidence: 1.0
            });
            component.set('v.voiceResults', voiceResults);              
        } else if (type === 'ShowListView') {
			self.showListView(component, command, callback);
        } else {
            success = false;
            
        }
        
        if (success === true) {
            self.handleDidUnderstand(component, command, state);
        } else {
            self.handleDidNotUnderstand(component, command, 'did_not_understand');
        }
    },
    
    responseMap: {
        'show': 'showing',
        'view': 'viewing',
        'display': 'displaying',
        'edit': 'editing',
        'open': 'opening',
        'filter': 'filtering',
        'exec': 'executing',
        'reset': 'resetting',
        'select': 'selecting',
        'clear': 'clearing'
    },
    
    sayResponse: function(component, command) {
        var self = this;
        var speakOutput = component.get('v.speakOutput');        
        var listening = component.get('v.listening');
        var recurring = component.get('v.recurring');
        var phase = component.get('v.phase');
        //console.warn('sayResponse - phase: ', phase);
            
        if (speakOutput !== true) {
            if (listening === true && recurring === true) {
                setTimeout(function() {
                    //console.warn('calling startDictation from sayResponse');
                    self.startDictation(component);                            
                }, 1000);
            } 
           	return;
        } else {
            
    
            console.warn('sayResponse: ', command);
            
            var self = this;
            
            var voiceProxy = component.find('voiceProxy');
            
            //var outputText = command.type + ' ' + command.name;
            var outputText = command.text;
            
            /* Map for responses */
            for (var key in self.responseMap) {
                outputText = outputText.replace(new RegExp(key), self.responseMap[key]);
            }
            
            var voiceName = component.get('v.voiceName');
            var volume = 1.0;
            var rate = 1.0;
            var pitch = 1.0;
            
            self.stopDictation(component);
            
            var uid = 'Einstein_Assistant_Speech_Synthesis';
            
            voiceProxy.speak(outputText, voiceName, volume, rate, pitch, uid);
            
            // Use timeout until the callbacks work better
            if (listening === true && recurring === true) {
                setTimeout(function() {
                    //console.warn('calling startDictation from sayResponse');
                    self.startDictation(component);                            
                }, 1000);
            }        
        }
        
        
    },
    
    stopVisualization: function(component) {
        component.set('v.showVisualization', false);
    },
    
    startVisualization: function(component) {
        component.set('v.showVisualization', true);    
    },
    
    camelize: function(str, spaces) {
    	var regex1 = new RegExp('(?:^\\w|[A-Z]|\\b\\w)', 'g');
        var regex2 = spaces === true ? '' : new RegExp('\\s+', 'g');
	  	return str.replace(regex1, function(letter, index) {
    		return index === 1 ? letter.toLowerCase() : letter.toUpperCase();
	  	}).replace(regex2, '');
	},

    listAssets: function(component, methodName, callback) {
        //console.warn('listAssets: ', methodName);
        //
        var assetCache = component.get('v.assetCache') || {};
        var assetList = assetCache[methodName];
        if (assetList !== null && typeof assetList !== 'undefined') {
            if (typeof callback === 'function') {
                callback(null, assetList);
            } else {
                return assetList;
            }
            
        } else {
        
            var sdk = component.find("sdk");
            
            var context = {apiVersion: "43"};
            var methodName = methodName;
            var methodParameters = {
            };
            sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
                if (err !== null) {
                    console.error("listAssets error: ", err);
                    if (typeof callback === 'function') {
                        callback(err, null);
                    } else {
                        return err;
                    }
                } else {
                    assetCache[methodName] = data;
                    component.set('v.assetCache', assetCache);
                    if (typeof callback === 'function') {
                        callback(null, data);
                    } else {
                        return data;
                    }
                }
            }));		
            
        }
    },

    listDashboards: function(component, callback) {        
        this.listAssets(component, "listDashboards", function(err, data) {
            callback(err, data ? data.dashboards : null); 
        });
    },
    
    listDatasets: function(component, callback) {
        this.listAssets(component, "listDatasets", function(err, data) {
            callback(err, data ? data.datasets : null); 
        });
    },
    
    listLenses: function(component, callback) {
        this.listAssets(component, "listLenses", function(err, data) {
            callback(err, data ? data.lenses : null); 
        });
    },
    
    matchCommand: function(component, value) {
        var self = this;
        var matchValue = value.toLowerCase(); // For matching with map
        matchValue = matchValue.trim();
		var baseCommandMap = component.get('v.baseCommandMap');
		var commandMap = component.get('v.commandMap');
        var commands = []; //component.get('v.commands');
        //console.warn('value: ', value, value.length);
        if (typeof value === 'undefined' || value === null || value.length === 0) {
            // Reset to the base commands
            for (var word in baseCommandMap) {
                command = baseCommandMap[word];
                commands.push(command);
            }
			component.set('v.commands', commands);                        
			component.set('v.commandMap', baseCommandMap);                        
        } else {
            var matchWords = [];
            var matchWord = commandMap[matchValue];
            if (matchWord) {
                console.warn('full match: ', matchWord);
                self.getHints(component, value);
            } else {
                var match = '';
                var command = null;
                matchWord = null;
                for (var word in commandMap) {
                    command = commandMap[word];
                    console.warn('word: ', word, ' - matchValue: ', matchValue, word.indexOf(matchValue));
                    //if (word.indexOf(matchValue) === 0) {
                    if (matchValue.indexOf(word) === 0) {
                        commands.push(command);
                        matchWords.push(word);
                        if (word.length - matchValue.length < word.length - match.length) {
                            match = matchValue;
                            matchWord = word;
				            console.warn('matchWord: ', matchWord);
                        }
                    }                
                }
                
                component.set('v.commands', commands);
                
            }
            
            console.warn('matchWords: ', matchWords, matchWords.length);
            if (matchWords.length > 0) {
                matchWords.forEach(function(word, i) {
                    //console.warn('matchWord ', i, word); 
                });
            }
            if (typeof matchWord !== 'undefined' && matchWord !== null) {
                
            }
        }
    },
        
    /* This really doesn't work well! */
    getHints: function(component, inputText) {

        var self = this;
        
        var proxy = component.find('proxy');


        //var inputText = component.get('v.inputText');

        //console.warn('inputText: ', inputText);
        
        var commands = component.get('v.commands');
        var segments = component.get('v.segments');
        var segmentCount = 0;
        for (var key in segments) {
            segmentCount++;
        }
 
        console.warn('inputText hint: ', inputText);
        
        var inputTokens = inputText.split(' ');
        
        var hintParam = inputText;
        
        var getSuggestions = false;
        if (typeof commands === 'undefined' || commands === null || commands.length <= 0) {
            getSuggestions = true;
        }
        
        if (inputText.length <= 0) { // || inputText[inputText.length - 1] === ' ') {
            getSuggestions = true;
        }
        
        if (inputText.length > 0) {
            getSuggestions = true;
        }

        console.warn('######################### getSuggestions: ', getSuggestions);
        
        if (getSuggestions === true) {
            //console.warn('######################### hintParam: (' + hintParam + ')', hintParam.length);

            var minIndex = inputTokens.length;
            var maxIndex = 100;
            
            var url = '/services/apexrest/eadx/commander/reference';
            url += '?hint=' + hintParam;
            url += '&minIndex='+ minIndex + '&maxIndex=' + maxIndex;
            var method = 'GET';
            
            //console.warn('url: ', url);
            
            var body = null;
            
            proxy.exec(url, method, body, function(response) {
                //console.warn('response: ', response);
                //response = JSON.parse(JSON.stringify(response));
                console.warn('getHints JSON response: ', JSON.parse(JSON.stringify(response)));
                if (response && response.body) {
                    var commandReference = response.body;
                    var segments = commandReference.segments;
                    var command = null;
                    commands = [];
                    var commandMap = {};
                    //console.warn('segments: ', segments);
                    if (segments) {
                        var segment = segments[commandReference.minIndex];
                        if (segment) {
                            segment.forEach(function(word) {
                                //console.warn('word: ', word);
                                command = {
                                    text: inputText + ' ' + word
                                };
                                commands.push(command);
                                commandMap[command.text.toLowerCase()] = command;
                            });
                        } else {
                            //console.warn('NO SEGMENT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                            component.set('v.useCommands', true);
                            self.getCommands(component, inputText);
                        }
                        
                    }
                    component.set('v.commands', commands);
                    component.set('v.commandMap', commandMap);
                }
            });

                    
        }

    },
    
    getCommandReference: function(component, callback) {
        var self = this;
        var proxy = component.find('proxy');
        if (proxy.get('v.ready') !== true) {
            setTimeout(function() {
                self.getCommandReference(component, callback);
            }, 100);
        } else {
                
            var minIndex = 0;
            var maxIndex = 100;
            
            var url = '/services/apexrest/eadx/commander/reference';
            url += '?minIndex='+ minIndex + '&maxIndex=' + maxIndex;
            var method = 'GET';
            
            var body = null;
            
            proxy.exec(url, method, body, function(response) {
                //console.warn('response: ', response);
                //response = JSON.parse(JSON.stringify(response));
                //console.warn('JSON response: ', response);
                if (response && response.body) {
                    var commandReference = response.body;
                    component.set('v.commandReference', commandReference);
                    var commands = [];
                    var commandMap = {};
                    var baseCommandMap = {};
                  	var command = null;
                    if (commandReference.segments && commandReference.segments.length > 0) {
	                    var segment = commandReference.segments[0];
                        segment.forEach(function(word) {
                            command = {
                                text: word
                            };
                            commands.push(command);
                            commandMap[word.toLowerCase()] = command;
                            baseCommandMap[word.toLowerCase()] = command;
                        });                        
                    }
                    component.set('v.commands', commands);
                    component.set('v.commandMap', commandMap);
                    component.set('v.baseCommandMap', baseCommandMap);
                }
            });
        }        
    },
    
    
    getCommands: function(component, inputText, callback) {
    
        //var inputText = component.get('v.inputText');

        //console.warn('getCommands: ', inputText);
                
        if (typeof inputText === 'undefined' || inputText === null || inputText.length === 0) {
            console.warn('no inputText!!!!!!!!!!!!!!');
            return;
        }
             
        inputText = inputText.replace(new RegExp('buy', 'g'), 'by');
        inputText = inputText.replace(new RegExp('Buy', 'g'), 'by');
        inputText = inputText.replace(new RegExp('bye', 'g'), 'by');
        inputText = inputText.replace(new RegExp('Bye', 'g'), 'by');
        
        var commandPhrase = inputText.split('+');
        
        //console.warn('commandPhrase: ', commandPhrase);
        
        var statusParam = null;
        var limitParam = '10';
        
        
        var proxy = component.find('proxy');
        var self = this;
        var url = '/services/apexrest/eadx/commander?c=' + commandPhrase;
        url += statusParam ? '&status='+ statusParam : '';
        url += limitParam ? '&limit=' + limitParam : '';
        var method = 'GET';
        
        var body = null;
        
        //console.warn('calling proxy.exec with: ', url, method, body);
        
        proxy.exec(url, method, body, function(response) {
            //console.warn('response: ', response);
            //response = JSON.parse(JSON.stringify(response));
            //console.warn('getCommands JSON response: ', JSON.parse(JSON.stringify(response)));

            if (response && response.body) {
                var commandPhrase = response.body.command;
                var commands = response.body.commands;
                var suggestedCommand = null;
                var suggestedCommands = [];
                commands.forEach(function(command) {
                    //console.warn('command: ', command);
                    if (command.action.status === 'SUCCESS') {
                        command.action.results.forEach(function(result) {
                            suggestedCommand = {
                                text: command.rankingPhrase.phrase + ' ' + result.name,
                                name: result.name,
                                id: result.id,
                                type: command.action.type,
                                command: command
                            };
                            suggestedCommands.push(suggestedCommand);
                        });
                    }
                });
                //component.set('v.commands', suggestedCommands);

                if (typeof callback === 'function') {
                    callback(commands);
                }
            } else if (response.status === 500) {
                console.error(response.statusText);
                callback(null);
            }
        });
        
    },
    
    
    handlePlatformEvent: function(component, event) {
        
        var self = this;
        
		/*        
        var workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            console.warn('focused tab info: ', response);
        })
        .catch(function(error) {
            console.log(error);
        });
        */
        
        var p = event.getParam('payload');
        //console.warn('reInventDemoTabrHelper.handlePlatformEvent: ', p);
        var type = p.eadx__type__c;
        var target = p.eadx__target__c;
        var payload = p.eadx__payload__c;
        
        console.warn('type: ', type);
        console.warn('target: ', target);
        console.warn('payload: ', payload);
        
        if (payload !== null && typeof payload !== 'undefined') {
            payload = typeof payload === 'object' ? payload : JSON.parse(payload);
            var objectType = payload.objectType;
            var id = payload.id;
            var isListView = (typeof payload.listView !== 'undefined' && payload.listView !== null) ? payload.listView : false;
            
            console.warn('objectType: ', objectType);
            console.warn('id: ', id);
            console.warn('isListView: ', isListView);
            
            component.set('v.objectType', objectType);
            
            if (type === 'show') {
                if (isListView === true) {
                    this.showListView(component, {recordId: id, objectType: objectType});
                } else if (objectType === 'dashboard') {
                    this.showDashboard(component, {dashboardId: id});                
                } else if (objectType === 'document' || objectType === 'spreadsheet') {
                    component.set('v.threadId', id);
                    this.showQuipThread(component, {threadId: id});                
                } else {
                    this.viewRecord(component, {recordId: id});
                }
            } else if (type === 'filter_dashboard') {
                console.warn('filter!!!!!!!');
                console.warn('filter: ', payload.filter);
                console.warn('filter: ', JSON.stringify(payload.filter, null, 2));
                
                // FOR TESTING!!!!!!!!!!!!
                payload.filter.datasets['eadx_opportunity'] = payload.filter.datasets['opportunity'];
                                
                var dataset = null;
                
                for (var name in payload.filter.datasets) {
                    dataset = payload.filter.datasets[name];
                    dataset.forEach(function(filter) {
                        filter.fields.forEach(function(field, i) {
                            filter.fields[i] = self.camelize(field, false);
                        });
                        filter.filter.values.forEach(function(value, i) {
                            filter.filter.values[i] = self.camelize(value, true);
                        });
                    });
                }
                

                console.warn('filter: ', JSON.stringify(payload.filter, null, 2));
                
                /*
                payload.filter = {
                    datasets:{
                        "eadx__opportunity":[
                            {
                                fields:[
                                    "ForecastCategoryName"
                                ],
                                filter:{
                                    operator:"in",
                                    values:[
                                        "Closed"
                                    ]
                                }
                            }
                        ]
                    }
                };
                */
                
                var evt = $A.get('e.wave:update');
                var params = {
                    value: JSON.stringify(payload.filter),
                    id: payload.id,
                    type: payload.objectType
                };
                console.warn('params: ', JSON.stringify(payload, null, 2));
                evt.setParams(params);
                evt.fire();
            } else if (type === 'select_dashboard') {
                console.warn('select!!!!!!!');
                console.warn('selection: ', payload.selection);
                console.warn('selection: ', JSON.stringify(payload.selection, null, 2));
                
                // FOR TESTING!!!!!!!!!!!!
                payload.selection.datasets['eadx_opportunity'] = payload.selection.datasets['opportunity'];
                
                var dataset = null;
                
                for (var name in payload.selection.datasets) {
                    dataset = payload.selection.datasets[name];
                    dataset.forEach(function(selection) {
                        selection.fields.forEach(function(field, i) {
                            selection.fields[i] = self.camelize(field, false);
                        });
                        selection.selection.forEach(function(value, i) {
                            selection.selection[i] = self.camelize(value, true);
                        });
                    });
                }

                console.warn('selection: ', JSON.stringify(payload.selection, null, 2));
                
                /*
                payload.selection = {
                    datasets:{
                        "eadx__opportunity":[
                            {
                                fields:[
                                    "ForecastCategoryName"
                                ],
                                selection:["Closed"]
                            }
                        ]
                    }
                };
                
				*/

                var evt = $A.get('e.wave:update');
                var params = {
                    value: JSON.stringify(payload.selection),
                    id: payload.id,
                    type: payload.objectType
                };
                console.warn('params: ', JSON.stringify(payload, null, 2));
                evt.setParams(params);
                evt.fire();
            }
                
        }
        
        //this.updateSelection(component, true, target);
    },

    listAllListViews: function(component, command, callback) {
        var self = this;
        var config = command.config;        
        console.warn('listAllListViews - config: ', config);
        
        return;
        
        var listViewId = config.listViewId || config.id || config.Id;
        var listViewName = config.listViewName || config.name || config.Name;
        var objectType = config.objectType || config.type || config.Type;

        objectType = objectType.substring(0, 1).toUpperCase() + objectType.substring(1).toLowerCase();

        var evt = $A.get("e.force:navigateToList");
        //console.warn('evt: ', evt);
       	evt.setParams({
            listViewId: listViewId,
            listViewName: listViewName,
            scope: objectType
        });
        evt.fire();
    },

    listListViews: function(component, command, callback) {
        var self = this;
        var config = command.config;
        console.warn('listListViews - config: ', config);
        
    },

    showListViews: function(component, command, callback) {
        var self = this;
        var config = command.config;
        //console.warn('showListViews - config: ', config);
        
    },
    
    showListView: function(component, command, callback) {
        //console.warn('showListView - config: ', config);
        
        var self = this;
        var config = command.config;
        
        /*
		result.put('Id', listView.Id);
        result.put('Name', listView.Name);
        result.put('NamespacePrefix', listView.NamespacePrefix);
        result.put('DeveloperName', listView.DeveloperName);
        result.put('SObjectType', listView.SObjectType);
        */
        var listViewId = null;
        var listViewName = null;
        var objectType = null;
        
        var lcname = null;
        for (var name in config) {
            lcname = name.toLowerCase();
            listViewId = lcname === 'listviewid' || lcname === 'id' ? config[name] : listViewId;
            listViewName = lcname === 'listviewname' || lcname === 'name' ? config[name] : listViewName;
            objectType = lcname === 'sobjecttype' || lcname === 'objecttype' || lcname === 'type'? config[name] : objectType;
        }
		/*            
        var listViewId = config.listViewId || config.id || config.Id;
        var listViewName = config.listViewName || config.name || config.Name;
        var objectType = config.objectType || config.SObjectType || config.sObjectType || config. sobjectType || config.sobjecttype || config.type || config.Type;
		*/
            
		objectType = objectType ? objectType.substring(0, 1).toUpperCase() + objectType.substring(1).toLowerCase() : null;

        //console.warn('listViewId: ', listViewId);
        //console.warn('listViewName: ', listViewName);
        //console.warn('objectType: ', objectType);
        var evt = $A.get("e.force:navigateToList");
        //console.warn('evt: ', evt);
       	evt.setParams({
            listViewId: listViewId,
            listViewName: listViewName,
            scope: objectType
        });
        evt.fire();
    },
    
  	viewRecord: function(component, command, callback) {
        
        var self = this;
        var config = command.config;
        var recordId = config.recordId || config.id || config.Id;
        
        var navService = component.find("navService");
        
        var pageReference = {
            type: 'standard__recordPage',
            attributes: {
                actionName: 'view',
                recordId: recordId
            }
        };        

        navService.generateUrl(pageReference)
        .then($A.getCallback(function(url) {
            console.warn('url: ', url);
            
            navService.navigate(pageReference);        
            
            var suggestedCommands = [];
            
            if (typeof callback === 'function') {
                callback(null, {command: command, suggestedCommands: suggestedCommands});
            }
        }), $A.getCallback(function(error) {
            console.warn('error: ', error);
            
            if (typeof callback === 'function') {
                callback(error, {command: command});
            }
        }));
        
    },

	editRecord: function(component, command, callback) {
        
        var self = this;
        
        var config = command.config;
        
        var recordId = config.recordId || config.id || config.Id;        
        
        var navService = component.find("navService");
        
        var pageReference = {
            type: 'standard__recordPage',
            attributes: {
                actionName: 'edit',
                recordId: recordId
            }
        };        

        navService.generateUrl(pageReference)
        .then($A.getCallback(function(url) {
            console.warn('url: ', url);
            
            navService.navigate(pageReference);        
            
            var suggestedCommands = [];
            
            if (typeof callback === 'function') {
                callback(null, {command: command, suggestedCommands: suggestedCommands});
            }
        }), $A.getCallback(function(error) {
            console.warn('error: ', error);
            
            if (typeof callback === 'function') {
                callback(error, {command: command});
            }
        }));
    },
    
    listQuipFolders: function(component, command, callback) {
        console.warn('listQuipFolders - command: ', command);
        var self = this;
        
        var config = command.config;
        var _command = command.command;
        
        if (_command && _command.action && _command.action.results) {
	        var folders = _command.action.results;
            console.warn('folders: ', folders);
            
            var suggestedCommands = [];
            var suggestedCommand = null;
            var currentCommand = null;
            var phrase = null;
            
            folders.forEach(function(folder) {
                console.warn('folder: ', folder);
                
                currentCommand = {
                    action: {
                        results: [
                            {
                                id: folder.folder.id
                            }
                        ],
                        type: 'OpenQuipFolder'
                    },
                    name: 'OpenQuipFolder',
                    config: {
                        folderId: folder.folder.id
                    }
                };
                
                console.warn('currentCommand: ', currentCommand);
                
                suggestedCommand = {
                    text: 'Open Quip Folder ' + folder.folder.title,
                    name: folder.folder.id,
                    id: folder.folder.id,
                    type: 'OpenQuipFolder',
                    command: currentCommand,
                    config: currentCommand.config
                };
                suggestedCommands.push(suggestedCommand);
            });
            
            if (typeof callback === 'function') {
                callback(null, {command: command, suggestedCommands: suggestedCommands});
            }
        }
    },

	openQuipFolder: function(component, command, callback) {
        console.warn('openQuipFolder');
        var self = this;
        
        var config = command.config;
        var _command = command.command;
        
        if (_command && _command.action && _command.action.results) {
	        var documents = _command.action.results;
            console.warn('documents: ', documents);
            
            var suggestedCommands = [];
            var suggestedCommand = null;
            var currentCommand = null;
            var phrase = null;
            
            documents.forEach(function(document) {
                console.warn('document: ', document);
                
                currentCommand = {
                    action: {
                        results: [
                            {
                                id: document.folder ? documents.folder.id : document.thread.id
                            }
                        ],
                        type: document.folder ? 'OpenQuipFolder' : 'ShowQuipThread'
                    },
                    name: document.folder ? 'OpenQuipFolder' : 'ShowQuipThread',
                    config: {
                        folderId: document.folder ? documents.folder.id : document.thread.id
                    }
                };
                
                console.warn('currentCommand: ', currentCommand);
                
                suggestedCommand = {
                    text: document.folder ? 'Open Quip Folder ' + document.folder.title : 'Show Quip Doc ' + document.thread.title,
                    name: document.folder ? documents.folder.id : document.thread.id,
                    id: document.folder ? documents.folder.id : document.thread.id,
                    type: document.folder ? 'OpenQuipFolder' : 'ShowQuipThread',
                    command: currentCommand,
                    config: currentCommand.config
                };
                suggestedCommands.push(suggestedCommand);
            });
            
            if (typeof callback === 'function') {
                callback(null, {command: command, suggestedCommands: suggestedCommands});
            }
        }
    },

    showQuipThread: function(component, command, callback) {
        
        var self = this;
        
        var config = command.config;
        
        var threadId = config.threadId || config.id || config.Id;

        console.warn('showQuipThread: ', threadId);
        
        var workspaceAPI = component.find("workspace");
        workspaceAPI.openTab({
            url: '#/n/eadx__Quip_Viewer',
            focus: true
        }).then(function(response) {
            workspaceAPI.focusTab({
                tabId: response
            });
            var evt = $A.get('e.c:showQuipThread');
            var params = {
                threadId: threadId,
                tabId: response
            };
            evt.setParams(params);
            evt.fire();
		});
    },
    
    showLightningFlow: function(component, command, callback) {
        
    	console.warn('showLightningFlow: ', config);
        
        var self = this;
    	
        var config = command.config;
        
        var navService = component.find("navService");
                
        var pageReference = {
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'eadx__Lightning_Flows'
            },
            state: {
                flowName: config.flowName
            }
        };        

		// For debug        
        navService.generateUrl(pageReference)
        .then($A.getCallback(function(url) {
            console.warn('url: ', url);
            
			navService.navigate(pageReference);
            
            if (typeof callback === 'function') {
                callback(null, command);
            }
            
        }), $A.getCallback(function(error) {
            console.warn('error: ', error);
            
            if (typeof callback === 'function') {
                callback(error, command);
            }
        }));
        
	},
    
    generateQuery: function(component, fields, callback) {
        
        var datasetId = null;
        var groupFields = [];
        var sumFields = [];
        fields.forEach(function(field) {
            if (typeof field.dataset === 'undefined' || field.dataset === null) {
                console.error('no dataset on field: ', field);
            } else {
                datasetId = field.dataset.id + '/' + field.dataset.currentVersionId;
                if (field.type === 'groupBy') {
                    groupFields.push(field);
                } else if (field.type === 'sum') {
                    sumFields.push(field);
                }
            }
        });
        
        //console.warn('datasetId: ', datasetId);
        
        var saql = '';
		saql += 'q = load "' + datasetId + '";\n';
                    
		var type = null;
        var source = null;
        var fieldDetails = null;
        groupFields.forEach(function(field) {
            if (typeof field.source === 'undefined' || field.source === null) {
                console.error('no source on field: ', field);
            } else {
                source = field.source;
                fieldDetails = source[source.type];
                saql += 'q = group q by (';
                saql += "'" + fieldDetails.field + "'";
                saql += ');\n';
            }
        });
        
        var delim = ' ';
        saql += 'q = foreach q generate'
        var i = 0;
        var label = null;
        var name = null;

        // Create orderBy for use later
        var orderBy = 'q = order q by ('; //('Industry' asc);
        
        fields.forEach(function(field) {
            type = field.type;
            if (typeof field.source === 'undefined' || field.source == null) {
                console.error('no source on field: ', field);
            } else {
                source = field.source;
                fieldDetails = source[source.type];
                if (type === 'sum') {
                    if (fieldDetails.field) {
                        name = 'sum(' + fieldDetails.field + ')';
                        label = 'sum_' + fieldDetails.label;
                    } else if (fieldDetails.fields) {
                        for (var key in fieldDetails.fields) {
                            if (fieldDetails.fields[key] === field.name) {
                                name = 'sum(' + field.name + ')';
                                label = 'sum_' + fieldDetails.label + ' (' + key + ')';                                
                            }
                        }
                    }
                    saql += delim + name + " as '" + label + "'";
                    orderBy += delim + "'" + label + "' asc";
                    delim = ', ';            
                } else {
                    if (fieldDetails.field) {
                        name = fieldDetails.field;
                        label = fieldDetails.label;
                    } else if (fieldDetails.fields) {
                        for (var key in fieldDetails.fields) {
                            if (fieldDetails.fields[key] === field.name) {
                                name = field.name; //fieldDetails.fields[fieldDetails.name];
                                label = fieldDetails.label + ' (' + key + ')';                                
                            }
                        }
                    }
                    saql += delim + "'" + name + "' as '" + label + "'";
                    orderBy += delim + "'" + label + "' asc";
                    delim = ', ';            
                }                
            }            
        });

                                    
        saql += ";\n";

        // Close and add orderBy
        orderBy += ");\n";        
        saql += orderBy;

        
        var limit = 2000;
        
        saql += "q = limit q " + limit + ";";
                                    
        //console.warn('saql: ', saql);
        
        if (typeof callback === 'function') {
            callback(null, saql);
        }
    },
    
    showNLQ: function(component, command, callback) {
        //console.warn('showNLQ: ', command);
        var self = this;
        
        if (command.config) {
            var config = command.config;
            //console.warn('config: ', config);
      		var criteria = config.criteria;
            //console.warn('criteria: ', criteria);
            
            var lccriteria = criteria.toLowerCase();

            var fields = [];
            
            // This is just to mock some things up, not a real grammar parser, etc.!!!!
            if (lccriteria.indexOf('by') >= 0) {
				var tokens = lccriteria.split('by');
                //console.warn('tokens: ', tokens);
                // Left side is sum
                fields.push({
                    name: tokens[0].trim(),
                    type: 'sum',
                    source: null,
                    dataset: null
                });
                // Right side is group by
               	tokens = tokens[1].split('and');
                tokens.forEach(function(token) {
                    fields.push({
                        name: token.trim(),
                        type: 'groupBy',
                        source: null,
                        dataset: null
                    });
                    
                });
            } else if (lccriteria.indexOf('and') >= 0) {
				var tokens = lccriteria.split('and');                
                console.warn('tokens: ', tokens);
            }
            
            var tokens = criteria.split(' ');
            
            self.getActiveDashboards(component, function(err, dashboards) {
                //console.warn('getActiveDashboards returned: ', err, dashboards);
                var selectedPage = null;
                var selectedDashboard = null;
                if (dashboards) {
                    dashboards.forEach(function(dashboard) {
                        //console.warn('dashboard: ', dashboard);

                        self.getDashboardDetails(component, dashboard.id, function(err, dashboard, datasets, datasetsMap, datasetFieldsMap) {
                            /*
                            console.warn('getDashboardDetails returned: ', err);
                            console.warn('dashboard: ', JSON.parse(JSON.stringify(dashboard)));
                            console.warn('datasets: ', JSON.parse(JSON.stringify(datasets)));
                            console.warn('datasetsMap: ', JSON.parse(JSON.stringify(datasetsMap)));
                            console.warn('datasetFieldsMap: ', JSON.parse(JSON.stringify(datasetFieldsMap)));
							*/
                            
                            for (var datasetName in datasetFieldsMap) {
                                var datasetDetails = datasetsMap[datasetName];
                                var xmd = datasetFieldsMap[datasetName];
                                
                                var fieldMap = self.parseXMD(component, xmd);
                                //console.warn('fieldMap: ', fieldMap);
                                
                                var match = function(lcFieldName, f) {
                                    //console.warn('match: ', lcFieldName, f);
                                    var fd = f[f.type];
                                    var field = null;
                                    if (fd.label && field === null) {
                                        //console.warn('fd.label: ', fd.label);
                                        field = fd.label.toLowerCase() === lcFieldName ? f : field;
                                    }
                                    if (fd.alias && field === null) {
                                        //console.warn('fd.alias: ', fd.alias);
                                        field = fd.alias.toLowerCase() === lcFieldName ? f : field;
                                    }
                                    if (fd.origin && field === null) {
                                        //console.warn('fd.origin: ', fd.origin);
                                        field = fd.origin.toLowerCase() === lcFieldName ? f : field;
                                    }
                                    if (fd.fullyQualifiedName && field === null) {
                                        //console.warn('fd.fullyQualifiedName: ', fd.fullyQualifiedName);
                                        field = fd.fullyQualifiedName.toLowerCase() === lcFieldName ? f : field;
                                    }
                                    if (fd.description && field === null) {
                                        //console.warn('fd.description: ', fd.description);
                                        field = fd.description.toLowerCase() === lcFieldName ? f : field;
                                    }
                                    //console.warn('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$: returning field: ', field);
                                    return field;
                                }
                                
                                var lcFieldName = null;
                                fields.forEach(function(field) {
                                    //console.warn('field: ', field, field.source);
                                    lcFieldName = field.name.toLowerCase();
                                    
                                    var f = null;
                                    var source = null;
                                    for (var name in fieldMap) {
                                        f = fieldMap[name];
                                        //console.warn('f: ', f);
                                        source = match(lcFieldName, f);
                                        
                                        if (field.source === null || typeof field.source === 'undefined') {
											if (source !== null && typeof source !== 'undefined') {
                                                field.source = source;
                                                field.dataset = datasetDetails;
                                            }
                                        }
                                    }
                                });
                                
                            }
                            
                            self.generateQuery(component, fields, function(err, saql) {
                                //console.warn('generateQuery returned: ', err, saql);
                                
                                self.updateNLQDashboard(component, saql);
                                
                                // No need to exec the query as the nlqDashboard component will handle it

                                /*
                                self.execQuery(component, saql, function(err, result) {
                                    if (err) {
                                        console.error('Query error: ', err[0]);
                                        return;
                                    }
                                    
                                    if (typeof result === 'string') {
                                        result = JSON.parse(result);
                                    } else {
                                        result = result;
                                    }
                                    
                                    console.warn('result: ', result);
                                    
                                    if (result.results && result.results.records) {
                                        var records = result.results.records;                        
                                        //console.warn('records: ', records);
                                        //
                                    }
                                });
                                */
                                
                            });
                        });
                    });
                }
            });
        }
    },
    
    updateNLQDashboard: function(component, saql) {
        /*
        var nlqContainer = component.find('nlqContainer');
        $A.util.removeClass(nlqContainer, 'hide');
        */
        var nlqDashboard = component.find('nlqDashboard');
        nlqDashboard.updateDashboard(saql);
    },
    
    showDashboard: function(component, command, callback) {
        console.warn('showDashboard: ', command);
        var self = this;
        
        if (command.config && command.config.id) {
            
            var config = command.config;
                    
            var dashboardId = config.id;
            
            var navService = component.find("navService");
                    
            var pageReference = {
                type: 'standard__component',
                attributes: {
                    componentName: 'eadx__dashboardTab'
                },
                state: {
                    dashboardId: dashboardId
                }
            };        

            self.getSuggestionsByType(component, command.type, function(err, suggestedCommands) {
      
                navService.generateUrl(pageReference)
                .then($A.getCallback(function(url) {
                    console.warn('url: ', url);
                    
                    navService.navigate(pageReference);        
                    
                    if (typeof callback === 'function') {
                        callback(null, {command: command, suggestedCommands: suggestedCommands});
                    }
                }), $A.getCallback(function(error) {
                    console.warn('error: ', error);
                    
                    if (typeof callback === 'function') {
                        callback({error: 'Dashboard not found'}, {command: command});
                    }
                }));
                
            });
    
            
        } else {
            if (typeof callback === 'function') {
                callback({error: 'Dashboard not found'}, {command: command});
            }
            
        }
        
    },    

    
    navigateToDashboardPage: function(component, command, callback) {
        
        var self = this;
    	
        var config = command.config;

    	//console.warn('navigateToDashboardPage: ', config);
        

        if (command.config && command.config.pageName) {
            
            var config = command.config;
                    
            //console.warn('config: ', config);
            
            self.getActiveDashboards(component, function(err, dashboards) {
                //console.warn('getActiveDashboards returned: ', err, dashboards);
                var selectedPage = null;
                var selectedDashboard = null;
                if (dashboards) {
                    dashboards.forEach(function(dashboard) {
                        //console.warn('dashboard: ', dashboard);
                        self.describeDashboard(component, dashboard.id, function(err, dashboardDetails) {
                            if (dashboardDetails.state && dashboardDetails.state.gridLayouts) {
                                dashboardDetails.state.gridLayouts.forEach(function(gridLayout) {
                                    if (gridLayout.pages) {
                                        gridLayout.pages.forEach(function(page) {
                                            if (page.label.toLowerCase() === config.pageName.toLowerCase()) {
                                                selectedDashboard = dashboardDetails;
                                                selectedPage = page;
                                            }
                                        });
                                        
                                        //console.warn('selectedDashboard: ', selectedDashboard);
                                        //console.warn('selectedPage: ', selectedPage);
                                        navigateToPage(selectedDashboard, selectedPage);
                                        
                                    } 
                                });
                            }
                        });
                    });
                }
            });
            
        }
        
        function navigateToPage(selectedDashboard, selectedPage) {
            //console.warn('inner function navigateToPage');
            //console.warn('selectedDashboard: ', selectedDashboard);
            //console.warn('selectedPage: ', selectedPage);
            if (selectedPage !== null && typeof selectedPage !== 'undefined') {
        
                var filter = {
                    datasets:{
                        "Regional_Sales":[
                            {
                                fields:[
                                    "Billing_Country"
                                ],
                                filter:{
                                    operator:"in",
                                    values:[
                                        "USA"
                                    ]
                                }
                            }
                        ]
                    }
                };
        
                //console.warn('filter: ', filter);
                
                var json = JSON.stringify(filter, null, 2);
                //console.warn('filter json: ', json);
                
                var developerName = (selectedDashboard.namespace ? selectedDashboard.namespace + '__' : '') + selectedDashboard.name;
                //console.warn("developerName: ", developerName);
                var dashboardId = selectedDashboard.id;
                //console.warn("dashboardId: ", dashboardId);
                
                // How to determine which to use?
                
                var pageId = selectedPage.name;
                //console.warn("pageId: ", pageId);
                var evt = $A.get('e.wave:update');
                var params = {
                    value: json,
                    id: dashboardId, // developerName,
                    pageid: pageId,
                    type: "dashboard"
                };
            	//console.warn('params: ', params, JSON.stringify(params, null, 2));
                evt.setParams(params);
                evt.fire();
            }
        }

        
	},
    
    // Older, remove!
    showDashboardPage: function(component, command, callback) {
        console.warn('showDashboardPage: ', command);
        var self = this;
        
        if (command.config && command.config.pageName) {
            
            var config = command.config;
                    
            console.warn('config: ', config);
            
            self.getActiveDashboards(component, function(err, dashboards) {
                //console.warn('getActiveDashboards returned: ', err, dashboards);
                var selectedPage = null;
                var selectedDashboard = null;
                if (dashboards) {
                    dashboards.forEach(function(dashboard) {
                        //console.warn('dashboard: ', dashboard);
                        self.describeDashboard(component, dashboard.id, function(err, dashboardDetails) {
                            if (dashboardDetails.state && dashboardDetails.state.gridLayouts) {
                                dashboardDetails.state.gridLayouts.forEach(function(gridLayout) {
                                    if (gridLayout.pages) {
                                        gridLayout.pages.forEach(function(page) {
                                            if (page.label.toLowerCase() === config.pageName.toLowerCase()) {
                                                selectedDashboard = dashboardDetails;
                                                selectedPage = page;
                                                navigateToPage(dashboardDetails, page);
                                            }
                                        });
                                    } 
                                });
                            }
                        });
                    });
                }
            });                                
                                               
            function navigateToPage(selectedDashboard, selectedPage) {
                //console.warn('inner function navigateToPage');
                if (selectedPage !== null && typeof selectedPage !== 'undefined') {
                    //console.warn('selectedDashboard: ', selectedDashboard);
                    //console.warn('selectedPage: ', selectedPage);
                    
                    var navService = component.find("navService");
                            
                    var pageReference = {
                        type: 'standard__navItemPage',
                        attributes: {
                            apiName: 'eadx__Analytics_Dashboards'
                        },
                        state: {
                            dashboardId: selectedDashboard.id,
                            pageName: selectedPage.name
                        }
                    };        
            
                    self.getSuggestionsByType(component, command.type, function(err, suggestedCommands) {
                        
                        // For debug        
                        navService.generateUrl(pageReference)
                        .then($A.getCallback(function(url) {
                            console.warn('url: ', url);
                            
                            navService.navigate(pageReference);        
                            
                            
                            if (typeof callback === 'function') {
                                callback(null, {command: command, suggestedCommands: suggestedCommands});
                            }                        
                        }), $A.getCallback(function(error) {
                            console.warn('error: ', error);
                            
                            if (typeof callback === 'function') {
                                callback(error, {command: command});
                            }
                        }));
                    });
                            
                } else {
                    if (typeof callback === 'function') {
                        callback({error: 'Page not found'}, {command: command});
                    }
                }
            }
        }
        
    },
    
    handleDiscoverResponse: function(component, event) {
		//console.warn('handleDiscoverResponse');
        
        var dashboardDiscoverMap = component.get('v.dashboardDiscoverMap') || {};

        var params = event.getParams();
        var timestamp = Date.now();
        var dashboardId = null;
        var pageName = null;
        if (params.id.indexOf('/') >= 0) {
         	var tokens = params.id.split('/');
            dashboardId = tokens[0];
            if (tokens[1].indexOf('pageId=') >= 0) {
                pageName = tokens[1].split('=')[1];
			}
            
        } else {
            dashboardId = params.id;
        }

        //console.warn('dashboardId: ', dashboardId);
        
        // Prune any old dashboards
        for (var id in dashboardDiscoverMap) {
            discover = dashboardDiscoverMap[id];
            if (discover.timestamp + 6000 < Date.now()) {
                delete dashboardDiscoverMap[id];
            }
        }

        // Ignore the NLQ preview dashboard
        var nlqDashboardId = component.get('v.nlqDashboardId');

        //console.warn('nlqDashboardId: ', nlqDashboardId);
        
        if (dashboardId !== nlqDashboardId) {
            var info = {
                id: dashboardId,
                pageName: pageName,
                isLoaded: params.isLoaded,
                title: params.title,
                type: params.type,
                timestamp: timestamp
            };
            var discover = null;
                        
            dashboardDiscoverMap[info.id] = info;
        }
        
        //console.warn('dashboardDiscoverMap: ', JSON.stringify(dashboardDiscoverMap, null, 2));
        
        component.set('v.dashboardDiscoverMap', dashboardDiscoverMap);
    },    
    
    getActiveDashboards: function(component, callback) {
		var self = this;

        var dashboardDiscoverMap = component.get('v.dashboardDiscoverMap') || {};
        
        self.listDashboards(component, function(err, dashboards) {
            var activeDashboardList = [];
            if (dashboards) {
                dashboards.forEach(function(dashboard) {
                    if (dashboardDiscoverMap[dashboard.id]) {
                        activeDashboardList.push(dashboard);
                    }
                });
            }
            if (typeof callback === 'function') {
                callback(null, activeDashboardList);
            }
        });    
	},
    
    listFieldValues: function(component, command, isFilter, callback) {
		var self = this;
        var config = command.config;        
        //console.warn('voiceUtilityHelper.listFieldValues: ', config);
        
        var fieldName = config.fieldName;
        
        if (fieldName !== null && typeof fieldName !== 'undefined') {

            var dashboardIds = self.getCurrentDashboardIds(component);
            
            // Only handles the first one!
            var dashboardId = dashboardIds[0] || null;
            //console.warn('dashboardId: ', dashboardId);
    
            if (dashboardId !== null && typeof dashboardId !== 'undefined') {
                self.getDashboardDetails(component, dashboardId, function(err, dashboard, datasets, datasetsMap, datasetFieldsMap) {
                    /*
                    console.warn('getDashboardDetails returned: ', err);
                    console.warn('dashboard: ', JSON.parse(JSON.stringify(dashboard)));
                    console.warn('datasets: ', JSON.parse(JSON.stringify(datasets)));
                    console.warn('datasetsMap: ', JSON.parse(JSON.stringify(datasetsMap)));
                    console.warn('datasetFieldsMap: ', JSON.parse(JSON.stringify(datasetFieldsMap)));
            		*/
                    for (var datasetName in datasetFieldsMap) {
                        var datasetDetails = datasetsMap[datasetName];
                        var xmd = datasetFieldsMap[datasetName];
                        
                        var fieldMap = self.parseXMD(component, xmd);
                        //console.warn('fieldMap: ', fieldMap);
                        
                        // Too simplistic, doesn't handle case!
                        //var field = fieldMap[fieldName];
                        //
                        var field = null;
                        var lcFieldName = fieldName.toLowerCase();
                        
                        var match = function(lcFieldName, f) {
                            //console.warn('match: ', lcFieldName, f);
                            var fd = f[f.type];
                            var field = null;
                            if (fd.label) {
                                //console.warn('fd.label: ', fd.label);
	                            field = fd.label.toLowerCase() === lcFieldName ? f : field;
                            }
                            if (fd.alias) {
                                //console.warn('fd.alias: ', fd.alias);
	                            field = fd.alias.toLowerCase() === lcFieldName ? f : field;
                            }
                            if (fd.origin) {
                                //console.warn('fd.origin: ', fd.origin);
	                            field = fd.origin.toLowerCase() === lcFieldName ? f : field;
                            }
                            if (fd.fullyQualifiedName) {
                                //console.warn('fd.fullyQualifiedName: ', fd.fullyQualifiedName);
    	                        field = fd.fullyQualifiedName.toLowerCase() === lcFieldName ? f : field;
                            }
                            if (fd.description) {
                                //console.warn('fd.description: ', fd.description);
        	                    field = fd.description.toLowerCase() === lcFieldName ? f : field;
                            }
                            //console.warn('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$: returning field: ', field);
                            return field;
                        }
                        
                        var f = null;                        
                        for (var name in fieldMap) {
                            f = fieldMap[name];
                            //console.warn('f: ', f);
                            field = field || match(lcFieldName, f);
                            /*
                            field = f.label.toLowerCase() === lcFieldName ? f : field;
                            field = f.origin.toLowerCase() === lcFieldName ? f : field;
                            field = f.fullyQualifiedName.toLowerCase() === lcFieldName ? f : field;
                            field = f.description.toLowerCase() === lcFieldName ? f : field;
                            */
                        }
                        //console.warn('field: ', field);
                        
                        if (field !== null && typeof field !== null) {
                            var fieldDetails = field[field.type];                                            
                            //console.warn('fieldDetails: ', fieldDetails);
                        
                            var saql = '';
                            saql += 'q = load "' + datasetDetails.id + '/' + datasetDetails.currentVersionId + '";\n';
                            
                            saql += 'q = group q by (';
                            saql += "'" + fieldDetails.field + "'";
                            saql += ');\n';
                            
                            var delim = ' ';
                            saql += 'q = foreach q generate'
                            var i = 0;
                            var label = null;
                            var name = null;
                            if (fieldDetails.field) {
                                name = fieldDetails.field;
                                label = fieldDetails.label;
                            } else if (fieldDetails.fields) {
                                for (var key in fieldDetails.fields) {
                                    if (fieldDetails.fields[key] === field.name) {
                                        name = field.name; //fieldDetails.fields[fieldDetails.name];
                                        label = fieldDetails.label + ' (' + key + ')';                                
                                    }
                                }
                            }
                            saql += delim + "'" + name + "' as '" + name + "'";
                            delim = ', ';            
                            
                            saql += ";\n";
                            
                            var limit = 200;
                            
                            saql += "q = limit q " + limit + ";";
                            
                            //console.warn('saql: ', saql);
                            
                            self.execQuery(component, saql, function(err, result) {
                                if (err) {
                                    console.error('Query error: ', err[0]);
                                    return;
                                }
                                
                                if (typeof result === 'string') {
                                    result = JSON.parse(result);
                                } else {
                                    result = result;
                                }
                                
                                if (result.results && result.results.records) {
	                                var records = result.results.records;                        
        	                        //console.warn('records: ', records);
                                    
                                    
                                    var currentCommand = null;
                                    var suggestedCommand = null;
                                    var suggestedCommands = [];
                                    var phrase = null;
                                    var text = null;
                                    var value = null;
                                    var actionVerb = isFilter ? 'Filter' : 'Select';
                                    var actionType = isFilter ? 'FilterAnalyticsDashboard' : 'SelectAnalyticsDashboard';
                                    var actionName = isFilter ? 'filterAnalyticsDashboard' : 'selectAnalyticsDashboard';
/*
                                    var actionVerb = config.actionType === 'filter' ? 'Filter' : 'Select';
                                    var actionType = config.actionType === 'filter' ? 'FilterAnalyticsDashboard' : 'SelectAnalyticsDashboard';
                                    var actionName = config.actionType === 'filter' ? 'filterAnalyticsDashboard' : 'selectAnalyticsDashboard';
*/
                                    var actionTarget = null;
                                    records.forEach(function(record, i) {
                                        value = record[fieldDetails.field];
                                        // Split up camel-cased words
                                        actionTarget = fieldDetails.label;
                                        text = actionVerb + ' ' + actionTarget + ' by ' + value;
                                        
                                        currentCommand = {
                                            action: {
                                                results: [
                                                    {
                                                        id: fieldDetails.field,
                                                        criteria: text,
                                                        fieldName: fieldDetails.label,
                                                        fieldValue: value
                                                    }
                                                ],
                                                type: actionType //'FilterAnalyticsDashboard'
                                            },
                                            id: 'GENERATED_' + i,
                                            name: actionName, //'filterAnalyticsDashboard',
                                            target: 'Dashboard'
                                        };
                                        
                                        //console.warn('currentCommand: ', currentCommand);
                                        
                                        suggestedCommand = {
                                            text: text,
                                            name: fieldDetails.field,
                                            id: fieldDetails.field,
                                            type: actionType, //'FilterAnalyticsDashboard',
                                            command: currentCommand,
                                            config: currentCommand.action.results ? currentCommand.action.results[0] : null
                                        };
                                        suggestedCommands.push(suggestedCommand);
                                    });
                                    
                                    if (typeof callback === 'function') {
                                        callback(null, {command: command, suggestedCommands: suggestedCommands});
                                    }                                    

                                }
                            });
                            
                            
                        }
                    }
                });
            }
        }
        
    },

    execQuery: function(component, query, callback) {
        //console.warn('execQuery: ', query);
        var action = component.get("c.execQuery");
        var self = this;
        action.setParams({query: query});
        action.setCallback(this, function(response) {
            //console.warn('response: ', response);
            var state = response.getState();
            //console.warn('state: ', state);
            if (state === "SUCCESS") {
                var val = response.getReturnValue();
                if (typeof callback === 'function') {
                    callback(null, val);
                }
            }
            else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var err = response.getError();
                console.error('error: ', err);
                if (typeof callback === 'function') {
                    callback(err, null);
                }
            }            
        });
        $A.enqueueAction(action);
    },
    
    listFilterFields: function(component, command, callback) {
		var self = this;
        var config = command.config;
        console.warn('listFilterFields - config:', config);

        var dashboardIds = self.getCurrentDashboardIds(component);
        
        // Only handles the first one!
        var dashboardId = dashboardIds[0] || null;
        console.warn('dashboardId: ', dashboardId);

        if (dashboardId !== null && typeof dashboardId !== 'undefined') {
            self.getDashboardDetails(component, dashboardId, function(err, dashboard, datasets, datasetsMap, datasetFieldsMap) {
                /*
                console.warn('getDashboardDetails returned: ', err);
                console.warn('dashboard: ', JSON.parse(JSON.stringify(dashboard)));
                console.warn('datasets: ', JSON.parse(JSON.stringify(datasets)));
                console.warn('datasetsMap: ', JSON.parse(JSON.stringify(datasetsMap)));
                console.warn('datasetFieldsMap: ', JSON.parse(JSON.stringify(datasetFieldsMap)));
                */
                var fieldList = [];
                var shownFields = {};
                
                var field = null;
                var fieldDetails = null;
                
                var max = 10;
                
                
                // Find the most likely fields to filter on
                var stateFields = {};
                
                if (dashboard.state) {
                    
                    if (dashboard.state.filters) {
                        dashboard.state.filters.forEach(function(filter) {
                            //console.warn('checking filter: ', filter);
                            if (filter.fields) {
                                filter.fields.forEach(function(field) {
									stateFields[field] = 1;
                                });
                            }
                        }); 
                    }
                    
                    if (dashboard.state.steps) {
                        var step = null;
                        for (var name in dashboard.state.steps) {
                            step = dashboard.state.steps[name];
                            //console.warn('checking step: ', step);
                            if (step.query && step.query.query) {
                                var query = JSON.parse(step.query.query);
                                //console.warn('checking query: ', query);
                                if (query.groups) {
                                    query.groups.forEach(function(group) {
                                       stateFields[group] = 1;                  
                                    });
                                }
                                if (query.measures) {
                                    query.measures.forEach(function(measure) {
                                       stateFields[measure] = 1;                
                                    });
                                }
                            }
                        }
                    }
                }

                //console.warn('stateFields: ', stateFields);
                
                // First use fields that have filters or steps
                for (var datasetName in datasetFieldsMap) {
                    var xmd = datasetFieldsMap[datasetName];
                    
                    var fieldMap = self.parseXMD(component, xmd);
                    //console.warn('fieldMap: ', fieldMap);
                    
                    //component.set("v.fieldMap", fieldMap);

                    var fieldList = [];
                    var shownFields = {};
                    
					var field = null;
                    var fieldDetails = null;
                    
                    var max = 50;
                    
                    var i = 0;
                    
                    // First use fields in the dashboard state
                    for (var name in fieldMap) {
                        field = fieldMap[name];
                        //console.warn('field: ', field);
                        fieldDetails = field[field.type];
                        //console.warn(name, fieldDetails.label, field.type);
                        if (stateFields[name] === 1) {
                            fieldList.push({
                                name: name,
                                label: fieldDetails.label,
                                type: field.type,
                                selected: i < max && fieldDetails.label !== name,
                                hasLabel: fieldDetails.label !== name
                            });
                            //if (fieldDetails.label !== name) {
	                            shownFields[name] = 1;
	                            i++;
                            //}
                        }                        
                    }

                    // Mext use fields that have labels
                    for (var name in fieldMap) {
                        field = fieldMap[name];
                        //console.warn('field: ', field);
                        fieldDetails = field[field.type];
                        //console.warn(name, fieldDetails.label, field.type);
                        if (field.type === 'dimension' && fieldDetails.showInExplorer === true  && shownFields[name] !== 1) {
                            fieldList.push({
                                name: name,
                                label: fieldDetails.label,
                                type: field.type,
                                selected: i < max && fieldDetails.label !== name,
                                hasLabel: fieldDetails.label !== name
                            });
                            //if (fieldDetails.label !== name) {
	                            shownFields[name] = 1;
	                            i++;
                            //}
                        }
                    }
                    
                    //console.warn('shownFields: ', shownFields);

                    // Add the rest
                    for (var name in fieldMap) {
                        field = fieldMap[name];
                        // If it's a date only include the 'fullField' and not all variants!
                        if ((field.type === 'date' && field.name === 'fullField') || field.type !== 'date') {
                            fieldDetails = field[field.type];
                            if (fieldDetails.showInExplorer === true && shownFields[name] !== 1) {
                                fieldList.push({
                                    name: name,
                                    label: fieldDetails.label,
                                    type: field.type,
                                    selected: i < max,
                                    hasLabel: fieldDetails.label !== name
                                });
                                if (fieldDetails.label !== name) {
                                    i++;
                                }
                            }
                        }
                    }

                    //console.warn('fieldList: ', fieldList);
                    
                    //self.generateSAQL(component);
                    
                    var currentCommand = null;
                    var suggestedCommand = null;
                    var suggestedCommands = [];
                    var phrase = null;
                    var text = null;
                    if (fieldList) {
                        fieldList.forEach(function(field) {
                            text = 'List ' + field.label.trim().replace(new RegExp('([A-Z])', 'g'), "$1") + ' values';
                            currentCommand = {
                                action: {
                                    results: [
                                        {
                                            id: field.name,
                                            fieldName: field.name,
	                                        actionType: 'filter'                                            
                                        }
                                    ],
                                    type: 'ListFilterFieldValues'
                                },
                                name: 'listFieldValues'
                            };
                            
                            //console.warn('currentCommand: ', currentCommand);
                            
                            // Split up camel-cased words
                            suggestedCommand = {
                                text: text,
                                name: field.name,
                                id: field.name,
                                type: 'ListFieldFieldValues',
                                command: currentCommand,
                                config: currentCommand.action.results ? currentCommand.action.results[0] : null
                            };
                            suggestedCommands.push(suggestedCommand);
                        });
                    }
                    
                    if (typeof callback === 'function') {
                        callback(null, {command: command, suggestedCommands: suggestedCommands});
                    }
                }                
                
            });            
        }
    },

    
    listSelectionFields: function(component, command, callback) {
		var self = this;
        var config = command.config;
        console.warn('listSelectionFields - config:', config);

        var dashboardIds = self.getCurrentDashboardIds(component);
        
        // Only handles the first one!
        var dashboardId = dashboardIds[0] || null;
        console.warn('dashboardId: ', dashboardId);

        if (dashboardId !== null && typeof dashboardId !== 'undefined') {
            self.getDashboardDetails(component, dashboardId, function(err, dashboard, datasets, datasetsMap, datasetFieldsMap) {
                /*
                console.warn('getDashboardDetails returned: ', err);
                console.warn('dashboard: ', JSON.parse(JSON.stringify(dashboard)));
                console.warn('datasets: ', JSON.parse(JSON.stringify(datasets)));
                console.warn('datasetsMap: ', JSON.parse(JSON.stringify(datasetsMap)));
                console.warn('datasetFieldsMap: ', JSON.parse(JSON.stringify(datasetFieldsMap)));
                */
                var fieldList = [];
                var shownFields = {};
                
                var field = null;
                var fieldDetails = null;
                
                var max = 10;
                
                
                // Find the most likely fields to filter on
                var stateFields = {};
                
                if (dashboard.state) {

                    if (dashboard.state.steps) {
                        var step = null;
                        for (var name in dashboard.state.steps) {
                            step = dashboard.state.steps[name];
                            //console.warn('checking step: ', step);
                            if (step.query && step.query.query) {
                                var query = JSON.parse(step.query.query);
                                //console.warn('checking query: ', query);
                                if (query.groups) {
                                    query.groups.forEach(function(group) {
                                       stateFields[group] = 1;                  
                                    });
                                }
                                if (query.measures) {
                                    query.measures.forEach(function(measure) {
                                       stateFields[measure] = 1;                
                                    });
                                }
                            }
                        }
                    }
                }

                //console.warn('stateFields: ', stateFields);
                
                // First use fields that have filters or steps
                for (var datasetName in datasetFieldsMap) {
                    var xmd = datasetFieldsMap[datasetName];
                    
                    var fieldMap = self.parseXMD(component, xmd);
                    //console.warn('fieldMap: ', fieldMap);
                    
                    //component.set("v.fieldMap", fieldMap);

                    var fieldList = [];
                    var shownFields = {};
                    
					var field = null;
                    var fieldDetails = null;
                    
                    var max = 50;
                    
                    var i = 0;
                    
                    // First use fields in the dashboard state
                    for (var name in fieldMap) {
                        field = fieldMap[name];
                        //console.warn('field: ', field);
                        fieldDetails = field[field.type];
                        //console.warn(name, fieldDetails.label, field.type);
                        if (stateFields[name] === 1) {
                            fieldList.push({
                                name: name,
                                label: fieldDetails.label,
                                type: field.type,
                                selected: i < max && fieldDetails.label !== name,
                                hasLabel: fieldDetails.label !== name
                            });
                            //if (fieldDetails.label !== name) {
	                            shownFields[name] = 1;
	                            i++;
                            //}
                        }                        
                    }
                   
                    var currentCommand = null;
                    var suggestedCommand = null;
                    var suggestedCommands = [];
                    var phrase = null;
                    var text = null;
                    if (fieldList) {
                        fieldList.forEach(function(field) {
                            text = 'List ' + field.label.trim().replace(new RegExp('([A-Z])', 'g'), "$1") + ' values';
                            currentCommand = {
                                action: {
                                    results: [
                                        {
                                            id: field.name,
                                            fieldName: field.name,
	                                        actionType: 'filter'                                            
                                        }
                                    ],
                                    type: 'ListSelectionFieldValues'
                                },
                                name: 'listFieldValues'
                            };
                            
                            //console.warn('currentCommand: ', currentCommand);
                            
                            // Split up camel-cased words
                            suggestedCommand = {
                                text: text,
                                name: field.name,
                                id: field.name,
                                type: 'ListSelectionFieldValues',
                                command: currentCommand,
                                config: currentCommand.action.results ? currentCommand.action.results[0] : null
                            };
                            suggestedCommands.push(suggestedCommand);
                        });
                    }
                    
                    if (typeof callback === 'function') {
                        callback(null, {command: command, suggestedCommands: suggestedCommands});
                    }
                }                
                
            });            
        }
    },
    
    generateSAQL: function(component, datasetDetails) {
        
        console.warn('voiceUtilityBarHelper.generateSAQL');
        var datasetDetails = component.get('v.datasetDetails');
        var fieldMap = component.get('v.fieldMap');
        var fieldList = component.get('v.fields');
        var xmd = component.get('v.xmd');
        
        //console.warn('datasetDetails: ', datasetDetails);
        //console.warn('fieldMap: ', fieldMap);
        //console.warn('xmd: ', xmd);
        
        if (datasetDetails && fieldMap && fieldList && xmd) {
            
            var saql = '';
            saql += 'q = load "' + datasetDetails.id + '/' + datasetDetails.currentVersionId + '";\n';
            
            var groups = [];
            if (groups && groups.length > 0) {
                saql += 'q = group q by (';
                groups.forEach(function(group) {
                    saql += "'" + group + "'";
                });
                saql += ');\n';
            }
            
            var field = null;
            var fieldDetails = null;
            
            var delim = ' ';
            saql += 'q = foreach q generate'
            var i = 0;
            var label = null;
            var name = null;
            fieldList.forEach(function(field) {
                if (field.selected === true) {
                    
                    fieldDetails = fieldMap[field.name][field.type];

                    if (fieldDetails.field) {
                        name = fieldDetails.field;
                        label = fieldDetails.label;
                    } else if (fieldDetails.fields) {
                        for (var key in fieldDetails.fields) {
                            if (fieldDetails.fields[key] === field.name) {
		                        name = field.name; //fieldDetails.fields[fieldDetails.name];
        		                label = fieldDetails.label + ' (' + key + ')';                                
                            }
                        }
                    }
	                saql += delim + "'" + name + "' as '" + label + "'";
    	            delim = ', ';            
                }
            });
            
            saql += ";\n";
            
            var limit = component.get('v.limit');
            
            saql += "q = limit q " + limit + ";";
            
            //console.warn('saql: ', saql);
            component.set('v.editSaql', saql);
            if (autoExecute === true) {
	            component.set('v.saql', saql);            
            }
        
        }

    },
    
	    
    listActiveDashboards: function(component, command, callback) {
		var self = this;
        var config = command.config;
        console.warn('listActiveDashboards - config:', config);

        self.getActiveDashboards(component, function(err, dashboards) {
            var activeDashboardList = [];
            var suggestedCommands = [];
            var suggestedCommand = null;
            var currentCommand = null;
            var phrase = null;            
            if (dashboards) {
                dashboards.forEach(function(dashboard) {
                    currentCommand = {
                        action: {
                            results: [
                                {
                                    id: dashboard.id
                                }
                            ],
                            type: 'ViewAnalyticsDashboard'
                        },
                        name: 'ViewAnalyticsDashboard'
                    };
                    
                    console.warn('currentCommand: ', currentCommand);
                    
                    suggestedCommand = {
                        text: dashboard.label,
                        name: dashboard.name,
                        id: dashboard.id,
                        type: 'ViewAnalyticsDashboard',
                        command: currentCommand,
                        config: currentCommand.config
                    };
                    suggestedCommands.push(suggestedCommand);
                });
            }
            self.setSuggestedCommands(component, suggestedCommands);
            self.setCommands(component, suggestedCommands);            
            //component.set('v.suggestedCommands', suggestedCommands);                    
            //component.set('v.commands', suggestedCommands);            
        });
    },

    getDashboardActions: function(component, command, callback) {
		var self = this;
        var config = command.config;        
        console.warn('getDashboardActions - config:', config);

        var dashboardDiscoverMap = component.get('v.dashboardDiscoverMap') || {};
        
        var objectType = 'DatasetFields';
        self.getCommands(component, objectType, function(commands) {
            //console.warn('commands: ', commands);
            
            self.listDashboards(component, function(err, dashboards) {
                var activeDashboardList = [];
                var suggestedCommands = [];
                var suggestedCommand = null;
                var currentCommand = null;
                var phrase = null;
                if (dashboards) {
                    dashboards.forEach(function(dashboard) {
                        if (dashboardDiscoverMap[dashboard.id]) {
                            console.warn('adding active dashboard: ', dashboard);
                            activeDashboardList.push(dashboard);
                            
                            // HOW TO BEST GET/CONSTRUCT THESE COMMANDS?
                            //
                            
                            commands.forEach(function(command) {
                                
                                console.warn('command: ', command);
                                
                                currentCommand = command;
                                
                                phrase = currentCommand.rankingPhrase.phrase.replace(objectType, '').trim();
                                
                                /*
                                currentCommand = {
                                    action: {
                                        results: [
                                            {
                                                id: dashboard.id
                                            }
                                        ],
                                        type: 'ViewAnalyticsDashboard'
                                    },
                                    name: 'ViewAnalyticsDashboard'
                                };
                                */
                                
                                console.warn('currentCommand: ', currentCommand);
        
                                suggestedCommand = {
                                    text: phrase, //'Show Dashboard ' + dashboard.label,
                                    name: dashboard.name,
                                    id: dashboard.id,
                                    type: 'ViewAnalyticsDashboard',
                                    command: currentCommand,
                                    config: currentCommand.config
                                };
                                suggestedCommands.push(suggestedCommand);
                            });
                        } 
                    });
                }
                self.setSuggestedCommands(component, suggestedCommands);
                self.setCommands(component, suggestedCommands);
				//component.set('v.suggestedCommands', suggestedCommands);                    
                //component.set('v.commands', suggestedCommands)                    
            });
        });
    },
    
    setupDashboardDiscoverInterval: function(component) {
        function fireDiscoverDashboards() {
        	var evt = $A.get('e.wave:discover');
            var params = {};
            evt.setParams(params);
            evt.fire();
            // Set the dashboardDiscoverMap to null
			//component.set('v.dashboardDiscoverMap', null);
        }
        
        window.setInterval(fireDiscoverDashboards, 3000);
        fireDiscoverDashboards();
    },
    
    getCurrentDashboardIds: function(component) {
        
        var dashboardDiscoverMap = component.get('v.dashboardDiscoverMap');
        var dashboardIds = [];
        
        if (dashboardDiscoverMap !== null && typeof dashboardDiscoverMap !== 'undefined') {
            var discover = null;
            for (var id in dashboardDiscoverMap) {
                discover = dashboardDiscoverMap[id];
                if (discover.isLoaded === true) {
                    dashboardIds.push(id);
                }
            }
        }
        
        return dashboardIds;

    },
    
    matchFields: [
    	'label', 'origin', 'description', 'fullyQualifiedName', 'field'
    ],
 
    match: function(datasetId, values, matchValue) {
        var self = this;
        //console.warn('matchValue: ', matchValue);
        var matchIndex = -1;
        var label = null;
        var matchField = null;
        for (var i = 0; i < values.length; i++) {
            for (var j = 0; j < self.matchFields.length; j++) {
                matchField = self.matchFields[j];
                label = values[i][matchField];
                //console.warn('label: ', label);
                if (label && (label.toLowerCase() === matchValue.toLowerCase())) {
                    matchIndex = i;
                    break;
                }
            }
        }

        //console.warn('matchIndes: ', matchIndex);
        //console.warn('matched value: ', values[matchIndex]);
        
        if (matchIndex !== -1) {
            //console.warn('matchIndes: ', matchIndex);
            //console.warn('matched dalue: ', values[matchIndex]);
        }
        return matchIndex !== -1 ? {datasetId: datasetId, values: values, index: matchIndex, matchValue: matchValue} : null;
    },
    
    filterDashboard: function(component, command, callback) {
		var self = this;
        var config = command.config;        
        console.warn('filterDashboard - config:', config);
        
        var dashboardIds = self.getCurrentDashboardIds(component);
        var dashboardId = dashboardIds[0] || null;

        //var dashboardId = component.get('v.dashboardId');

        console.warn('dashboardId: ', dashboardId);

        
        var t1 = Date.now();
        
        self.getDashboardDetails(component, dashboardId, function(err, dashboard, datasets, datasetsMap, datasetFieldsMap) {
            var t2 = Date.now();

            /*
            console.warn('getDashboardDetails returned: ');
            console.warn('err: ', err);
            console.warn('dashboard: ', dashboard);
            console.warn('datasets: ', datasets);
            console.warn('datasetsMap: ', datasetsMap);
            console.warn('datasetFieldsMap: ', datasetFieldsMap);
			*/
            
            // Match the field name to the closest label
            var matchValue = config.fieldName;
            var match = null;
            var datasetFields = null;
            for (var datasetId in datasetFieldsMap) {
                datasetFields = datasetFieldsMap[datasetId];
                //console.warn('datasetFields: ', datasetFields);
                match = match || self.match(datasetId, datasetFields.dimensions, matchValue);
                match = match || self.match(datasetId, datasetFields.measures, matchValue);
                match = match || self.match(datasetId, datasetFields.dates, matchValue);
                match = match || self.match(datasetId, datasetFields.derivedDimensions, matchValue);
                match = match || self.match(datasetId, datasetFields.derivedMeasures, matchValue);                
            }
            //console.warn('match: ', match);
            var t3 = Date.now();
            
            var fieldName = null;
            
            if (match) {
                var matchField = match.values[match.index];
                
                // What is the best field to use? origin seems to be the best?
                //fieldName = matchField.field;
                fieldName = matchField.origin;
            } else {
                fieldName = config.fieldName;
            }

            //console.warn('fieldName: ', fieldName);
            
            // Since we're matching labels, use camel case for the field value
            var fieldValue = config.fieldValue ? self.camelize(config.fieldValue, true) : null;

            //console.warn('fieldValue: ', fieldValue);

			var dataset = datasetsMap[datasetId];
            
            //console.warn('dataset: ', dataset);
            
            //var datasetName = 'eadx__opportunity';

            var datasetName = dataset.namespace ? dataset.namespace + '__' : '';
            datasetName += dataset.name;
            
            //console.warn('datasetName: ', datasetName);
            
            var filter = {
                datasets: {}
            };
            filter.datasets[datasetName] = [
                {
                    fields: [
                    ],
                    filter: {
                        operator:"in",
                        values: [
                        ]
                    }
                }                
            ];
            
            filter.datasets[datasetName][0].fields.push(fieldName);

            if (fieldValue !== null && typeof fieldValue !== 'undefined') {
	            filter.datasets[datasetName][0].filter.values.push(fieldValue);
            }
            
            //console.warn('filter: ', filter);
            
            var json = JSON.stringify(filter);

            //console.warn('filter json: ', json);
            //console.warn('formatted filter json: ', JSON.stringify(filter, null, 2));
            
            var evt = $A.get('e.wave:update');
            var params = {
                value: json,
                id: dashboardId,
                type: "dashboard"
            };
            
            //console.warn('params json: ', JSON.stringify(params));
            //console.warn('formatted params json: ', JSON.stringify(params, null, 2));
            
            var t4 = Date.now();
            
            
            //console.warn('filter event params: ');
            //console.warn(JSON.stringify({value: filter, id: dashboardId, type: 'dashboard'}, null, 2));
            evt.setParams(params);
            evt.fire();

            var t5 = Date.now();
            
            
            self.getSuggestionsByType(component, command.type, function(err, suggestedCommands) {
                if (typeof callback === 'function') {
                    callback(null, {command: command, suggestedCommands: suggestedCommands});
                }
                
                var t6 = Date.now();
                /*
                console.warn('getDashboardDetails timing: ', (t2 - t1) + ' ms');
                console.warn('match timing: ', (t3 - t2) + ' ms');
                console.warn('create event timing: ', (t4 - t3) + ' ms');
                console.warn('fire event timing: ', (t5 - t4) + ' ms');
                console.warn('total timing: ', (t5 - t1) + ' ms');
                */
            });
        });      
    },

    selectDashboard: function(component, command, callback) {
        var self = this;
        var config = command.config;        
        //console.warn('selectDashboard - config:', config);
        
        var dashboardIds = self.getCurrentDashboardIds(component);
        var dashboardId = dashboardIds[0] || null;
        
        var t1 = Date.now();
        
        self.getDashboardDetails(component, dashboardId, function(err, dashboard, datasets, datasetsMap, datasetFieldsMap) {
            var t2 = Date.now();
            /*
            console.warn('getDashboardDetails returned: ');
            console.warn('err: ', err);
            console.warn('dashboard: ', dashboard);
            console.warn('datasets: ', datasets);
            console.warn('datasetsMap: ', datasetsMap);
            console.warn('datasetFieldsMap: ', datasetFieldsMap);
            */
            
            // Match the field name to the closest label
            var matchValue = config.fieldName;
            var match = null;
            var datasetFields = null;
            for (var datasetId in datasetFieldsMap) {
                datasetFields = datasetFieldsMap[datasetId];
                //console.warn('datasetFields: ', datasetFields);
                match = match || self.match(datasetId, datasetFields.dimensions, matchValue);
                match = match || self.match(datasetId, datasetFields.measures, matchValue);
                match = match || self.match(datasetId, datasetFields.dates, matchValue);
                match = match || self.match(datasetId, datasetFields.derivedDimensions, matchValue);
                match = match || self.match(datasetId, datasetFields.derivedMeasures, matchValue);                
            }
            
            console.warn('match: ', match);
            var t3 = Date.now();
            
            var fieldName = null;
            
            if (match) {
                var matchField = match.values[match.index];
                
                // What is the best field to use? origin seems to be the best?
                //fieldName = matchField.field;
                fieldName = matchField.field || matchField.origin;
            } else {
                fieldName = config.fieldName;
            }

            //console.warn('fieldName: ', fieldName);
            
            // Since we're matching labels, use camel case for the field value
            var fieldValue = config.fieldValue ? self.camelize(config.fieldValue, true) : null;

            //console.warn('fieldValue: ', fieldValue);

			var dataset = datasetsMap[datasetId];
            
            //console.warn('dataset: ', dataset);
            
            //var datasetName = 'eadx__opportunity';

            var datasetName = dataset.namespace ? dataset.namespace + '__' : '';
            datasetName += dataset.name;
            
            //console.warn('datasetName: ', datasetName);


            /*
            var selection = {
                datasets:{
                    "eadx__opportunity": [
                        {
                            fields: [
                                fieldName
                            ],
                            selection: [
                                fieldValue
                            ]
                        }
                    ]
                }
            };
            */
            
            var selection = {
                datasets:{}
            };
            
            selection.datasets[datasetName] = [
                {
                    fields: [
                        fieldName
                    ],
                    selection: [
                        fieldValue
                    ]
                }  
            ];
            
            //console.warn('selection: ', selection);
            
            var json = JSON.stringify(selection);

            //console.warn('selection json: ', json);
            //console.warn('formatted selection json: ', JSON.stringify(selection, null, 2));
            
            var evt = $A.get('e.wave:update');
            var params = {
                value: json,
                id: dashboardId,
                type: "dashboard"
            };
            
            var t4 = Date.now();
            
            
            //console.warn('filter event params: ');
            //console.warn(JSON.stringify({value: filter, id: dashboardId, type: 'dashboard'}, null, 2));
            evt.setParams(params);
            evt.fire();

            var t5 = Date.now();

            self.getSuggestionsByType(component, command.type, function(err, suggestedCommands) {
                if (typeof callback === 'function') {
                    callback(null, {command: command, suggestedCommands: suggestedCommands});
                }
                
                var t6 = Date.now();
                /*
                console.warn('getDashboardDetails timing: ', (t2 - t1) + ' ms');
                console.warn('match timing: ', (t3 - t2) + ' ms');
                console.warn('create event timing: ', (t4 - t3) + ' ms');
                console.warn('fire event timing: ', (t5 - t4) + ' ms');
                console.warn('getSuggestionsByType timing: ', (t6 - t5) + ' ms');
                console.warn('total timing: ', (t6 - t1) + ' ms');
                */
            });            
        });      
    },
    
    getDashboardDetails: function(component, dashboardId, callback) {
        var self = this;
        
        var datasets = [];
        var datasetsMap = {};
        var datasetFieldsMap = {};
        
        self.describeDashboard(component, dashboardId, $A.getCallback(function(err, dashboard) {
            if (err !== null) {
                console.warn('describeDashboard error: ', err);
            } else {
                //console.warn('dashboard: ', dashboard);
                dashboard.datasets.forEach(function(dataset) {
                    self.describeDataset(component, dataset.id, $A.getCallback(function(err, datasetDesc) {
                        if (err !== null) {
                            console.warn('describeDataset error: ', err);
                        } else {
                            //console.warn('dataset: ', datasetDesc);
                            datasets.push(datasetDesc);
                            datasetsMap[datasetDesc.id] = datasetDesc;

                            self.getDatasetFields(component, datasetDesc.id, datasetDesc.currentVersionId, $A.getCallback(function(err, fields) {
                                if (err !== null) {
                                    console.warn('getDatasetFields error: ', err);
                                } else {
                                    //console.warn('fields: ', fields);
                                    datasetFieldsMap[datasetDesc.id] = fields;
                                }
                                if (typeof callback === 'function') {
                                    callback(null, dashboard, datasets, datasetsMap, datasetFieldsMap);
                                }
                            }));
                        }
                    }));
                });
            }            
        }));        
    },
    
    describeDashboard: function(component, dashboardId, callback) {
        var dashboardMap = component.get('v.dashboardMap') || {};
        var dashboard = dashboardMap[dashboardId];
        if (typeof dashboard !== 'undefined' && dashboard !== null) {
            if (typeof callback === 'function') {
                callback(null, dashboard);
            }
        } else {
            
            var sdk = null;
            try {            
                sdk = component.find("sdk");
            } catch (e) {
                console.error("Exception: ", e);
                if (typeof callback === 'function') {
                    callback(e, null);
                }
                return;
            }
            
            var context = {apiVersion: "41"};
            var methodName = "describeDashboard";
            var methodParameters = {
                dashboardId: dashboardId
            };
            //sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            sdk.invokeMethod(context, methodName, methodParameters, function(err, data) {
                //console.warn('describeDashboard returned: ', err, data);
                if (err !== null) {
                    console.error("describeDashboard error: ", err);
                    if (typeof callback === 'function') {
                        callback(err, null);
                    } else {
                        return err;
                    }
                } else {
                    dashboardMap[data.id] = data;
                    component.set('v.dashboardMap', dashboardMap);
                    if (typeof callback === 'function') {
                        callback(null, data);
                    } else {
                        return data;
                    }
                }
            });
            //}));
        }
        
    },
    
    describeDataset: function(component, datasetId, callback) {
        var datasetMap = component.get('v.datasetMap') || {};
        var dataset = datasetMap[datasetId];

        if (typeof dataset !== 'undefined' && dataset !== null) {
            if (typeof callback === 'function') {
                callback(null, dataset);
            }            
        } else {
            
            var sdk = component.find("sdk");
            
            var context = {apiVersion: "43"};
            var methodName = "describeDataset";
            var methodParameters = {
                datasetId: datasetId
            };
            sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
                //console.warn('describeDataset returned: ', err, data);
                if (err !== null) {
                    console.error("describeDataset error: ", err);
                    if (typeof callback === 'function') {
                        callback(err, null);
                    } else {
                        return err;
                    }
                } else {
                    datasetMap[data.id] = data;
                    component.set('v.datasetMap', datasetMap);
                    
                    if (typeof callback === 'function') {
                        callback(null, data);
                    } else {
                        return data;
                    }
                }
            }));
        }     
    },
    
    parseXMD: function(component, xmd) {
        var fields = {};
        xmd.dimensions.forEach(function(dimension) {
            fields[dimension.field] = {type: "dimension", dimension: dimension};
        });
        xmd.derivedDimensions.forEach(function(dimension) {
            fields[dimension.field] = {type: "derivedDimension", derivedDimension: dimension};
        });
        xmd.measures.forEach(function(measure) {
            fields[measure.field] = {type: "measure", measure: measure};
        });
        xmd.derivedMeasures.forEach(function(measure) {
            fields[measure.field] = {type: "derivedMeasure", derivedMeasure: measure};
        });
        xmd.dates.forEach(function(date) {
            for (var key in date.fields) {
                fields[date.fields[key]] = {type: "date", name: key, date: date}; 
            }
        });
        return fields;
    },
    
    getDatasetFields: function(component, datasetId, versionId, callback) {
        //console.warn('getDatasetFields: ', datasetId, versionId);
        var datasetFieldsMap = component.get('v.datasetFieldsMap') || {};
        var datasetFields = datasetFieldsMap[datasetId];
        //console.warn('datasetFields: ', datasetFields);

        if (typeof datasetFields !== 'undefined' && datasetFields !== null) {
            if (typeof callback === 'function') {
                callback(null, datasetFields);
            }            
        } else {
            var sdk = component.find("sdk");
            
            var context = {apiVersion: "43"};
            var methodName = "getDatasetFields";
            var methodParameters = {
                datasetId: datasetId,
                versionId: versionId
            };
            sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
                //console.warn('getDatasetFields returned: ', err, data);
                if (err !== null) {
                    console.error("getDatasetFields error: ", err);
                    if (typeof callback === 'function') {
                        callback(err, null);
                    } else {
                        return err;
                    }
                } else {
                    datasetFieldsMap[datasetId] = data;
                    component.set('v.datasetFieldsMap', datasetFieldsMap);                    
                    if (typeof callback === 'function') {
                        callback(null, data);
                    } else {
                        return data;
                    }
                }
            }));
        }
    }
})