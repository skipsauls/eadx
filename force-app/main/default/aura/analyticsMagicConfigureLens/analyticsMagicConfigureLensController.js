({
    init: function(component, event, helper) {
        console.warn('analyticsMagicConfigureLensController.init');
        //helper.showDashboard(component);
        helper.setup(component);
        
    },
    
    handleUpdateKPI: function(component, event, helper) {
        //console.warn('handleSelectLens: ', lensDevName);
        var kpiName = component.get('v.kpiName')
        var kpiStyle = component.get('v.kpiStyle')
        var kpiFormat = component.get('v.kpiFormat')
        var kpiDecimalDigits = component.get('v.kpiDecimalDigits')
        var lensDevName = component.get('v.lensDevName');
        var saql = component.get('v.saql');

		/*        
        console.warn('kpiName: ', kpiName);
        console.warn('kpiStyle: ', kpiStyle);
        console.warn('kpiFormat: ', kpiFormat);
        console.warn('kpiDecimalDigits: ', kpiDecimalDigits);
        console.warn('lensDevName: ', lensDevName);        
        console.warn('saql: ', saql);
        */
        
        if (typeof kpiName !== 'undefined' && kpiName !== null && kpiName !== '') {
            if (typeof lensDevName !== 'undefined' && lensDevName !== null && lensDevName !== '') {
                
                var config = component.get('v.config');
                
                var config = {
                    type: 'c:kpiView',
                    attributes: {
                        lensDevName : lensDevName,
                        kpiName: kpiName,
                        kpiStyle: kpiStyle,
                        kpiFormat: kpiFormat,
                        kpiDecimalDigits: kpiDecimalDigits,
                        saql: saql
                    }
                };
                
                // Store the config JSON so the flow picks it up
                component.set('v.config', JSON.stringify(config));
                
                helper.showKPI(component);                
            }
        }
    },
    
    handleNext: function(component, event, helper) {
        var navigate = component.get('v.navigateFlow');
        navigate('NEXT'); 
    },
    
    handleBack: function(component, event, helper) {
        var navigate = component.get('v.navigateFlow');
        navigate('BACK'); 
    }    
})