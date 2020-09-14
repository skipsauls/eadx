({
    handleRefresh: function(component) {
        var analyticsTree = component.find('analytics_tree');
        component.set('v.assetId', null);
        component.set('v.assetType', null);
        component.set('v.asset', null);
        analyticsTree.refresh(function(msg) {
            //console.warn('analyticsTree.refresh returned: ', msg);
            var spinner = component.find('spinner');
            //$A.util.toggleClass(spinner, 'slds-hide');
        });
    },

})