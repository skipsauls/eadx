({
	init: function(component, event, helper) {
        var f = format('#,##0.00', 123456789.123);
        console.warn('f: ', f);
        
		helper.showKPI(component);
	},

	handleSAQLChange: function(component, event, helper) {
        helper.showKPI(component);
	},

    handleIndexChange: function(component, event, helper) {
        console.warn('params: ', event.getSource(), event.getSource().get('v.value'));
        var index = event.getSource().get('v.value');
        console.warn('index: ', index);
        component.set('v.index', index);
    },

    handleKPIChange: function(component, event, helper) {
        helper.handleKPIChange(component);
	}
    
})