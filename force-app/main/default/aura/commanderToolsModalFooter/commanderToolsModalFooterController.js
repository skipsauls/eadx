({
    handleCancel: function(component, event, helper) {
        component.set('v.closeAction', 'cancel');
        component.find("overlayLib").notifyClose();
    },
    
    handleSave: function(component, event, helper) {
        component.set('v.closeAction', 'save');
        component.find("overlayLib").notifyClose();
    }
})