({
	handleViewChange: function(component, event, helper) {
        //helper.getViewData(component);
	},
    
    handleToolbarAction: function(component, event, helper) {
        let toolbarAction = component.get('v.toolbarAction');
        if (toolbarAction === 'upload') {
          	helper.uploadViewData(component);
        }
        component.set('v.toolbarAction', null);
    }
})