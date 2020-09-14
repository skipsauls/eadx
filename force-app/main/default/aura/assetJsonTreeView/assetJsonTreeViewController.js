({
    init: function (component, event, helper) {
        helper.refreshTree(component);
    },

    handleAssetChange: function (component, event, helper) {
        helper.refreshTree(component);
    },
    
    handleSelect: function(component, event, helper) {
        let name = event.getParam('name');
        let itemsMap = component.get('v.itemsMap');
        let item = itemsMap[name];
    }   
})