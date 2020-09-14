({
    configureDashboard: function(component, event, helper) {
        
        var modalBody = null;
        
        $A.createComponent("c:wizardModal", {}, function(content, status) {
            if (status === "SUCCESS") {
                modalBody = content;
                console.warn('modalBody: ', modalBody);
                component.find('overlayLib').showCustomModal({
                    body: modalBody, 
                    showCloseButton: true,
                    cssClass: "df17eadxWizardDashboard wizard-modal"
                })
                
            }
            
        });        
    }
})