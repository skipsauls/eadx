({
	init: function(component, event, helper) {
		component.set('v.keyField', 'fieldName');
		component.set('v.columns', helper.columns);
		component.set('v.data', helper.data);
		component.set('v.selectedRows', helper.selectedRows);
	},
    
    handleSearchTermChange: function(component, event, helper) {
     	let searchTerm = component.get('v.searchTerm');
        let data = component.get('v.data');
        let selectedRows = component.get('v.selectedRows');
        data.forEach(function(item) {
            item.fieldName = item.fieldName.replace('_hidden', '');
            if (item.fieldName.indexOf(searchTerm) >= 0) {
                
            } else {
                item.fieldName = item.fieldName + '_hidden';
            }            
        });
        component.set('v.data', data);
        component.set('v.selectedRows', selectedRows);
    },
    
    handleRowSelection: function(component, event, helper) {
        console.warn('handleRowSelection');
        let selectedRows = event.getParam('selectedRows');
        selectedRows.forEach(function(selectedRow) {
            console.warn('selectedRow: ', selectedRow); 
        });
        let currentSelectedRows = component.get('v.selectedRows');
        currentSelectedRows.forEach(function(name) {
            console.warn('name: ', name);
        });
        
        return;
        let newSelectedRows = [];
        let data = component.get('v.data');
        let dataMap = {};
        let fieldName = null;
        data.forEach(function(item) {
            if (item.fieldName.indexOf('_hidden') >= 0) {
                fieldName = item.fieldName.replace('_hidden', '');
                console.warn('fieldName: ', fieldName);
                currentSelectedRows.forEach(function(name) {
                    console.warn('name: ', name);
                    if (name === fieldName) {
                        newSelectedRows.push(fieldName + '_hidden');
                    }
                });
            } else {
                fieldName = item.fieldName;
                console.warn('fieldName: ', fieldName);
                selectedRows.forEach(function(name) {
                    console.warn('name: ', name);
                    if (name === fieldName) {
                        newSelectedRows.push(fieldName);
                    }
                });
            }
        });
        
        component.set('v.selectedRows', newSelectedRows);
    }
})