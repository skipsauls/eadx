({
	init : function(cmp, event, helper) {
        helper.busy(cmp, true);
        helper.getWairPermissions(cmp);
	},

    handlePermissionsUpdate : function(cmp, event, helper) {
        helper.busy(cmp, true);
        helper.getRecentWairRequestForTemplate(cmp);
        helper.getTemplateMetadata(cmp, event, helper);
	},

    handleWairUpdate : function(cmp, event, helper) {
        helper.busy(cmp, true);
        var value = event.getParam('value');
        var oldValue = event.getParam('oldValue');
        if (value && value.requestType == 'WaveAppDelete'){
            helper.cleanOldRequests(cmp, false);
        }
        helper.loadAppDashboards(cmp);
 	},
    
    handleTemplateMetadataUpdate: function(cmp, event, helper){
        helper.busy(cmp, true);
        helper.loadAppDashboards(cmp);
        helper.updateAppActions(cmp);
    },
    
    handleMenuAction : function(cmp, event, helper) {
        helper.busy(cmp, true);
        var menuAction = event.getParam("value");
        switch(menuAction){
            case "startDataflow":
                helper.startDataflowRequest(cmp);
                break;
            case "deleteApp":
                helper.createDeleteRequest(cmp);
                break;
        }
	},

    handleUpdateAppAction: function(cmp, event, helper){
        helper.busy(cmp, true);
        helper.createOrUpdateAppRequest(cmp);
    },
    
    handleDashboardSelect : function(cmp, event, helper) {
        helper.busy(cmp, true);
        cmp.set('v.dashboardData.selected', event.getParam('value'));
        helper.busy(cmp, false);
	},
    
    handleDashboardDataChange : function(cmp, event, helper) {
        helper.busy(cmp, true);
		helper.determineHeaderRendering(cmp);
        helper.determineViewToRender(cmp);
	}
})