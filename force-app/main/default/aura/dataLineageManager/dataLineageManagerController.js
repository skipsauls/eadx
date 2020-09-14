({
	getLineage: function(component, event, helper) {
        let params = event.getParam('arguments');
        helper.getLineage(component, params);
	}
})