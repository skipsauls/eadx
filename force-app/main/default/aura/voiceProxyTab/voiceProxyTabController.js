({
	doInit: function(component, event, helper) {
        console.warn('window.speechSynthesis: ', window.speechSynthesis);        
        helper.getVoices(component);
    },

	speak: function(component, event, helper) {
        helper.speak(component);
	},
    
	startDictation: function(component, event, helper) {
        helper.startDictation(component);
	},
    
	stopDictation: function(component, event, helper) {
        helper.stopDictation(component);
	},

	handleResultsChange: function(component, event, helper) {
        helper.handleResultsChange(component);
	}
    
})