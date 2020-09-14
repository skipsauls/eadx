({
    doInit: function(component, event, helper) {
        
        var items = helper.items;
        items.forEach(function(item) {
        	item.imageUrl = $A.get('$Resource.' + item.resourceName) + (item.imageName || '');
            item.handleClick = function(event) {
                helper.navigateToPage(component, item.developerName);
            }            
        });
        
        component.set('v.items', items);
        
        // Do nothing
        /*
        var action = component.get("c.getTabs");
        action.setParams({});
        action.setCallback(this, function(response) {
            console.warn('getTabs response: ', response);
            var state = response.getState();
            console.warn('state: ', state);
            if (state === "SUCCESS") {
                var tabSets = response.getReturnValue();
                console.warn('tabSets: ', tabSets);
                component.set('v.tabSets', tabSets);
                
            } else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var err = response.getError();
                console.error('error: ', err);
            }            
        });
        $A.enqueueAction(action)        
        */
    },
    
    navigateToPage: function(component, event,  helper) {
        var name = event.getSource().get('v.name');
        helper.navigateToPage(component, name);
    },
    
    handleItemClick: function(component, event, helper) {
        //console.warn('handleItemClick: ', event);
        var developerName = null;
        var pageType = null;
        var objectType = null;
        if (event.currentTarget) {
            developerName = event.currentTarget.dataset.developerName;
            pageType = event.currentTarget.dataset.pageType;
            objectType = event.currentTarget.dataset.objectType;
        } else if (event.getSource) {
            developerName = event.getSource().get('v.developerName');
            pageType = event.getSource().get('v.pageType');
            objectType = event.getSource().get('v.objectType');
      }
        //console.warn('developerName: ', developerName);
        if (developerName) {
            helper.navigateToPage(component, pageType, objectType, developerName);
        }
        
    }
})