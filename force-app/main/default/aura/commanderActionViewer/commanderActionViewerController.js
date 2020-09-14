({
    init: function(component, event, helper) {
        component.set('v.actionColumns', helper.actionColumns);
        component.set('v.intentColumns', helper.intentColumns);
        component.set('v.parameterColumns', helper.parameterColumns);
        component.set('v.customApexActionColumns', helper.customApexActionColumns);
        
        helper.refresh(component);        
    },
    
	refresh: function (component, event, helper) {
		var params = event.getParam('arguments');
        var callback = params.callback;
        helper.refresh(component, callback);
    },
    
    handleBack: function(component, event, helper) {
        helper.refresh(component, null);
    },
    
    handleActionRowAction: function(component, event, helper) {
        var rowAction = event.getParam('action');
        console.warn('rowAction: ', rowAction);
        var row = event.getParam('row');  
        console.warn('row: ', row);  
        
        helper.handleActionRowAction(component, rowAction, row);
    },    
    
    handleActionSelect: function(component, event, helper) {
        console.warn('handleActionSelect');
        helper.handleActionSelect(component);
    },

    handleCreateAction: function(component, event, helper) {
        helper.addAction(component);
    },

    handleEditAction: function(component, event, helper) {
        helper.editAction(component);
    },
    
    handleDeleteAction: function(component, event, helper) {
        let action = component.get('v.action');
        let answer = confirm('Are you sure you want to delete action ' + action.name + '?');
        if (answer === true) {
            helper.deleteAction(component);
        }
    },   
    
    //
    //
    // Older functions below, some of these mayneed updating/purging
    //
    // 
     
    handleAddIntent: function(component, event, helper) {
        let actionDetails = component.get('v.actionDetails');
        helper.addIntent(component, actionDetails, function(err, intent) {
            console.warn('addIntent returned: ', intent);
            let action = component.get('v.action');
            setTimeout($A.getCallback(function() {
	            helper.refreshAction(component, action);
            }), 3000);

        });
    },
    
    handleNewParameter: function(component, event, helper) {
        
        // CHANGE TO MATCH handleAddIntent!
      	helper.addParameter(component);  
    },
    
    handleActionChange: function(component, event, helper) {
        helper.handleActionChange(component);
    },
    
    handleSelectIntent: function(component, event, helper) {
        var selectedRows = event.getParam('selectedRows');
        console.warn('selectedRows: ', selectedRows);
        helper.handleSelectIntent(component, selectedRows);
    },
    
    handleIntentAction: function(component, event, helper) {
        var action = event.getParam('action');
        console.warn('action: ', action);
        var row = event.getParam('row');  
        console.warn('row: ', row);  
        
        helper.handleIntentAction(component, action, row);
    },

	handleSelectParameter: function(component, event, helper) {
        var selectedRows = event.getParam('selectedRows');
        console.warn('selectedRows: ', selectedRows);
        //helper.handleSelectParameter(component, selectedRows);
    },

    handleParameterAction: function(component, event, helper) {
        var action = event.getParam('action');
        console.warn('action: ', action);
        var row = event.getParam('row');  
        console.warn('row: ', row);  
        
        helper.handleParameterAction(component, action, row);
    },
    
    handleIntentChanged: function(component, event, helper) {
        console.warn('handleIntentChanged: ', event);
        let draftValue = event.getParam('draftValues')[0];
        helper.updateIntent(component, draftValue);
    },
    
    handleSaveIntents: function(component, event, helper) {
        helper.handleSaveIntents(component);
    },
    
    handleCancelSaveIntents: function(component, event, helper) {
        helper.handleCancelSaveIntents(component);
    },
    
    handleTokenValueChange: function(component, event, helper) {
        console.warn('handleTokenValueChange: ', event);
        
        let target = event.target;
        let value = target.value;
        let name = target.name;
        
        console.warn('value: ', value);
        console.warn('name: ', name);
        
        let intentDetails = component.get('v.intentDetails');
        let tokenDetails = intentDetails.tokenDetails;
        
        tokenDetails.forEach(function(detail) {
            if (detail.name === name) {
                console.warn('matching detail: ', detail);
                detail.value = value;
                helper.generatePhrase(component);
            } 
        });
    }
    
})