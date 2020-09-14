({
    defaultSessions: {
        "Learning Adventure Commands": [
            "Learn about charts",
            "Next",
            "Learn about SAQL",
            "Next",
            "Learn about Dynamic Apps",
            "Next"
        ]
	},
	loadSessionData : function(cmp) {
        var sessionRecordingApi = cmp.find('sessionRecordingApi');
        var helper = this;
        sessionRecordingApi.getRecordedSessionTree(
            function(result){helper.sessionDataSuccess(cmp, result)}, 
        	function(result){helper.sessionDataError(cmp, result)});
	},
    sessionDataSuccess: function(cmp, sessionResults){
        var sessionTree = [];
        var sessionMap = {};
        var sessionResult, commandData, sessionTreeItem, commandTreeItem;
        for (var session in sessionResults){
            sessionResult = sessionResults[session];
            sessionTreeItem = {
                label: sessionResult.Name,
                name: sessionResult.Id,
                expanded: false, 
                items: []
            };
            sessionMap[sessionTreeItem.name] = {
                id: sessionResult.Id,
                text: sessionResult.Name,
                type: 'session'
            };
            for (var sessionCommand in sessionResult.SessionCommands__r){
                commandData = sessionResult.SessionCommands__r[sessionCommand];
                commandTreeItem = {
                    label: commandData.phrase__c,
                    name: commandData.Id,
                    expanded: false,
                    items: [],
	                type: 'command'
                };
                sessionMap[commandTreeItem.name] = {
                    id: commandData.Id,
                    sessionId: sessionResult.Id,
                    text: commandData.phrase__c,
                    type: 'command'
                };
                sessionTreeItem.items.push(commandTreeItem);
            }
            sessionTree.push(sessionTreeItem);
        }
        cmp.set('v.sessionMap', sessionMap);           
        cmp.set('v.sessionTree', sessionTree);           
        cmp.set('v.selected', null);           
    },
    sessionDataError: function(cmp, error){
        $A.log('commanderRecordedScript: Failed to load commander recorded session data. ' + error );
        cmp.set('v.sessionTree', null);        
        cmp.set('v.sessionMap', null);        
        cmp.set('v.selected', null);        
    },
    createDefaultSessions: function(cmp, defaultRecordingName){
		var phrases = this.defaultSessions[defaultRecordingName];
        if (phrases) {
            this.createSessionData(cmp, 
                                   defaultRecordingName, 
                                   phrases);
        }
    },
    updateSelected: function(cmp, newValue){
		var selected = cmp.get('v.selected');
        if (selected){
            if (selected.type == 'session'){
                this.updateSession(cmp, selected.id, newValue, true);
            } else {
                this.updatePhrase(cmp, selected.sessionId, selected.id, newValue, true);
            }
        }
    }, 
    deleteSelected: function(cmp){
		var selected = cmp.get('v.selected');
        if (selected){
            if (selected.type == 'session'){
                this.deleteSession(cmp, selected.id, true);
            } else {
                this.deletePhrase(cmp, selected.sessionId, selected.id, true);
            }
        }        
    },
    createSessionData: function(cmp, sessionName, phrases){
        var helper = this;
        var sessionRecordingApi = cmp.find('sessionRecordingApi');
        if (sessionName && phrases){
            sessionRecordingApi.createSession(sessionName, false, 
            	function(recordingSession){
                    var phrase;
                    $A.log('commanderRecordedSetup: Successfully created session with id', recordingSession.Id);
                    for (phrase in phrases){
                        helper.createSessionPhrase(cmp, recordingSession.Id, phrases[phrase], false);
                    }
	                helper.fireSessionReloadEvent(recordingSession.Id);
                }, function(error){
                    $A.log('commanderRecordedSetup: Failed to create recording session.' + error);
                });
        }
    },
    createSessionPhrase: function(cmp, sessionId, phrase, fireEvent){
        var helper = this;
        var sessionRecordingApi = cmp.find('sessionRecordingApi');
        sessionRecordingApi.createPhrase(sessionId, phrase, function(result){
            $A.log('commanderRecordedSetup: Successfully created session phrase with id', result.Id);
            if (fireEvent){
                helper.fireSessionReloadEvent(sessionId);
            }
        }, function(error){
            $A.log('commanderRecordedSetup: Failed to create session command phrase. ' + error );
        });
    },
    deleteSession: function(cmp, sessionId, fireEvent){
        var helper = this;
        var sessionRecordingApi = cmp.find('sessionRecordingApi');
        sessionRecordingApi.deleteSession(sessionId, 
                                          function(result){
                                              $A.log('commanderRecordedSetup: Successfully deleted session with id', sessionId);
                                              helper.loadSessionData(cmp);
                                              if (fireEvent){
                                                  helper.fireSessionReloadEvent(null);
                                              }
                                          },
                                          function(error){
                                              $A.log('commanderRecordedSetup: Unable to delete session' + error);
                                          });
        
    }, 
    deletePhrase: function(cmp, sessionId, commandId, fireEvent){
        var helper = this;
        var sessionRecordingApi = cmp.find('sessionRecordingApi');
        sessionRecordingApi.deletePhrase(commandId, 
                                          function(result){
                                              $A.log('commanderRecordedSetup: Successfully deleted session command with id', commandid);
                                              if (fireEvent){
                                                  helper.fireSessionReloadEvent(sessionId);
                                              }
                                          },
                                          function(error){
                                              $A.log('commanderRecordedSetup: Unable to delete session' + error);
                                          });
        
    }, 
    updateSession: function(cmp, sessionId, newSessionName, fireEvent){
        var helper = this;
        var sessionRecordingApi = cmp.find('sessionRecordingApi');
        sessionRecordingApi.updateSession(sessionId, newSessionName, 
                                          function(result){
                                              $A.log('commanderRecordedSetup: Successfully saved session with id', result.Id);
                                              if (fireEvent){
                                                  helper.fireSessionReloadEvent(sessionId);
                                              }
                                          },
                                          function(error){
                                              $A.log('commanderRecordedSetup: Unable to save session' + error);
                                          });
        
    }, 
    updatePhrase: function(cmp, sessionId, commandId, newPhrase, fireEvent){
        var helper = this;
        var sessionRecordingApi = cmp.find('sessionRecordingApi');
        sessionRecordingApi.updatePhrase(commandId, newPhrase, 
                                         function(result){
                                             $A.log('commanderRecordedSetup: Successfully saved session with id', result.Id);
                                             if (fireEvent){
                                                 helper.fireSessionReloadEvent(sessionId);
                                             }
                                         },
                                         function(error){
                                             $A.log('commanderRecordedSetup: Unable to save session' + error);
                                         });
    },
    fireSessionReloadEvent: function(sessionId){
		var event = $A.get("e.c:RecordedSessionReloadEvent");
        event.setParam('recordedSessionId', sessionId);
        event.fire();        
    }
})