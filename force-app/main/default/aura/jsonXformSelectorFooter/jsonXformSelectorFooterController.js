({    
    handleModalCancel: function(component, event, helper) {
        component.set('v.modalAction', 'cancel');
        component.find("overlayLib").notifyClose();
    },
    
    handleModalLoad: function(component, event, helper) {
        component.set('v.modalAction', 'load');
        component.find("overlayLib").notifyClose();
    }
})