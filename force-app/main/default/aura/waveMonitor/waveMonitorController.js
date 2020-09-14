({
	launchSalesWave: function(component, event, helper) {
		console.warn("waveMonitorController.launchSalesWave");
        var evt = $A.get("e.force:navigateToURL");
        evt.setParam("url", "/analytics/wave/wave.apexp?tsid=02uB0000000HtFi#dashboard/0FKB00000002OMvOAM");
        evt.fire();
    },
    
	handleNavigateHome: function(component, event, helper) {
		console.warn("waveMonitorController.handleNavigateHome");
    },
    
	handleNavigateToSObject: function(component, event, helper) {
		console.warn("waveMonitorController.handleNavigateToSObject");
        var params = event.getParams();
        var recordId = params.recordId;
        var slideDevName = params.slideDevName;
        console.warn("recordId: ", recordId);
        console.warn("slideDevName: ", slideDevName);
	},
    
	handleTabFocused: function(component, event, helper) {
		console.warn("waveMonitorController.handleTabFocused");
        var params = event.getParams();
        var currentTabId = params.currentTabId;
        console.warn("currentTabId: ", currentTabId);
	},

	handleNavigateToObjectHome: function(component, event, helper) {
		console.warn("waveMonitorController.handleNavigateToObjectHome");
        var params = event.getParams();
        var scope = params.scope;
        console.warn("scope: ", scope);
	},
    
	handleNavigateToURL: function(component, event, helper) {
		console.warn("waveMonitorController.handleNavigateToUrl");
        var params = event.getParams();
        var url = params.url;
        console.warn("url: ", url);
	}/*,
    
	handleNavigateToRelatedList: function(component, event, helper) {
		console.warn("waveMonitorController.handleNavigateToRelatedList");
        var params = event.getParams();
        var relatedListId = params.relatedListId;
        var parentRecordId = params.parentRecordId;
        var entityApiName = params.entityApiName;        
        console.warn("relatedListId: ", relatedListId);
        console.warn("parentRecordId: ", parentRecordId);
        console.warn("entityApiName: ", entityApiName);
	},
    
	handleNavigateToList: function(component, event, helper) {
		console.warn("waveMonitorController.handleNavigateToList");
        var params = event.getParams();
        var listViewId = params.listViewId;
        var listViewName = params.listViewName;
        var scope = params.scope;        
        console.warn("listViewId: ", listViewId);
        console.warn("listViewName: ", listViewName;
        console.warn("scope: ", scope);
	},
    
*/

})