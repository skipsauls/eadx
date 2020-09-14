({
	init: function(component, event, helper) {
        //console.warn('analyticsMagicController.init');
        
        
        var config = component.get('v.config');
        
        if (config === null || typeof config === 'undefined' || config === '') {
			config = {
                type: 'lightning:button',
                attributes: {
                    label: 'Test'
                }
            };
        
            component.set('v.config', JSON.stringify(config));
        }          
        
        helper.restartFlow(component);
	},

    handleRecordIdChange: function(component, event, helper) {
        //console.warn('handleRecordIdChange');
        var recordId = component.get('v.recordId');
        //console.warn('----> recordId: ', recordId);
        helper.restartFlow(component);
    },
    
    handleRecordUpdated: function(component, event, helper) {
        console.warn('handleRecordUpdated');
    },
    
    handleFlowStatusChange: function(component, event, helper) {
        //console.warn('analyticsMagicController.handleFlowStatusChange');        
        var params = event.getParams();
        //console.warn('params: ', JSON.stringify(params, null, 2));
        //console.warn('params: ', JSON.parse(JSON.stringify(params)));
        if (params && params.status === 'FINISHED' && params.outputVariables) {
            params.outputVariables.forEach(function(outputVariable) {
                //console.warn('outputVariable: ', outputVariable);
                if (outputVariable.name === 'config') {
                    component.set('v.config', outputVariable.value);
                } else if (outputVariable.name === 'configId') {
                    component.set('v.configId', outputVariable.value);
                }
            });
        }
    }    
})