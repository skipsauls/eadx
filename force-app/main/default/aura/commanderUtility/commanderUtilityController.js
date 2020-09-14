({
	init : function(cmp, event, helper) {
		cmp.set('v.commanderState', null);
		cmp.set('v.history', []);
		helper.disablePopoutSupport(cmp);
	},
	callCommander : function(cmp, event, helper) {
		helper.callCommander(cmp, event);
	},
	checkForEnter : function(cmp, event, helper) {
		if (event.which === 13) {
			helper.callCommander(cmp, event);
		}
	},
    
    handleCommanderEventPayload: function(cmp, event, helper) {
        console.warn('commanderUtilityController.handleCommanderEventPayload');
    },
    
	handleCommanderEvent : function(cmp, event, helper) {
		helper.fireActionableEvent(cmp, event);
	},
	handleCommanderError : function(cmp, event, helper) {
		var errorMessage = event.getParam('message');
		helper.toaster(errorMessage, 'error', '8000');
		cmp.set('v.requestInProgress', false);
	},
	checkForArrow : function(cmp, event, helper) {
		if (event.which === 38) { // up arrow
			helper.historyUp(cmp);
		} else if (event.which === 40) { // down arrow
			helper.historyDown(cmp);
		} else if (event.which === 27) { // esc 
			helper.closeUtilityBar(cmp);
		}
	},
	closeHelp : function(cmp, event, helper) {
		cmp.set('v.helpOpen', false);
	},
	onContextualStateChange : function(cmp, event, helper) {
		helper.pwd(cmp);
	},
	onRequestInProgressChange : function(cmp, event, helper) {
		var inProgress = event.getParam('value');
		helper.determineIconBasedOnState(cmp);
	},
	onCommanderChannelChange : function(cmp, event, helper) {
		helper.determineIconBasedOnState(cmp, cmp.find("utilitybar"));
	},
	onRecordingSessionChange : function(cmp, event, helper) {
		var current = event.getParam("value");
		if (null == current || $A.util.isEmpty(current)) {
			helper.toaster('Stopped recording session.', 'success');
			helper.fireSessionReloadEvent(null);
		} else if (current.operation == "OP_START") {
			helper.toaster('Started recording session \''
					+ current.session.Name + '\'', 'success');
		} else {
			helper.toaster((current.operation == "OP_STOP" ? 'Stopped'
					: 'Deleted')
					+ ' recording session \'' + current.session.Name + '\'',
			'success');
		}
		helper.determineIconBasedOnState(cmp);
	},
	handleExternalPhraseEvent : function(cmp, event, helper) {
        /*
		if (cmp.get('v.requestInProgress')) {
			helper.toaster('Requests are in progress, please wait...', 'error',
			'8000');
			return;
		}
        */
		if (cmp.get('v.recordingSession')) {
			helper
			.toaster(
					'Recording in progress. All requests must be initiated from command line.',
					'error', '8000');
			return;
		}
		var phrase = event.getParam('phrase');
		var disableTyping = event.getParam('disableTyping') || false;
		$A.log('commanderUtility: Received external command:' + phrase);
		console.warn('commanderUtility: Received external command:', phrase);
		if (null != phrase && phrase !== '') {
			// Determine whether to simulate typing or not
			if (disableTyping === true) {
				cmp.set('v.command', phrase);
				helper.callCommander(cmp, disableTyping);
			} else {
				helper.issueExternalCommand(cmp, phrase);
			}
		}
	},
	handleExpandedClick : function(cmp, event, helper) {
		let expanded = cmp.get('v.expanded');
		cmp.set('v.expanded', !expanded);
		helper.setPanelSize(cmp);
	}
})