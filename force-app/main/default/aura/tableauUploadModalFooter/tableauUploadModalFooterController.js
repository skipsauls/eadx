({
    handleCancel: function(component, event, helper) {
        component.set('v.closeAction', 'cancel');
        component.find("overlayLib").notifyClose();
    },
    
    handleOK: function(component, event, helper) {
        component.set('v.closeAction', 'okay');
        component.find("overlayLib").notifyClose();
    }
})