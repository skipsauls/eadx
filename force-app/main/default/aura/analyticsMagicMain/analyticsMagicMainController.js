({
	init: function(component, event, helper) {
        //console.warn('analyticsMagicMainController.init');
      
	},
    
    handleRecordUpdated: function(component, event, helper) {
        //console.warn('analyticsMagicMainController.handleRecordUpdated');
    },
    
    handleConfigure: function(component, event, helper) {
        //console.warn('analyticsMagicMainController.handleRecordUpdated');
        
        var navigate = component.get('v.navigateFlow');
        navigate('NEXT');          
    }
    
})