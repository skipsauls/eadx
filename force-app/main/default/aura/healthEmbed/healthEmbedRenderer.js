({
    afterRender: function(component, helper) {
        this.superAfterRender();
        helper.setup(component);
    }
})