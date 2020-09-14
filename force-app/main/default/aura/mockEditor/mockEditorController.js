({
	doInit: function(component, event, helper) {
		helper.listMocks(component);
	},
    
    handleSelectMockName: function(component, event, helper) {
		helper.selectMock(component, event);
	},

    updateMock: function(component, event, helper) {
		helper.updateMock(component, event);
	},
    
    deleteMock: function(component, event, helper) {
		helper.deleteMock(component, event);
	}
})