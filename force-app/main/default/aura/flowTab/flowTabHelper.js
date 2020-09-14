({
	restartFlow: function(component) {
        console.warn('flowTabHelper.restartFlow');
        var screenName = component.get('v.screenName');
        var flowName = component.get('v.flowName');
        var flow = component.find('flowData');        
        
        var inputVariables = [
            {
                name: 'screenName',
                type: 'String',
                value: screenName
            }
        ];
        
        if (typeof flow !== 'undefined' && flow !== null) {
	        flow.startFlow(flowName, inputVariables);        
        }

	}
})