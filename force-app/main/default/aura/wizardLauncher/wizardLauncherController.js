({
    launch: function(component, event, helper) {
        
        var params = event.getParam('arguments');
        if (params) {
            var flowName = params.flowName;
            var inputVariables = params.inputVariables;
            var title = params.title;
            var showCloseButton = params.showCloseButton;
            var callback = params.callback; // Is this needed?            
            var modalBody = null;
            
            console.warn('flowName: ', flowName);
            console.warn('showCloseButton: ', showCloseButton);
            console.warn('title: ', title);
            
            $A.createComponent("c:wizardModal", {title: title, flowName: flowName, inputVariables: inputVariables}, function(content, status) {
                if (status === "SUCCESS") {
                    modalBody = content;
                    console.warn('modalBody: ', modalBody);
                    component.find('overlayLib').showCustomModal({
                        header: title,
                        body: modalBody, 
                        showCloseButton: showCloseButton,
                        cssClass: "eadxWizardLauncher wizard-modal"
                    });
                    
                }
                
            });        
        }
    }        
})