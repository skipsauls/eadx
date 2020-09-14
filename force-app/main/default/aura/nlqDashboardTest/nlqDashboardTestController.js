({
	init: function(component, event, helper) {
        var self = this;		
	},
    
	doUpdateQuery: function(component, event, helper) {
        //console.warn('updateQuery');
        var self = this;
        
        var saql = component.get('v.saql');        
        var nlqDashboard = component.find('nlqDashboard');
        nlqDashboard.updateDashboard(saql);
	}
})