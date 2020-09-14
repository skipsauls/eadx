({
    afterRender: function(component, helper) {
        this.superAfterRender();
        helper.changeASIN(component);
    }
})