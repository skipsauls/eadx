({
	init: function(cmp, event, helper) {
        var dashboardId = cmp.get('v.pageReference.state.c__dashboardId');
        var pageId = cmp.get('v.pageReference.state.c__pageId');
        cmp.set('v.dashboardId', dashboardId);
        cmp.set('v.pageId', pageId);
        helper.updateDashboard(cmp);
    },
    dashboardChanged: function(cmp, event, helper) {
        var dashboardId = event.getParam('value').state['c__dashboardId'];
        var forceRefresh = event.getParam('value').state['c__forceRefresh'];
        var dashboardChanged = forceRefresh || dashboardId !== event.getParam('oldValue').state['c__dashboardId'];
        if (dashboardChanged){
            $A.log('dashboardTab: dashboard updated ' + dashboardId);
            cmp.set('v.dashboardId', dashboardId);
            helper.updateDashboard(cmp);            
        }
        var pageId = event.getParam('value').state['c__pageId'];
        var pageChanged = pageId !== event.getParam('oldValue').state['c__pageId'];
        if (pageChanged){
            $A.log('dashboardTab: page updated ' + pageId);
            cmp.set('v.pageId', pageId);
            helper.updatePage(cmp);
        }
        
        var filters = event.getParam('value').state['c__filters'];
        var filtersChanged = filters !== event.getParam('oldValue').state['c__filters'];
        if (filtersChanged){
            $A.log('dashboardTab: filters updated ' + filters);
            cmp.set('v.filters', filters);
            helper.updateFilters(cmp);
        }
	},
    handleDashboardEvent: function(cmp, event){
        var dashboardId = event.getParam('dashboardId');
        var pageId = event.getParam('pageId');
        $A.log('dashboardTab: handleDashboardEvent: dashboardId: ' + 
               dashboardId + ', pageId:' + pageId);
        cmp.set('v.dashboardId', dashboardId);
        cmp.set('v.pageId', pageId);
    }
})