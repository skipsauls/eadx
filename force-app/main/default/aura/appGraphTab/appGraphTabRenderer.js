({
    afterRender: function(component, helper) {
        this.superAfterRender();
        
        window.onresize = function(event) {
            helper.handleResize(component);
		};
    }
})