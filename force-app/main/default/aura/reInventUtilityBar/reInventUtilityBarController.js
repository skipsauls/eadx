({
	doInit: function(component, event, helper) {
        /*
        var workspaceAPI = component.find("workspace");
        
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            var focusedTabId = response.tabId;
            component.set("v.tabId", response.tabId);
            workspaceAPI.setTabLabel({
                tabId: focusedTabId,
                label: "Alexa"
            });
            workspaceAPI.setTabIcon({
                tabId: focusedTabId,
                icon: "utility:salesforce1",
                iconAlt: "Alexa"
            });            
        })
        .catch(function(error) {
            console.log(error);
        });
        */
    },
    
	handlePlatformEvent: function(component, event, helper) {
        helper.handlePlatformEvent(component, event);
	},
    
    test: function(component, event, helper) {
        helper.updateSelection(component, true, '0FKB000000092VyOAI');
	},
    
    onTabCreated: function(component, event, helper) {
		//console.warn('onTabCreated');        
    },

    onTabFocused: function(component, event, helper) {
		//console.warn('onTabFocused');
    },

    onTabRefreshed: function(component, event, helper) {
		//console.warn('onTabRefreshed');
    },

    onTabUpdated: function(component, event, helper) {
		//console.warn('onTabUpdated');
    }
    
})