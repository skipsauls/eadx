({
    init: function(component, event, helper) {
        helper.init(component);
    },
    
    log: function(component, event, helper) {
        let params = event.getParam('arguments');
        let entry = {
            user: params.user,
            text: params.text,
            delay: params.delay || 0
        }
        // Handle older style
        if (entry.user === 'left') {
            entry.user = {
                type: 'system',
                name: 'System'
            };
        } else if (entry.user === 'right') {
            entry.user = {
                type: 'user',
                name: 'User'
            };            
        }
        helper.log(component, entry);
    },
    
    clear: function(component, event, helper) {
        helper.clear(component);
    },
    
})