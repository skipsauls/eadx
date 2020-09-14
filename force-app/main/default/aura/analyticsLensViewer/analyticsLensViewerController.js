({
    handleLensIdChange: function(component, event, helper) {
        var lensId = component.get('v.lensId');
        //console.warn('lensId: ', lensId);
        if (lensId !== null && typeof lensId !== 'undefined') {
	        helper.showLens(component, lensId);
        }
	},
    
    handleEditSAQLChange: function(component, event, helper) {
    },
    
    execQuery: function(component, event, helper) {
        var editSaql = component.get('v.editSaql');        
        //console.warn('execQuery: ', editSaql);
        component.set('v.saql', editSaql);
    }
    
    
})