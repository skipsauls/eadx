({
    afterRender: function(component, helper) {
        this.superAfterRender();
        helper.resetWizard(component);
    }
})