({
	init: function(component, event, helper) {
        console.warn('wizardStartScreenController.init');
		helper.setup(component);
	},
    
    chooseStart: function(component, event, helper) {
        var target = event.getSource();
        var name = target.get('v.name');
        console.warn('name: ', name);
        component.set('v.startFrom', name);
        
		var navigate = component.get('v.navigateFlow');
		navigate('NEXT');        
    },
    
    handleFlowStatusChange: function(component, event, helper) {
        console.warn('wizardStartScreenController.handleFlowStatusChange');
        var params = event.getParams();
        console.warn('params: ', params, JSON.parse(JSON.stringify(params)));
        /*
		var flow = component.find("flowData");
        var outputVariables = flow.get('v.outputVariables');
        console.warn('outputVariables: ', outputVariables);
        */
        
    }
})