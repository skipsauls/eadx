({
	init: function(component, event, helper) {
		helper.execQuery(component);
	},

	handleSAQLChange: function(component, event, helper) {
		helper.execQuery(component);
	},

    handleIndexChange: function(component, event, helper) {
        //console.warn('params: ', event.getSource(), event.getSource().get('v.value'));
        var index = event.getSource().get('v.value');
        //console.warn('index: ', index);
        component.set('v.index', index);
    },

    handleKPIChange: function(component, event, helper) {
        helper.handleKPIChange(component);
	},

	handleLensDevNameChange: function(component, event, helper) {
        console.warn('----------------------------------------> handleLensDevNameChange');
        helper.changeLens(component);
	},
    
    handleFieldNameChange: function(component, event, helper) {
        helper.handleFieldNameChange(component);
	},

    handleFormatChange: function(component, event, helper) {
        helper.handleFormatChange(component);
	},
    
})