({
    handleCancel: function(component, event, helper) {
        component.find("overlayLib").notifyClose();
    },
    
    handleOK: function(component, event, helper) {
        component.find("overlayLib").notifyClose();
    }
})