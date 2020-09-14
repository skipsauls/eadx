({
	init: function(component, event, helper) {
        console.warn('wizardFlowTabController.init');
        var flow = component.find('flowData');
        if (typeof flow !== 'undefined' && flow !== null) {
	        flow.startFlow('Demo3');
        }        
        /*
        helper.setup(component, function(err, config) {
            if (err) {
                
            } else {
				var flow = component.find('flowData');        
                flow.startFlow('Demo3');
            }
        });
        */
	},
    
    chooseStart: function(component, event, helper) {
        var target = event.getSource();
        var name = target.get('v.name');
        console.warn('name: ', name);
        component.set('v.startFrom', name);
    },
    
    handleFlowStatusChange: function(component, event, helper) {
        console.warn('wizardFlowTabController.handleFlowStatusChange');        
        var params = event.getParams();
        console.warn('params: ', JSON.stringify(params, null, 2));
        console.warn('params: ', JSON.parse(JSON.stringify(params)));
        /*
		var flow = component.find("flowData");
        var outputVariables = flow.get('v.outputVariables');
        console.warn('outputVariables: ', outputVariables);
        */
        
    }
})