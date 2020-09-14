({
	handleCommanderAction: function(component, event, helper) {
		//console.warn('AnaltyicsVoiceAliasHandlerController.handleCommanderAction');
        var params = event.getParam('arguments');
        //console.warn('params: ', params);
        if (params) {
            let payload = params.payload;
            let callback = params.callback;
            helper.handleCommanderPayload(component, payload, callback);
        }
	}
})