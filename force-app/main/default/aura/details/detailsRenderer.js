({
    afterRender: function(component, helper) {
        this.superAfterRender();
        helper.getRecords(component);
    }
})