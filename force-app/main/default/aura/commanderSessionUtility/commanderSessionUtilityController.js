({
    init: function(cmp, event, helper){
        helper.disablePopoutSupport(cmp);
        var sessionData = helper.loadSessionData(cmp);
        cmp.set('v.sessionData', sessionData);
        var names = [];
        for (name in sessionData){
            names.push(name);
        }
        cmp.set('v.sessionNames', names);
        cmp.set('v.selectedSession', names[0]);   
        var utterances = sessionData[names[0]];
        cmp.set('v.sessionUtterances', utterances);
        cmp.set('v.utterance', utterances[0]);        
    },
    onSessionChange: function(cmp, event, helper){
    	var selectedSession = cmp.get('v.selectedSession');
        var sessionData = cmp.get('v.sessionData');
        var utterances = sessionData[selectedSession];
        cmp.set('v.sessionUtterances', utterances);
        cmp.set('v.utterance', utterances[0]);        
    },
	handleFirePhrase: function(cmp, event, helper) {
        var event = $A.get("e.c:ExternalCommanderPhraseEvent");
		event.setParam('phrase', cmp.get('v.utterance'));
        event.fire();
	}
})