({
	handlePrev: function(component, event, helper) {
		helper.callAction(component, 'prevPage');
	},

	handleNext: function(component, event, helper) {
		helper.callAction(component, 'nextPage');
	},
    
})