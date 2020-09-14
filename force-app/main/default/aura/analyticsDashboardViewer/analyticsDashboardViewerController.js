({
    handleDashboardIdChange: function(component, event, helper) {
        var dashboardId = component.get('v.dashboardId');
        var versionId = component.get('v.versionId');
        if (typeof dashboardId !== 'undefined' && dashboardId !== null && dashboardId !== '') {
	        helper.showDashboard(component, dashboardId, versionId);
        }
	},
    
    handleVersionIdChange: function(component, event, helper) {
        var dashboardId = component.get('v.dashboardId');
        var versionId = component.get('v.versionId');
        if (typeof dashboardId !== 'undefined' && dashboardId !== null && dashboardId !== '') {
	        helper.showDashboard(component, dashboardId, versionId);
        }
	},

	handleRefresh: function(component, event, helper) {        
        var dashboardId = component.get('v.dashboardId');
        var versionId = component.get('v.versionId');
        if (typeof dashboardId !== 'undefined' && dashboardId !== null && dashboardId !== '') {
	        helper.showDashboard(component, dashboardId, versionId);        
        }
	},

    // UPDATE BELOW!!!!!!!!!!!!!!!!!!!!!!!!
    // 
    handleView: function(component, event, helper) {        
        console.warn('analyticsExplorerController.handleView: ', event);
        var dashboardId = component.get('v.dashboardId');
        if (typeof dashboardId !== 'undefined' && dashboardId !== null && dashboardId !== '') {
            var url = '/analytics/wave/wave.apexp/#dashboard/' + dashboardId;
			var win = window.open(url, '_blank');
			win.focus();            
        }
	},

	handleEdit: function(component, event, helper) {        
        console.warn('analyticsExplorerController.handleView: ', event);
        var dashboardId = component.get('v.dashboardId');
        if (typeof dashboardId !== 'undefined' && dashboardId !== null && dashboardId !== '') {
            var url = '/analytics/wave/wave.apexp/#dashboard/' + dashboardId + '/edit';
			var win = window.open(url, '_blank');
			win.focus();            
        }
	},
    
    toggleShowJSON: function(component, event, helper) {        
        var showJSON = component.get('v.showJSON');
        component.set('v.showJSON', !showJSON);
    },
    
    toggleShowDiff: function(component, event, helper) {        
        var showDiff = component.get('v.showDiff');
        component.set('v.showDiff', !showDiff);
    }
    
})