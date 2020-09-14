({
    doInit: function(component, event, helper) {
        var developerName = component.get('v.developerName');
        if (developerName.indexOf('__') >= 0) {
	        developerName = developerName.split('__')[1];            
        }        
        helper.listDashboards(component, developerName, function(err, dashboards) {
            //console.warn('dashboards: ', dashboards); 
            if (dashboards) {
                helper.describeDashboard(component, dashboards[0].id, function(err, dashboard) {
                    component.set('v.dashboardDef', dashboard);
                    helper.generatePageNav(component);                    
                });
            }
        });       
    },
    
	handleImageMapClick: function(component, event, helper) {
        event.preventDefault();
        //console.warn('handleImageMapClick: ', event);
        var element = event.srcElement;
        //console.warn('element: ', element);
		var pageName = element.alt;
        //console.warn('pageName: ', pageName);
        
        var pageMap = component.get('v.pageMap');
        //console.warn('pageMap: ', pageMap);
        
        var pageId = pageMap[pageName] || 'Intro';
        //console.warn('pageId: ', pageId);
        if (pageId) {
            var devName = component.get('v.developerName');
            //console.warn("devName: ", devName);
            //console.warn("pageId: ", pageId);
            var evt = $A.get('e.wave:pageChange');
            var params = {
                devName: devName,
                pageid: pageId
            };
            //console.warn('params: ', params, JSON.stringify(params, null, 2));
            evt.setParams(params);
            evt.fire();
        } else {
            console.error('No pageId found for page name: ', pageName);
        }
        
        return false;
	},
    
    handleSelectionChanged: function (component, event, helper) {
        //console.warn('handleSelectionChanged: ', event.getParams(), JSON.stringify(event.getParams(), null, 2));
        
    }        
})