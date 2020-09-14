({
    afterRender: function(component, helper) {
        this.superAfterRender();
		helper.showKPI(component);
    }
})