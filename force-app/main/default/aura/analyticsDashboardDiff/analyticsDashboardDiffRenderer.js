({
    afterRender: function(component, helper) {
        this.superAfterRender(component);
        helper.setup(component);
    }
})