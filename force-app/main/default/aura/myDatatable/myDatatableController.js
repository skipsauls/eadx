({
    handleRowSelection: function (component, event, helper) {
		var selectedRows = event.getParam('selectedRows');        
        var event = $A.get("e.c:datatableRowSelection");
        event.setParams({selectedRows: selectedRows});
        event.fire();
    }
})