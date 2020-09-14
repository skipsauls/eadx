({
	handleAnalyticsAppCreate: function(cmp, event, helper) {
		var autoInstallRequest = event.getParam('autoInstallRequest');
        if (autoInstallRequest.response && autoInstallRequest.response.Id){
            helper.waitForAutoInstallRequest(cmp, autoInstallRequest.response);
        }
	}
})