({
	init: function(component, event, helper) {
        //console.warn('analyticsMagicSuggestController.init');
        helper.setup(component);
	},
    
    handleRecordUpdated: function(component, event, helper) {
        //console.warn('analyticsMagicSuggestController.handleRecordUpdated');
        helper.getSuggestions(component);
    },
    
    selectDataset: function(component, event, helper) {
    	component.set('v.assetType', 'dataset');
        var navigate = component.get('v.navigateFlow');
        navigate('NEXT')
    },

    selectDashboard: function(component, event, helper) {
    	component.set('v.assetType', 'dashboard');
        var navigate = component.get('v.navigateFlow');
        navigate('NEXT')        
    },

    selectLens: function(component, event, helper) {
    	component.set('v.assetType', 'lens');
        var navigate = component.get('v.navigateFlow');
        navigate('NEXT')
    },
    
	handleNext: function(component, event, helper) {
		var navigate = component.get('v.navigateFlow');
		navigate('NEXT'); 
    },

	handleBack: function(component, event, helper) {
		var navigate = component.get('v.navigateFlow');
		navigate('BACK'); 
    }  
    
    
})