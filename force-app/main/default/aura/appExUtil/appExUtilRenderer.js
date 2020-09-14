({
    afterRender: function(component, helper) {
        this.superAfterRender(component, helper);
        helper.setup(component);
    }
})