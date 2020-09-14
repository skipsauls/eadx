({
	callCommander: function(cmp, disableTyping) {
		if (cmp.get('v.requestInProgress') || !cmp.get('v.command')){
			return;
		}
		var command = cmp.get('v.command');
		var history = cmp.get('v.history');
		if (command && command.trim() !== ''){
			var segments = command.split(' ');
			var firstSegment = segments[0];
			// It's a local command
			if (firstSegment === '?cws'){
				this.cws(cmp);
			} else if (firstSegment === '?cs'){
				this.cs(cmp, segments.slice(1).join());
			} else if (firstSegment === '??'){
				this.help(cmp);
			} else{                
				cmp.set('v.requestInProgress', true);
				var commanderApi = cmp.find('commanderApi');
				var sessionRecordingApi, recordingSession = cmp.get('v.recordingSession');
                console.warn('calling commanderApi.interpretAndInvoke with command: ', command);
				commanderApi.interpretAndInvoke(command, function(response){
                    console.warn('commanderApi.interpretAndInvoke response: ', response);
					cmp.set('v.requestInProgress', false);
					// Let's check to see if we need to record the command.
					// 1) Session must exist, and
					// 2) Command target isn't a session recording action.
					if (recordingSession && null != response &&
							(null == response.action.commandTarget || 
									response.action.commandTarget.name !== "SessionRecordingInvocable")){
						sessionRecordingApi = cmp.find('sessionRecordingApi');
						sessionRecordingApi.createPhrase(recordingSession.session.Id, command, function(result){
							$A.log('commanderUtility: Successfully created session command with id', result.Id);
						}, function(error){
							$A.log('commanderUtility: Failed to create session command phrase. ' + error );
							$A.log('commanderUtility: Cancelling client-side recording session. You might need to manually stop the session.');
							cmp.set('v.recordingSession', null);
						})
					}
				});
				if (disableTyping !== true) {
					this.closeUtilityBar(cmp);
				}
			}
			history.push(command);
			cmp.set('v.history', history);
			cmp.set('v.historyIndex', null);
			cmp.set('v.command', null);
		}
	},
	typeRemaining: function(cmp, helper, delayEntries, inputTextComponent){
		var command = cmp.get('v.command');
		var remaining = cmp.get('v.externalCommand');
		var delay = delayEntries[Math.floor(Math.random()*delayEntries.length)];
		var intervalTimer = cmp.get('v.keypressTimer');
		if (intervalTimer){
			window.clearInterval(intervalTimer);
			cmp.set('v.keypressTimer', null);
		}
		if (remaining != null && remaining.length > 0){
			command = ((null == command) ? "" : command) + remaining.charAt(0);
			remaining = remaining.substring(1);
			cmp.set('v.command', command);
			cmp.set('v.externalCommand', remaining);
			if (remaining.length > 0){
				intervalTimer = window.setInterval($A.getCallback(function(){
					helper.typeRemaining(cmp, helper, delayEntries, inputTextComponent);
				}), delay);
				cmp.set('v.keypressTimer', intervalTimer);
			} else {
				inputTextComponent.focus();
				helper.callCommander(cmp);
			}
		}
	},
	issueExternalCommand: function(cmp, phrase){
		var delayValues = cmp.get('v.keyTypeDelayMilliseconds');
		var inputText = cmp.find('command');
		this.openUtilityBar(cmp);
		cmp.set('v.command', null);
		cmp.set('v.externalCommand', phrase);
		this.typeRemaining(cmp, this, delayValues, inputText);	
	},
	fireActionableEvent: function(cmp, event){
		var payload = event.getParam('payload');
		cmp.set('v.commanderEvent', payload);
		var actionType = payload.clientActionType;
		var state = payload.response.state;
		if (!state){
			$A.log('commanderUtility: ** WARNING ** No state returned by commander.  Using current state...');
			state = cmp.get('v.commanderState');
		}
		console.warn('getEvent of type: ', actionType);
		var event = cmp.getEvent(actionType);
		if (event){
			switch(actionType){
			case "ViewSobjectType":
				event.setParam('sobjects', 
						payload.response.sobjects);
				break;
			case "ViewAnalyticsDashboard":
				event.setParam('dashboards', 
						payload.response.items);
				break;
			case "AnalyticsDashboardUpdatePage":
				event.setParam('pages', 
						payload.response.items);
				break;
			case "InvocableActionApex":
				event.setParam('target', 
						payload.action.commandTarget);
				event.setParam('actionResults', 
						payload.response.actionResults);
				break;
			case "ChannelSubscribe":
				event.setParam('channels', 
						payload.response.channels);
				break;
			case "DatasetFilter":
			case "DatasetSelection":
				event.setParam('filters',
						payload.response.filters);
				event.setParam('state', state);
				break;    
			}
			// cmp.set('v.commanderEvent', event);
			event.fire();
		} else {
			this.toaster('Unknown event for action type \'' + actionType + '\'', 'error');
		}
	},
	openUtilityBar: function(cmp){
		var utilityApi = cmp.find("utilitybar");
		if (utilityApi){
			utilityApi.openUtility();            
		}        
	},
	closeUtilityBar: function(cmp){
		var utilityApi = cmp.find("utilitybar");
		if (utilityApi){
			utilityApi.minimizeUtility();            
		}        
	},
	historyUp: function(cmp){
		var index = cmp.get('v.historyIndex');
		var history = cmp.get('v.history');
		var index = index == null || index === undefined ? 
				history.length-1 :
					index >= 0 ? index -1 : index;
					if (index >= 0){
						cmp.set('v.command', history[index]);
						cmp.set('v.historyIndex', index);
					}
	},
	historyDown: function(cmp){
		var index = cmp.get('v.historyIndex');
		var history = cmp.get('v.history');
		var indexSet = index != null && index !== undefined;
		var index =  indexSet ? index+1 : index;
		if (indexSet && index < history.length){
			cmp.set('v.command', history[index]);
			cmp.set('v.historyIndex', index);
		} else {
			cmp.set('v.command', null);
			cmp.set('v.historyIndex', null);            
		}
	},
	cws: function(cmp){
		var commanderState = cmp.get('v.commanderState');
		var rv = 'Commander State: ' + ((commanderState === undefined || 
				commanderState === null || 
				commanderState.trim() === '') ? 
						'<root>' : commanderState);
		this.toaster(rv, 'success');
	},
	cs: function(cmp, path){
		var commanderState = cmp.get('v.commanderState');
		var pathSegments = path.split('/').filter(function (el) {
			return el.trim() !== '';
		});
		if (path.startsWith('/') || commanderState.trim() === ''){
			commanderState = pathSegments.join('.');
		} else {        
			commanderState += '.' + pathSegments.join('.');
		}
		cmp.set('v.commanderState', commanderState);
		this.cws(cmp);
	},
	help: function(cmp){
		cmp.set('v.helpOpen', true);        
	},
	toaster: function(message, type, duration){
		var toastEvent = $A.get("e.force:showToast");
		if (toastEvent){
			toastEvent.setParams({
				message: message,
				duration: duration ? duration : '5000',
						key: 'info_alt',
						type: type,
						mode: 'pester'
			});
			toastEvent.fire();            
		}
		else{
			$A.log('commanderUtilityController: ' + message);
		}        
	},
	disablePopoutSupport: function(cmp) {
		/*
		 * var utilityApi = cmp.find("utilitybar"); if (utilityApi){
		 * utilityApi.getAllUtilityInfo().then(function(response) { var
		 * thisUtilityInfo = response[1];
		 * utilityApi.disableUtilityPopOut({utilityId: thisUtilityInfo.id,
		 * disabled: true}) .then(function(response){ $A.log('commanderUtility:
		 * Successfully disabled pop-out support.'); }).catch(function(error) {
		 * console.log('commanderUtility: Unable to disable pop-out support.' +
		 * error); }); }) }
		 */
	},
	updateUtilityIcon: function(cmp, icon){
		var icon, utilityApi = cmp.find("utilitybar");
		if (utilityApi){
			icon = {
					icon: icon
			};
			utilityApi.setUtilityIcon(icon);
			utilityApi.setPanelHeaderIcon(icon);
		}
	},
	determineIconBasedOnState: function(cmp){
		var channel = cmp.get('v.commanderChannel');
		var requestInProgress = cmp.get('v.requestInProgress');
		var recordingSession = cmp.get('v.recordingSession');
		var icon;
		if (requestInProgress){
			icon = 'utility:spinner';
		} else if (recordingSession){
			icon = 'utility:listen';
		} else if (channel){
			icon = 'utility:broadcast';
		} else {
			icon = 'utility:unmuted'
		}
		this.updateUtilityIcon(cmp, icon);
	},
	setPanelSize: function(cmp) {
		let expanded = cmp.get('v.expanded');
		let utilityApi = cmp.find("utilitybar");
		if (utilityApi){
			utilityApi.getUtilityInfo().then(function(utilityInfo) {
				console.warn('getUtilityInfo setPanelHeight({heightPX, utilityId}): ', utilityInfo);
				let panelHeight = utilityInfo.panelHeight;
				let panelWidth = utilityInfo.panelWidth;

				let size = expanded ? cmp.get('v.expandedSize') : cmp.get('v.collapsedSize');

				console.warn('size: ', size);

				utilityApi.setPanelHeight({heightPX: size.height, utilityId: utilityInfo.id}).then(function(res) {
					console.warn('setPanelHeight returned: ', res);
				}).catch(function(error) {
					console.warn('setPanelHeight error: ', error);                    
				});

				utilityApi.setPanelWidth({widthPX: size.width, utilityId: utilityInfo.id}).then(function(res) {
					console.warn('setPanelWidth returned: ', res);
				}).catch(function(error) {
					console.warn('setPanelWidth error: ', error);                    
				});

			}).catch(function(error) {
				console.error('getUtilityInfo error: ', error);
			})
		}            
	},
	fireSessionReloadEvent: function(sessionId){
		var event = $A.get("e.c:RecordedSessionReloadEvent");
		event.setParam('recordedSessionId', sessionId);
		event.fire();        
	}
})