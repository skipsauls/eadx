({
	doInit: function(component, event, helper) {
        console.warn('backgroundTesdController.doInit');
        var recordId = component.get('v.recordId');
        console.warn('recordId: ', recordId);
		helper.setupSubscriptions(component);
	},
    
	handleRecordIdChange: function(component, event, helper) {
        console.warn('backgroundTesdController.handleRecordIdChange');
        var recordId = component.get('v.recordId');
        console.warn('recordId: ', recordId);
    }
    
})