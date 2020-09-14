({
	init: function(component, event, helper) {
		helper.createUserRoleTree(component);
	},

    handleSelectionChanged: function (component, event, helper) {
        //console.warn('handleSelectionChanged: ', event.getParams(), JSON.stringify(event.getParams(), null, 2));
        
        
    },
    
    handleSelect: function (component, event, helper) {
        //console.warn('handleSelect: ', event.getParams(), JSON.stringify(event.getParams(), null, 2));
        var name = event.getParam('name');
        helper.selectItem(component, name);
    }
})