({
    rerender: function(component, helper) {
        this.superRerender();
        console.warn("waveMonitorRenderer.rerender");
    },
    
    afterRender: function(component, helper) {
        this.superAfterRender();
        helper.setup(component);
    }
})