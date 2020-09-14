({
    afterRender: function(component, helper) {
        this.superAfterRender(component, helper);
        helper.setPanelSize(component);
    }
})