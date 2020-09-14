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
                label: "Quip"
            });
            workspaceAPI.setTabIcon({
                tabId: focusedTabId,
                icon: "utility:file",
                iconAlt: "Quip"
            });            
        })
        .catch(function(error) {
            console.log(error);
        });
    },
    
    changeThreadId: function(component, event, helper) {
        var threadId = component.get("v.threadId");
        helper.getThreads(component, threadId, function(err, res) {
            if (res) {
                console.warn("res: ", res);
                component.set("v.thread", res);
            }
        });
    },
    
    showQuipThread: function(component, event, helper) {
        var params = event.getParams();
        console.warn('showQuipThread: ', params);
        var threadId = params.threadId;
        var tabId = params.dashboardId;
        console.warn('threadId: ', threadId);
        console.warn('tabId: ', tabId);
        
        component.set("v.threadId", threadId);
	},

    refresh: function(component, event, helper) {
        var threadId = component.get("v.threadId");
        helper.getThreads(component, threadId, function(err, res) {
            if (res) {
                console.warn("res: ", res);
                component.set("v.thread", res);
            }
        });
    },

    openInQuip: function(component, event, helper) {
        var thread = component.get("v.thread");
        var link = thread.thread.link;
        
        var evt = $A.get('e.force:navigateToURL');
        if (typeof evt !== 'undefined' && evt !== null) {
            var params = {
                url: link,
                isredirect : false
            };
            evt.setParams(params);
            evt.fire();            
        } else {
			var win = window.open(link, '_blank');
  			win.focus();
        }
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