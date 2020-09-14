({
	handleViewSobjectTypePayload: function(cmp, event, helper) {
        var sobjects = event.getParam('sobjects');
        if (sobjects.length == 1){
            helper.viewSobject(cmp, sobjects[0]);
        } else if (sobjects.length > 1){
            helper.viewSobject(cmp, sobjects[0]);
            /*
             * Commented out because selection is clunky. Just open the first one.
            helper.handleMultipleResults(cmp, ['name'], sobjects, 'id', function(sobject){
            	helper.viewSobject(cmp, sobject);
            });
            */
        } else{
            helper.toaster('No records found.', 'error');
        }
	},
	handleDashboardEventPayload: function(cmp, event, helper) {
        console.warn('handleDashboardEventPayload - event: ', event);
        var dashboards = event.getParam('dashboards');
        if (dashboards.length == 1){
            helper.viewDashboard(cmp, dashboards[0]);
        } else if (dashboards.length > 1){
            helper.viewDashboard(cmp, dashboards[0]);
            /*
             * Commented out because selection is clunky. Just open the first one.
            helper.handleMultipleResults(cmp, ['label', 'description'], dashboards, 'id', function(dashboard){
            	helper.viewDashboard(cmp, dashboard);
            });
            */
        } else{
            helper.toaster('No dashboards found.', 'error');
        }
	},
	handleChannelSubscribeEventPayload: function(cmp, event, helper) {
        var channels = event.getParam('channels');
        if (channels.length == 1){
            helper.channelSubscribe(cmp, channels[0]);
        } else if (channels.length > 1){
            helper.handleMultipleResults(cmp, ['label', 'description'], channels, 'id', function(channel){
            	helper.channelSubscribe(cmp, channel);
            });
        } else{
            helper.toaster('No channels found.', 'error');
        }
	},
	handleChannelUnsubscribeEventPayload: function(cmp, event, helper) {
        helper.channelUnsubscribe(cmp);
	},
	handleDashboardUpdatePagePayload: function(cmp, event, helper) {
        var pages = event.getParam('pages');
        if (pages.length == 1){
            helper.viewDashboardPage(cmp, pages[0]);
        } else if (pages.length > 1){
            helper.handleMultipleResults(cmp, ['label'], pages, 'name', function(page){
            	helper.viewDashboardPage(cmp, page);
            });
        } else{
            helper.toaster('No pages found.', 'error');
        }
	}, 
    handleFilterDatasetPayload: function(cmp, event, helper){
        console.warn('handleFilterDatasetPayload');
        helper.updateDashboardFilters(cmp, event); 
    },
    handleInvocableActionApex: function(cmp, event, helper){
        var analyticsAppCreateTargets = cmp.get('v.appCreateTargets');  
        var sessionRecordingTarget = cmp.get('v.sessionRecordingTarget');  
		var eventTarget = event.getParam('target');
        var actionResults = event.getParam('actionResults');
        if (analyticsAppCreateTargets.indexOf(eventTarget.name) >= 0){
            helper.fireAnalyticsAppCreateEvent(cmp, event, actionResults);                
        } else if (sessionRecordingTarget === eventTarget.name){
            helper.updateRecordingSession(cmp, event, actionResults);
        }
    }
})