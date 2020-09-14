({
	doInit: function(component, event, helper) {
        console.warn('flowTabController.doInit');
		helper.restartFlow(component);
	},
    
    handleFlowStatusChange: function(component, event, helper) {
        console.warn('flowTabController.handleFlowStatusChange');        
        var params = event.getParams();
        console.warn('params: ', JSON.stringify(params, null, 2));
        console.warn('params: ', JSON.parse(JSON.stringify(params)));
        if (params && params.status === 'FINISHED' && params.outputVariables) {
            params.outputVariables.forEach(function(outputVariable) {
                console.warn('outputVariable: ', outputVariable);
                /*
                if (outputVariable.name === 'config') {
                    component.set('v.config', outputVariable.value);
                } else if (outputVariable.name === 'configId') {
                    component.set('v.configId', outputVariable.value);
                }
                */
            });
        }
    }    
    
})