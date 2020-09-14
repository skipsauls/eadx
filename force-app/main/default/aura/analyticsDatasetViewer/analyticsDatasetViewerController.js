({
	clearSelections: function(component, event, helper) {
        var fields = component.get('v.fields');
        fields.forEach(function(field) {
            field.selected = false;
        });
        component.set('v.fields', fields);
		helper.generateSAQL(component);        
    },

	selectAll: function(component, event, helper) {
        var fields = component.get('v.fields');
        var showAllFields = component.get('v.showAllFields');
        fields.forEach(function(field) {
            if (showAllFields === true || field.hasLabel === true) {
            	field.selected = true;                
            }
        });
        component.set('v.fields', fields);
		helper.generateSAQL(component);        
    },
    
    toggleField: function(component, event, helper) {
    	var pill = event.getSource();
        //console.warn('pill: ', pill.get('v.label'), pill.get('v.name'));
        //var selected = pill.get('v.selected');
        //pill.set('v.selected', !selected);
        var fields = component.get('v.fields');
        fields.forEach(function(field) {
            if (field.name === pill.get('v.name')) {
                field.selected = !field.selected;
            } 
        });
        component.set('v.fields', fields);
		helper.generateSAQL(component);        
    },

    handleChangeLimit: function(component, event, helper) {
    	var limit = component.get('v.limit');
        //console.warn('limit: ', limit);
		helper.generateSAQL(component);        
    },
    
    handleDatasetIdChange: function(component, event, helper) {
        var datasetId = component.get('v.datasetId');
        if (datasetId !== null && typeof datasetId !== 'undefined') {
	        helper.showDataset(component, datasetId);
        }
	},
    
    handleEditSAQLChange: function(component, event, helper) {
    },
    
    execQuery: function(component, event, helper) {
        var editSaql = component.get('v.editSaql');        
        component.set('v.saql', editSaql);
    }
    
    
})