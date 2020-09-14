({
    actionResponseMap: {
        'default': {
            response: {
                speech: 'Okay, now viewing {{itemType}} {{itemLabel}}',
                text: 'Okay, now viewing {{itemType}} {{itemLabel}}.'
            },
            error: {
	            speech: 'Sorry, there was a problem',
    	        text: 'Sorry, there was a problem.'                
            }
        },
        'ViewAnalyticsDashboard': {
            response: {
	            speech: 'Okay, now viewing dashboard {{label}}',
    	        text: 'Okay, now viewing dashboard {{label}}.'
            },
            error: {
	            speech: 'Sorry, no dashboard found {{label}}',
    	        text: 'Sorry, no dashboard found {{label}}.'                
            }
        },
        'AnalyticsDashboardUpdatePage': {
            response: {
                speech: 'Okay, now changing to the {{label}} page',
                text: 'Okay, now changing to the {{label}} page.'
            },
            error: {
	            speech: 'Sorry, no page found {{label}}',
    	        text: 'Sorry, no page found {{label}}.'                
            }
        },
        'ViewSobjectType': {
            response: {
                speech: 'Okay, now viewing {{name}}',
                text: 'Okay, now viewing {{name}}.'            
            },
            error: {
	            speech: 'Sorry, could not find {{label}}',
    	        text: 'Sorry, could not find {{label}}.'                
            }
        },
        'ChannelSubscribe': {
            response: {
                speech: 'Okay, now subscribed to channel {{label}}',
                text: 'Okay, now subscribed to channel {{label}}.'            
            },
            error: {
	            speech: 'Sorry, channel {{label}} not found',
    	        text: 'Sorry, channel {{label}} not found.'                
            }
        },
        'ChannelUnsubscribe': {
            response: {
                speech: 'Okay, now unsubscribed from channel {{label}}',
                text: 'Okay, now unsubscribed from channel {{label}}.'            
            },
            error: {
	            speech: 'Sorry, channel not found',
    	        text: 'Sorry, channel not found.'                
            }
        }
    },
    
    iconTypeMap: {
        //'default': 'https://adx-dev-ed.my.salesforce.com/analytics/wave/web/proto/images/app/icons/16.png',
        'default': '/analytics/wave/web/proto/images/app/icons/21.png',
        'ViewAnalyticsDashboard': '/analytics/wave/web/proto/images/thumbs/thumb-dashboard.png',
        'AnalyticsDashboardUpdatePage': '/analytics/wave/web/proto/images/app/icons/2.png',
        'ViewSobjectType': '/analytics/wave/web/proto/images/app/icons/16.png',
        'InvocableActionApex': 'https://adx-dev-ed.my.salesforce.com/analytics/wave/web/proto/images/app/icons/18.png',
        
    },
    
    uuidv4: function() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
    },
    
    init: function(component) {
        let vfToken = this.uuidv4();
        component.set('v.vfToken', vfToken);
        let lexOrigin = window.location.origin;
        let vfOrigin = lexOrigin.replace('.lightning.force', '--c.visualforce');
        //let vfOrigin = lexOrigin.replace('.lightning.force', '.my.salesforce');
        console.warn('lexOrigin: ', lexOrigin);
        console.warn('vfOrigin: ', vfOrigin);
        setTimeout($A.getCallback(function() {
            console.warn('setting v.lexOrigin');
	        component.set('v.lexOrigin', lexOrigin);
            console.warn('setting v.vfOrigin');
    	    component.set('v.vfOrigin', vfOrigin);
                   
        }), 10);
    },
    
    setup: function(component) {
        let self = this;
        let payload = {
            action: 'getVoices',
            callback: 'handleGetVoices'
        };
        self.sendToVF(component, payload);            
    },
    
    sendToVF: function(component, payload) {
        let vfOrigin = component.get("v.vfOrigin");
        let vfWindow = component.find("vfFrame").getElement().contentWindow;
        vfWindow.postMessage(payload, vfOrigin);
    },
    
    startListening: function(component) {
        let payload = {
            action: 'listen',
            callback: 'handleVoiceResult'
        };
        this.sendToVF(component, payload);	        
    },
    
    stopListening: function(component) {
        let payload = {
            action: 'stopListening',
            callback: 'handleVoiceResult'
        };
        this.sendToVF(component, payload);	        
    },
    
    speak: function(component, text) {
        let self = this;
        let payload = {
            action: 'speak',
            params: {
                text: text,
                voice: component.get('v.voiceName')
            },
            callback: 'handleSpeakCallback'
        };
        self.sendToVF(component, payload);
    },

    /*
    logUser: function(component, text) {
        let self = this;
        let log = component.find('log');
        let userDetails = component.get('v.userDetails');
        let user = {
            type: 'user',
            name: userDetails.Name,
            initials: userDetails.FirstName.substring(0, 1) + userDetails.LastName.substring(0, 1),
            avatarUrl: userDetails.SmallPhotoUrl
        };
        log.log(user, text, 0);
    },
    */
    
    logUser: function(component, user, text) {
        let self = this;
        let log = component.find('log');
        /*
        let userDetails = component.get('v.userDetails');
        let user = {
            type: 'user',
            name: userDetails.Name,
            initials: userDetails.FirstName.substring(0, 1) + userDetails.LastName.substring(0, 1),
            avatarUrl: userDetails.SmallPhotoUrl
        };
        */
        log.log(user, text, 0);
    },
    
    logSystem: function(component, text) {
        let self = this;
        let log = component.find('log');
        let user = {
            type: 'system',
            name: 'Einstein',
            fallbackIconName: 'utility:einstein'
        };
        log.log(user, text, 200);
    },
    
    callCommander: function(component) {
        let self = this;
        let inputText = component.get("v.inputText");

        // Store last command text for output formatting
        component.set('v.lastCommandText', inputText);
        
        var event = $A.get("e.c:ExternalCommanderPhraseEvent");
        console.warn('event: ', event);
        event.setParam('phrase', inputText);
        event.setParam('disableTyping', true);
        event.fire();
        
        //self.logUser(component, inputText);
        
        component.set('v.inputText', null);
    },
    
    getHandler: function(component, actionName, callback) {
        //console.warn('getHandler: ', actionName);
        let handlers = component.get('v.handlers') || {};
        let handler = handlers[actionName];        
        if (handler === null || typeof handler === 'undefined') {
            let devName = 'c:' + actionName.replace('Invocable', 'Handler');
            //console.warn('devName: ', devName);
            let proxy = component.get('v.proxy');
            //console.warn('proxy: ', proxy);
            let config = {
                proxy: proxy
            };
            //console.warn('config: ', config);
            $A.createComponent(devName, config, function(cmp, status, err) {
                //console.warn('createComponent returned: ', cmp, status, err);
                if (status === 'SUCCESS') {
                   	handler = cmp;
                    handlers[actionName] = handler;
                    component.set('v.handlers', handlers);
                    if (typeof callback === 'function') {
                        callback(null, handler);
                    }
                } else if (status === 'ERROR') {
                  	console.error('error: ', JSON.stringify(err));
                    if (typeof callback === 'function') {
                        callback(err, null);
                    }
                }
            });
        } else {
            if (typeof callback === 'function') {
                callback(null, handler);
            }
        }
    },
    
    handleCommanderResponse: function(component, err, resp) {
        let self = this;
        //console.warn('handleCommanderResponse: ', err, resp);
        if (err) {
            let error = JSON.parse(JSON.stringify(err));
            console.error('handleCommanderResponse error: ', err);
        } else {
            let response = JSON.parse(JSON.stringify(resp));
            //console.warn('handleCommanderResponse response: ', JSON.stringify(response, null, 2));
            let payload = response.payload;
            //console.warn('payload: ', JSON.stringify(payload, null, 2));
            
            
            let items = null;
            let error = null;
            
            if (payload) {
                let action = payload.action;
                //console.warn('action: ', action);
                let response = payload.response;
                //console.warn('response: ', response);
                let parameters = payload.parameters;
                //console.warn('parameters: ', parameters);
    	        let executedBy = payload.executedBy;
                console.warn('executedBy: ', JSON.stringify(executedBy, null, 2));
				let lastCommandText = component.get('v.lastCommandText');
                console.warn('lastCommandText: ', lastCommandText);
                
                
                let user = {
                    type: 'user',
                    id: executedBy.id,
                    name: executedBy.name,
                    avatarUrl: executedBy.profilePhotoUrl
                };
                
                self.logUser(component, user, lastCommandText);
                
                switch (action.type) {
                    case 'ViewSobjectType':
                        items = response.sobjects;
                        if (response.sobjects && response.sobjects.length > 0) {
	                        items = response.sobjects;
                        } else {
                            error = {type: 'NO_RECORDS_FOUND', msg: 'No records found', label: parameters.value};                            
                        }
                        break;    
                    case 'ViewAnalyticsDashboard':
                        if (response.items && response.items.length > 0) {
	                        items = response.items;
                        } else {
                            error = {type: 'NO_DASHBOARDS_FOUND', msg: 'No dashboards found', label: parameters.dashboardName};                            
                        }
                        break;    
                    case 'AnalyticsDashboardUpdatePage':
                        if (response.items && response.items.length > 0) {
	                        items = response.items;
                        } else {
                            error = {type: 'NO_PAGES_FOUND', msg: 'No pages found', label: parameters.value};                            
                        }
                        break;    
                    case 'ChannelSubscribe':
                        items = response.channels;
                        if (items && items.length > 0) {
                            // We only want the last element in the label, so /u/team/wdx would become wdx
                            items.forEach(function(channel) {
                                channel.label = channel.label.split('/').pop();
                            });
                        } else {
                            error = {type: 'NO_CHANNELS_FOUND', msg: 'No channels found', label: parameters. searchExpr};
                        }
                        break;
                    case 'ChannelUnsubscribe':
                        // Note that we're getting this from the attribute, not the response!
                       	let commanderChannel = component.get('v.commanderChannel');
                        //console.warn('commanderChannel: ', commanderChannel);
                        if (commanderChannel !== null && typeof commanderChannel !== 'undefined') {
                            // We only want the last element in the label, so /u/team/wdx would become wdx
                            commanderChannel.label = commanderChannel.label.split('/').pop();
                            items = [commanderChannel];
                        } else {
                            error = {type: 'NO_CHANNELS_FOUND', msg: 'No channels found', label: parameters. searchExpr};
                        }
                        break;
                    case 'InvocableActionApex':
                        let commandTarget = action.commandTarget;
		                console.warn('commandTarget: ', commandTarget);
                        
                        let actionResults = response.actionResults;
                        //console.warn('actionResults: ', actionResults);
                        actionResults.forEach(function(actionResult) {
                            //console.warn('actionResult: ', actionResult);
                            let outputValues = actionResult.outputValues;
                            //console.warn('outputValues: ', outputValues);
                            
                            if (outputValues.text) {
                            	self.logSystem(component, outputValues.text);
                        	}
                            if (outputValues.speech) {
	                            self.speak(component, outputValues.speech);
                            }
                            
                            // Dynamic handlers
                            self.getHandler(component, actionResult.actionName, function(err, handler) {
                                if (err) {
                                    console.warn('Error getting handler: ', err);
                                } else {
                                    handler.handleAction(payload, function(err, result) {
	                                    //console.warn('handler returned: ', err, result); 
                                        
                                        if (result) {
                                            if (result.outputValues) {
                                                
                                                outputValues = result.outputValues;
                                                //console.warn('outputValues: ', outputValues);
                                                
                                                if (outputValues.text) {
                                                    self.logSystem(component, outputValues.text);
                                                }
                                                if (outputValues.speech) {
                                                    self.speak(component, outputValues.speech);
                                                }
                                            }
                                        }
                                    });
                                }
                            });
                                            
                            //if (actionResult.actionName === 'AnalyticsVoiceAliasInvocable') {
                                //self.handleVoiceAlias(component, payload);
                            //}
                        });

                        break;    
                    default:
                        break;    
                }
                
            }

            if (payload.action.type !== 'InvocableActionApex') {

                if (error) {
                    let a = self.actionResponseMap[payload.action.type].error || self.actionResponseMap['default'].error;
                    //console.warn('a: ', a);
                    let actionResponse = {
                        speech: a.speech.slice(),
                        text: a.text.slice()
                    };
                    //console.warn('actionResponse: ', actionResponse);
                    for (let key in error) {
                        let regex = new RegExp('\{\{' + key + '\}\}', 'g');
                        actionResponse.speech = actionResponse.speech.replace(regex, error[key]);
                        actionResponse.text = actionResponse.text.replace(regex, error[key]);
                    }
                    //console.warn('actionResponse: ', actionResponse);
                    self.speak(component, actionResponse.speech);
                    self.logSystem(component, actionResponse.text);
                    
                } else if (items) {
                    // Handle the > 1 item case?
                    let item = items[0];
                    //console.warn('item: ', item);
                    
                    let a = self.actionResponseMap[payload.action.type].response || self.actionResponseMap['default'].response;
                    //console.warn('a: ', a);
                    let actionResponse = {
                        speech: a.speech.slice(),
                        text: a.text.slice()
                    };
                    //console.warn('actionResponse: ', actionResponse);
                    for (let key in item) {
                        let regex = new RegExp('\{\{' + key + '\}\}', 'g');
                        actionResponse.speech = actionResponse.speech.replace(regex, item[key]);
                        actionResponse.text = actionResponse.text.replace(regex, item[key]);
                    }
                    //console.warn('actionResponse: ', actionResponse);
                    self.speak(component, actionResponse.speech);
                    self.logSystem(component, actionResponse.text);
                } else {
                    console.warn('handle custom action on client!');
                }
            }
        }		
    },
    
    handleVoiceResult: function(component, err, resp) {
        let self = this;
        if (err) {
            let error = JSON.parse(JSON.stringify(err));
            console.error('handleVoiceResult error: ', err);
        } else {
            let response = JSON.parse(JSON.stringify(resp));
            //console.warn('handleVoiceResult response: ', response);
            
            //console.warn('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%5 response.phase: ', response.phase);
            
            if (response.phase === 'onresult') {
  
                if (response.text) {
                    component.set('v.inputText', response.text);
                    self.callCommander(component);
                } else {
                    // error?
                }
                return;
                
                if (typeof callback === 'function') {
                    callback(null, {msg: 'success'});
                }                

                let payload = response.payload;
                //console.warn('payload: ', payload);
                
                if (payload) {
                    let action = payload.action;
                    //console.warn('action: ', action);
                    let response = payload.response;
                    //console.warn('response: ', response);
                    
                    switch (action.type) {
                        case 'ViewSobjectType':
                            break;    
                        case 'ViewAnalyticsDashboard':
                            break;    
                        case 'AnalyticsDashboardUpdatePage':
                            break;    
                        case 'InvocableActionApex':
                            let commandTarget = action.commandTarget;
                            //console.warn('commandTarget: ', commandTarget);
                            
                            let actionResults = response.actionResults;
                            //console.warn('actionResults: ', actionResults);
                            actionResults.forEach(function(actionResult) {
                                //console.warn('actionResult: ', actionResult);
                                let outputValues = actionResult.outputValues;
                                //console.warn('outputValues: ', outputValues);
                                
                                if (outputValues.text) {
                                    self.logSystem(component, outputValues.text);
                                }
                                if (outputValues.speech) {
                                    self.speak(component, outputValues.speech);
                                }
                            });
    
                            break;    
                        default:
                            break;    
                    }
                    
                }                
                
                if (response.action.type !== 'InvocableActionApex') {
                
                    if (response.action) {
                        let a = self.actionResponseMap[response.action.type] || self.actionResponseMap['default'];
                        let actionResponse = {
                            speech: a.speech.slice(),
                            text: a.text.slice()
                        };                
                        //console.warn('actionResponse: ', actionResponse);
                        for (let key in response.action) {
                            let regex = new RegExp('\{\{' + key + '\}\}', 'g');
                            actionResponse.speech = actionResponse.speech.replace(regex, response.action[key]);
                            actionResponse.text = actionResponse.text.replace(regex, response.action[key]);
                        }
                        self.speak(component, actionResponse.speech);
                        self.logSystem(component, actionResponse.text);
                    }
                }                
            }
        }
        
        component.set('v.state', 'home');
    },
    
    handleSpeakCallback: function(component, err, resp) {
        let self = this;        
        if (err) {
            let error = JSON.parse(JSON.stringify(err));
            console.error('handleSpeakCallback error: ', err);
        } else {
            let response = JSON.parse(JSON.stringify(resp));
            //console.warn('handleSpeakCallback response: ', response);
        }
        //component.set('v.state', 'home');
        let textInput = component.find('text-input');
        textInput.focus();
    },
    
    handleGetVoices: function(component, err, resp) {
        let self = this;        
        if (err) {
            let error = JSON.parse(JSON.stringify(err));
            console.error('handleGetVoices error: ', err);
        } else {
            let response = JSON.parse(JSON.stringify(resp));
            //console.warn('handleGetVoices response: ', response);
            if (response.voices) {
                let voices = response.voices;
                let voiceMap = {};
                let langMap = {};                
                voices.forEach(function(voice) {
                    voiceMap[voice.name] = voice;
                    langMap[voice.lang] = voice.lang;
                });
                //console.warn('langMap: ', langMap);
                let languages = [];
                for (var lang in langMap) {
                    languages.push(lang);
                }
                languages.sort();
                //console.warn('languages: ', languages);
                component.set('v.voices', voices);
                component.set('v.voiceMap', voiceMap);
                component.set('v.languages', languages);
            }
        }
    },
    
    
    handleCommanderEvent: function(cmp, event){
        //console.warn('commanderVoiceInputHelper.handleCommanderEvent');
        var payload = event.getParam('payload');
        var actionType = payload.clientActionType;
        var state = payload.response.state;
        if (!state){
            console.warn('commanderUtility: ** WARNING ** No state returned by commander.  Using current state...');
            //state = cmp.get('v.commanderState');
        }
        console.warn('payload: ', payload);
        console.warn('actionType: ', actionType);
        console.warn('state: ', state);
    },
        
    handleCommanderEventChange: function(component, event, helper) {
        let self = this;
        let err = null;
        let commanderEvent = component.get('v.commanderEvent');
        console.warn('commanderVoiceInputHelper.handleCommanderEventChange: ', commanderEvent);
        
        self.handleCommanderResponse(component, err, {payload: commanderEvent});
        
    }
    
})