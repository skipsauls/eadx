({
    handleAttributeChange: function(component, event, helper) {
        console.warn('handleRecordIdChange');
        var recordId = component.get('v.recordId');
        console.warn('recordId: ', recordId);
        var configName = component.get('v.configName');
        console.warn('configName: ', configName);
        
        var attributes = {
            recordId: recordId,
            configName: configName
        };
        
        $A.createComponent('c:analyticsMagic', attributes, function(cmp, msg, err) {
            var magic = component.find("magic");
            if (err) {
                console.warn("error: ", err);
            } else {
                magic.set("v.body", [cmp]);
            }            
        });        
    },
})