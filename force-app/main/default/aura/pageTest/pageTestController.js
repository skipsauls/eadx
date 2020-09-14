({
    doInit: function(component, event, helper) {
        helper.createTabs(component);
    },
    
    handleRefresh: function(component, event, helper) {
        helper.createTabs(component);
    },
    
    handleTabSelect: function(component, event, helper) {
        //console.warn('handleTabSelect: ', event, event.getSource());
        var params = event.getParams();
        var pageId = params.id;
        //console.warn('pageId: ', pageId);
        
        var developerName = component.get('v.developerName');
        //console.warn("developerName: ", developerName);
        console.warn("pageId: ", pageId);
        var evt = $A.get('e.wave:pageChange');
        //console.warn('evt: ', evt);
        evt.setParams({
            devName: developerName,
            pageid: pageId
        });
        evt.fire();
    },

    handleSelectionChanged: function (component, event, helper) {
        //console.warn('handleSelectionChanged: ', event.getParams(), JSON.stringify(event.getParams(), null, 2));
        
        
    }    
})