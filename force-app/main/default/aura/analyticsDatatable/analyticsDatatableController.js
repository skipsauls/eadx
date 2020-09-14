({
    init: function(component, event, helper) {
    },
    
    handleSAQLChange: function(component, event, helper) {
        helper.handleSAQLChange(component);    
    },

    handleClick: function (component, event, helper) {
        console.warn('handleClick: ', event);  
    },
    
    handleRowSelection: function (component, event, helper) {
        console.warn('handleRowSelection: ', event);  
    },

    handleSelectedRowsChange: function (component, event, helper) {
        console.warn('handleSelectedRowsChange: ', event);  
    },
    
    handleRowAction: function (component, event, helper) {
        console.warn('handleRowAction: ', event);  
    },
    
    handleSort: function (component, event, helper) {
        var target = event.getSource();
        var fieldName = event.getParam('fieldName');
        var sortDirection = event.getParam('sortedDirection');
        // assign the latest attribute with the sorted column fieldName and sorted direction
        
        var sortDirection = component.get("v.defaultSortedDirection");
        sortDirection = sortDirection === 'asc' ? 'desc': 'asc';
        
        component.set("v.sortedBy", fieldName);
        component.set("v.sortedDirection", sortDirection);
        component.set("v.defaultSortedDirection", sortDirection);
        helper.sortData(component, fieldName, sortDirection);        
    }    
})