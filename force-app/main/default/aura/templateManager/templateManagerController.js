({
    doInit: function(component, event, helper) {
        helper.setup(component);
    },
    
    handleRowSelection: function (component, event, helper) {
        console.warn('handleRowSelection');
		var selectedRows = event.getParam('selectedRows');        
        console.warn('selectedRows: ', selectedRows);
        
        var event = $A.get("e.c:datatableRowSelection");
        console.warn('event: ', event);
        event.setParams({selectedRows: selectedRows});
        event.fire();
        
    },
    
    handleDatatableRowSelectionEvent: function(component, event, helper) {
        console.warn('templateManagerController.handleDatatableRowSelectionEvent: ', event);    
    },
    
	handleSelectedRowsChange: function (component, event, helper) {
        console.warn('handleSelectedRowsChange');
		var selectedRows = component.get('v.selectedRows');        
        console.warn('selectedRows: ', selectedRows);
    },
    
    handleRowAction: function (component, event, helper) {
        console.warn('handleRowAction');
        var action = event.getParam('action');
        var row = event.getParam('row');
        console.warn('action: ', action);
        console.warn('row: ', row);
        
    },
    
    handleCreateMenuSelect: function(component, event, helper) {
        var value = event.getParam("value");
        if (value === 'app') {
	        helper.createApp(component);            
        } else if (value === '') {
        }
    },
    
    handleSort: function (component, event, helper) {
        var target = event.getSource();
        var fieldName = event.getParam('fieldName');
        var sortDirection = event.getParam('sortedDirection');
        // assign the latest attribute with the sorted column fieldName and sorted direction
        
        var sortDirection = component.get("v.defaultSortDirection");
        sortDirection = sortDirection === 'asc' ? 'desc': 'asc';
        
        component.set("v.sortedBy", fieldName);
        component.set("v.sortedDirection", sortDirection);
        component.set("v.defaultSortDirection", sortDirection);
        helper.sortData(component, fieldName, sortDirection);        
    }
    
})