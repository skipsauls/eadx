({
    handleCancel: function(component, event, helper) {
        component.set('v.closeAction', 'cancel');
        component.find("overlayLib").notifyClose();
    },
    
    handleLogin: function(component, event, helper) {
        component.set('v.closeAction', 'login');
        component.find("overlayLib").notifyClose();
    }
})