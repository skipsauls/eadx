({
    init: function(cmp, event, helper){
    }, 
    
    setAssetCompleteHandler : function(cmp, event, helper) {
		helper.setStateEventHandler(cmp, event, 'v.onAssetCompleteHandler');		
	},
    
    setErrorHandler : function(cmp, event, helper) {
		helper.setStateEventHandler(cmp, event, 'v.onErrorHandler');		
	},
    
	start : function(cmp, event, helper) {
		helper.start(cmp);
	},
    
	stop : function(cmp, event, helper) {
		helper.stop(cmp);		
	}
})