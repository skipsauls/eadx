({
	handleResultBinding: function(component, event, helper) {
		var result = compoent.get("v.result");
        result.forEach(function(row) {            
        });
	},
    
	handleSelectionBinding: function(component, event, helper) {
		var selection = compoent.get("v.selection");
        selection.forEach(function(row) {
        });
	},
    
})