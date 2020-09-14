({
    afterRender: function(component, helper) {
        this.superAfterRender();
        helper.setupMessageListener(component);
    }
})