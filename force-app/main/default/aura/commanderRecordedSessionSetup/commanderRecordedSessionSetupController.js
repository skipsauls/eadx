({
	init : function(cmp, event, helper) {
		helper.loadSessionData(cmp);
	},
    handleSelect: function(cmp, event, helper){
        var sessionMap = cmp.get('v.sessionMap');
        cmp.set('v.selected', sessionMap[event.getParam('name')]);
    },
    updateItem: function(cmp, event, helper){
        helper.updateSelected(cmp, cmp.find('selectedText').get('v.value'));
    },
    deleteItem: function(cmp, event, helper){
        helper.deleteSelected(cmp);        
    },
    tryCommandPhrase: function(cmp, event, helper){
		var event = $A.get("e.c:ExternalCommanderPhraseEvent");
        event.setParam('phrase', cmp.get('v.selected.text'));
        event.fire();        
    },
    onCreateDefaultLearningAdventure: function(cmp, event, helper){
        var value = cmp.find('learningAdventureDataCreator').get('v.checked');
        if (value){
            helper.createDefaultSessions(cmp, 'Learning Adventure Commands');
        }
    },
    handleGlobalRecordingSessionReloadEvent: function(cmp, event, helper){
        helper.loadSessionData(cmp);
    },

})