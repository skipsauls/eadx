({
	doInit: function(component, event, helper) {
        var workspaceAPI = component.find("workspace");
        
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            var focusedTabId = response.tabId;
            component.set("v.tabId", response.tabId);
			workspaceAPI.getTabURL({
                tabId: focusedTabId
            }).then(function(response) {
                console.warn('tab URL: ', response);
            });
            workspaceAPI.setTabLabel({
                tabId: focusedTabId,
                label: "Demo Architecture"
            });
            workspaceAPI.setTabIcon({
                tabId: focusedTabId,
                icon: "utility:salesforce1",
                iconAlt: "Demo Architecture"
            });            
        })
        .catch(function(error) {
            console.log(error);
        });
    }
})