({
    init: function(component, event, helper) {
        //helper.listLenses(component); 
        console.log("init"); 
    },
        
    handleSelectLens: function(component, event, helper) {
        console.warn('handleSelectLens');
        var row = event.getParam('row');
        console.warn('row: ', row);
        
    },
    
    handleSelectResult: function(component, event, helper) {
        console.warn('handleSelectResult');
        var row = event.getParam('row');
        console.warn('row: ', row);
    },
    
    handleLensAction: function (component, event, helper) {
        var action = event.getParam('action');
        var row = event.getParam('row');
        console.warn('action: ', action);
        console.warn('row: ', row);
        
        helper.handleAction(component, action, row);
    }
})