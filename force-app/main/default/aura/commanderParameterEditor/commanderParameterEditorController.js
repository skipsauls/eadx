({
	init : function(cmp, event, helper) {
		cmp.set('v.parameterTypes', helper.parameterTypes);
        
	},
    
    handleCancel: function(component, event, helper) {
        let parameter = component.get('v.parameter');
        parameter.closeAction = 'cancel';
        component.set('v.parameter', parameter);
        component.find("overlayLib").notifyClose();
    },

    handleOK: function(component, event, helper) {
        let parameter = component.get('v.parameter');
        parameter.closeAction = 'ok';
        component.set('v.parameter', parameter);
        component.find("overlayLib").notifyClose();
    }
    
})