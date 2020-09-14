({
	restartFlow: function(component) {
        console.warn('voiceFlowHelper.restartFlow');
        var configName = component.get('v.configName');
        var config = component.get('v.config');
        var currentState = component.get('v.currentState');

        var flow = component.find('flowData');        
        
        var inputVariables = [
            {
                name: 'ConfigName',
                type: 'String',
                value: configName
            },
            {
                name: 'Config',
                type: 'String',
                value: config
            },
            {
                name: 'CurrentState',
                type: 'String',
                value: currentState
            }
        ]
        if (typeof flow !== 'undefined' && flow !== null) {
	        flow.startFlow('Voice_Flow', inputVariables);        
        }
    } 
})