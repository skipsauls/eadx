({
	init: function(component, event, helper) {
        try {
            let teamInfoJson = component.get('v.teamInfo');
            //console.warn('teamInfoJson: ', teamInfoJson);
            let teamInfo = JSON.parse(teamInfoJson);
            //console.warn('teamInfo: ', teamInfo);
            let teamContext = teamInfo.context;
            component.set('v.teamContext', teamContext);
            let chatId = teamContext.chatId;
            
            helper.getConfig(component, chatId, function(err, config) {
                console.warn('getConfig returned: ', config);
                if (err) {
                    console.error('getConfig error: ', err);
                } else {
		            component.set('v.chatConfig', config);
                }
            });
        } catch (e) {
            console.error('Exception: ', e);
            let chatId = 'DEFAULT';
            helper.getConfig(component, chatId, function(err, config) {
                console.warn('getConfig returned: ', config);
                if (err) {
                    console.error('getConfig error: ', err);
                } else {
		            component.set('v.chatConfig', config);
                }
            });
        }
	}
})