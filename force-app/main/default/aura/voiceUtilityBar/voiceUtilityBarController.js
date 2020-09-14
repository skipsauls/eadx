({
    doInit: function(component, event, helper) {

		window.addEventListener('focus', function(e) {
            //console.warn('window.onfocus');
            helper.setupHotkeys(component);
        });
        /*
        window.onfocus = function(e) {
            console.warn('window.onfocus');
            helper.setupHotkeys(component);
        };
        */
        
        helper.setupSubscriptions(component);
        
        /*
        helper.getVoiceConfig(component, function(config) {
            console.warn('setting up window onkeyup handler');
            helper.setupHotkeys(component);
        });
		*/
        
        helper.getCommandReference(component);
        
        helper.setupDashboardDiscoverInterval(component);        
    },

    voiceProxyReady: function(component, event, helper) {
        console.warn('voiceProxyReady');
    },
    
    voiceConfigChanged: function(component, event, helper) {
        //console.warn('voiceConfigChanged');
        var params = event.getParams();
        //console.warn('name: ', params.name);
        //console.warn('config: ', params.config);
        component.set('v.configName');
        component.set('v.config', params.config);        
        helper.applyVoiceConfig(component);
    },
    
    toggleShowTools: function(component, event, helper) {
        console.warn('toggleShowTools');
        var val = component.get('v.showTools');
        val = !val;
        component.set('v.showTools', val);
    },

    toggleUseHotKeys: function(component, event, helper) {
        console.warn('toggleUseHotKeys');
        var val = component.get('v.useHotKeys');
        val = !val;
        component.set('v.useHotKeys', val);
    },
    
    toggleSpeakOutput: function(component, event, helper) {
        console.warn('toggleSpeakOutput');
        var val = component.get('v.speakOutput');
        val = !val;
        component.set('v.speakOutput', val);
    },
    
    toggleExecuteFirstMatchingCommand: function(component, event, helper) {
        console.warn('toggleExecuteFirstMatchingCommand');
        var val = component.get('v.executeFirstMatchingCommand');
        val = !val;
        component.set('v.executeFirstMatchingCommand', val);
    },
    
    toggleTypeAhead: function(component, event, helper) {
        console.warn('toggleTypeAhead');
        var val = component.get('v.typeAhead');
        val = !val;
        component.set('v.typeAhead', val);
    },
    
    toggleInterimResults: function(component, event, helper) {
        console.warn('toggleInterimResults');
        var val = component.get('v.interimResults');
        val = !val;
        component.set('v.interimResults', val);
    },
    
    toggleAwake: function(component, event, helper) {
        helper.toggleAwake(component);
        
        return;
        console.warn('toggleAwake');
        var recurring = component.get('v.recurring');
        var awake = component.get('v.awake');
        if (val !== null && typeof val !== 'undefined') {
            awake = val;
        } else {
	        awake = !awake;
        }

        //helper.stopDictation(component);
        
        if (awake === true) {
	        component.set('v.awake', true);
	        component.set('v.interimResults', false);
	        //helper.resetWakeTimeout(component);
	        //helper.startVisualization(component);
			
        } else {
	        component.set('v.awake', false);
	        component.set('v.interimResults', true);
	        //helper.stopVisualization(component);
        }

        if (recurring === true) {
            console.warn('calling startDictation');
            helper.startDictation(component);
        }
    },
    
    toggleUseModal: function(component, event, helper) {
        console.warn('toggleUseModal');
        var useModal = component.get('v.useModal');
        useModal = !useModal;
        component.set('v.useModal', useModal);
        
        var utilityAPI = component.find("utilitybar");
        if (utilityAPI !== null && typeof utilityAPI !== 'undefined') {
            utilityAPI.getUtilityInfo().then(function(result) {
                console.warn('utilityAPI.getUtilityInfo result: ', result); 
            }, function(err) {
                console.warn('utilityAPI.getUtilityInfo err: ', err);             
            });
            
            utilityAPI.toggleModalMode({enableModalMode: useModal});
            //utilityAPI.setUtilityHighlighted({highlighted: useModal});
            utilityAPI.setPanelWidth({widthPX: '1000'});
            
        }
    },
    
    toggleListening: function(component, event, helper) {
        console.warn('toggleListening');
        var listening = component.get('v.listening');
        listening = !listening;        
        component.set('v.listening', listening);        
        helper.setupListening(component);
    },
    
    startDictation: function(component, event, helper) {
        //console.warn('calling startDictation from controller startDictation');
        helper.startDictation(component);
    },
    
    stopDictation: function(component, event, helper) {
        helper.stopDictation(component);
    },
    
    handleVoiceResultsChange: function(component, event, helper) {
        helper.handleVoiceResultsChange(component);
    },

    handleAwakeChange: function(component, event, helper) {
        helper.handleAwakeChange(component);
        /*
		var awake = component.get('v.awake');
        var recurring = component.get('v.recurring');
        
        //helper.stopDictation(component);
        
        if (awake === true) {
            helper.playSound(component, 'listening/HeyEinstein.wav');            
        } else {
            helper.playSound(component, 'listening/MicOff.wav');            
        }

        if (recurring === true) {
            console.warn('calling startDictation');
            //helper.startDictation(component);
        } 
        */
    },
        
    handleStateChange: function(component, event, helper) {
        helper.handleStateChange(component);
    },

    handleListeningChange: function(component, event, helper) {
        //helper.handleListeningChange(component);
    },
 
    handleCommandClick: function(component, event, helper) {
        console.warn('handleCommandClick: ', event);
        
        var command = null;
        
        if (event.getSource) {
            command = event.getSource().get('v.name');
        } else {
        	command = event.target.getAttribute('data-command');
        }
        
        console.warn('command: ', command);
        
        var transcript = command;
        var confidence = 1.0;
        var isFinal = true;
        
        var voiceTranscripts = component.get('v.voiceTranscripts') || [];
        voiceTranscripts.reverse();
        voiceTranscripts.push({
            transcript: transcript,
            confidence: confidence,
            isFinal: isFinal
        });
        voiceTranscripts.reverse();
        component.set('v.voiceTranscripts', voiceTranscripts);           
        
        var substring = command;
        
        var voiceResults = component.get('v.voiceResults') || [];
        voiceResults.reverse();
        voiceResults.push({
            transcript: transcript,
            command: substring,
            confidence: confidence
        });
        voiceResults.reverse();
        component.set('v.voiceResults', voiceResults);           
        
        return;
        
        // This is too complex, just use the text transcript
        var commandTokens = command.split(' ');
        var index = commandTokens[0];
        var type = commandTokens[1];
        var id = commandTokens[2];
        console.warn('index: ', index);
        console.warn('type: ', type);
        console.warn('id: ', id);
        
        helper.executeCommand(component, index, type, id);
        
        /*
        if (type === 'ViewAnalyticsDashboard') {
            component.set('v.dashboardId', id);
            helper.showDashboard(component);
            helper.reset(component);
        } else if (type === 'ViewSObject') {
            component.set('v.recordId', id);
            helper.viewRecord(component);
            helper.reset(component);
        } else if (type === 'EditSObject') {
            component.set('v.recordId', id);
            helper.editRecord(component);
            helper.reset(component);
        }
        */
    },
    
    submitInputText: function(component, event, helper) {
        var value = component.get('v.inputText');
        console.warn('value: ', value);
        
        // Creat synthetic voice results
                
        var voiceResults = component.get('v.voiceResults') || [];
        voiceResults.reverse();
        voiceResults.push({
            transcript: value,
            command: value,
            confidence: 1.0
        });
        voiceResults.reverse();
        component.set('v.voiceResults', voiceResults);  
    },
    
    handleInputTextChange: function(component, event, helper) {
        /*
        var typeAhead = component.get('v.typeAhead');
        if (typeAhead !== true) {
            return;
        }
        */
        event.stopPropagation();
        
        console.warn('handleInputTextChange: ', event);

        var value = event.getParam ? event.getParam('value') : event.target.value;
        console.warn('value: ', value);

        component.set('v.inputText', value);
        
        var voiceResults = component.get('v.voiceResults') || [];
        voiceResults.reverse();
        voiceResults.push({
            transcript: value,
            command: value,
            confidence: 1.0
        });
        voiceResults.reverse();

        component.set('v.voiceResults', voiceResults);
        
		return;        
        
        
        var changing = component.get('v.inputTextChanging');        
        var useCommands = component.get('v.useCommands');
        
        if (changing === false) {
            if (useCommands === true) {
                helper.getCommands(component, value);
                
            } else {
                
                helper.matchCommand(component, value);
                
                //helper.getHints(component, value);
            }
        }
        
        //helper.getCommands(component, value);
        
    },
    
    handleInputTextFocus: function(component, event, helper) {
        //console.warn('handleInputTextFocus: ', event);
        //var value = event.getParam ? event.getParam('value') : event.target.value;
        //console.warn('value: ', value);
        return;
    },
    
    handlePlatformEvent: function(component, event, helper) {
        helper.handlePlatformEvent(component, event);
    },
    
    test: function(component, event, helper) {
        helper.updateSelection(component, true, '0FKB000000092VyOAI');
    },
    
    onTabClosed: function(component, event, helper) {
        console.warn('################################ onTabClosed');        
    },
    
    onTabCreated: function(component, event, helper) {
        console.warn('################################ onTabCreated');        
    },
    
    onTabFocused: function(component, event, helper) {
        console.warn('################################ onTabFocused');
    },
    
    onTabRefreshed: function(component, event, helper) {
        console.warn('################################ onTabRefreshed');
    },

    onTabReplaced: function(component, event, helper) {
        console.warn('################################ onTabReplaced');
    },
    
    onTabUpdated: function(component, event, helper) {
        console.warn('################################ onTabUpdated');
    },
    
    onCreateRecord: function(component, event, helper) {
        console.warn('################################ onCreateRecord');
    },

    onEditRecord: function(component, event, helper) {
        console.warn('################################ onEditRecord');
    },

    onNavigateToList: function(component, event, helper) {
        console.warn('################################ onNavigateToList');
    },
    
    onNavigateToObjectHome: function(component, event, helper) {
        console.warn('################################ onNavigateToObjectHome');
    },
    
    onNavigateToReactNativeApp: function(component, event, helper) {
        console.warn('################################ onNavigateToReactNativeApp');
    },
    
    onNavigateToRelatedList: function(component, event, helper) {
        console.warn('################################ onNavigateToRelatedList');
    },
    
    onNavigateToSObject: function(component, event, helper) {
        console.warn('################################ onNavigateToSObject');
    },
    
    onNavigateToURL: function(component, event, helper) {
        console.warn('################################ onNavigateToURL');
    },
    
    onRefreshView: function(component, event, helper) {
        console.warn('################################ onRefreshView');
    },
    
    onShowToast: function(component, event, helper) {
        console.warn('################################ onShowToast');
    },
    
    onChatterPostCreated: function(component, event, helper) {
        console.warn('################################ onChatterPostCreated');
    },
    
    onWaveDiscoverResponse: function(component, event, helper) {
        //console.warn('################################ onWaveDiscoverResponse');
        helper.handleDiscoverResponse(component, event);
    },
    
    onWaveSelectionChanged: function(component, event, helper) {
        /*
        console.warn('################################ onWaveSelectionChanged');
        var params = event.getParams();
        var value = null;
        var json = null;
        for (var key in params) {
            value = params[key];
            console.warn(key, ' = ', value, typeof value);
            if (typeof value === 'object') {
                json = JSON.stringify(value, null, 2)
                console.warn('json: ', json);
                value = JSON.parse(json);
                console.warn('value: ', value);
            }
            console.warn(key + ' = ' + value);
        }
        */
    }
    
    
})