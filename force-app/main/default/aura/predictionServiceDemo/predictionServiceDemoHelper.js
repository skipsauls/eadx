({
    chatConfig: {
        'chocks': {
            name: 'Chocks',
            record: 'a0WB0000000Zq0CMAS',
            index: 0
        },
        'bobby': {
            name: 'Bobby',
            record: 'a1SB0000000A9laMAC',
            index: 1
        },
        'DEFAULT': {
            name: 'Demo',
            record: 'a0WB0000000Zq0CMAS',
            index: 0
        }
    },
    
    getConfig: function(component, chatId, callback) {
        let self = this;
        
        let chatConfig = null;
        try {
            chatConfig = self.chatConfig[chatId];
            callback(null, chatConfig);
        } catch (e) {
            chatConfig = self.chatConfig['DEFAULT'];
        }

        if (typeof callback === 'function') {
            callback(null, chatConfig);
        }
        
        /*
        let action = component.get("c.getConfig");
        let self = this;
        
        action.setParams({
            chatId: chatId
        });
        action.setCallback(this, function(response) {
            //console.warn('getConfig response: ', response);
            var state = response.getState();
            //console.warn('state: ', state);
            if (state === "SUCCESS") {
                var val = response.getReturnValue();
                //console.warn('val: ', val);
                let chatConfig = JSON.parse(val);
                if (typeof callback === 'function') {
                    callback(null, chatConfig);
                }
            } else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var err = response.getError();
                console.error('error: ', err);
                if (typeof callback === 'function') {
                    callback(err, null);
                }
            }            
        });
        $A.enqueueAction(action);
        */
    }
})