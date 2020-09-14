({
	restartFlow: function(component) {
        //console.warn('analyticsMagicHelper.restartFlow');
        var title = component.get('v.title');
        var iconName = component.get('v.iconName');
        var configName = component.get('v.configName');
        var recordId = component.get('v.recordId');
        var config = component.get('v.config');

        var flow = component.find('flowData');        
        
        var inputVariables = [
            {
                name: 'title',
                type: 'String',
                value: title
            },
            {
                name: 'iconName',
                type: 'String',
                value: iconName
            },
            {
                name: 'configName',
                type: 'String',
                value: configName
            },
            {
                name: 'recordId',
                type: 'String',
                value: recordId
            },
            {
                name: 'config',
                type: 'String',
                value: config
            }            
        ]
        if (typeof flow !== 'undefined' && flow !== null) {
	        flow.startFlow('Analytics_Magic', inputVariables);        
        }
    }    
})