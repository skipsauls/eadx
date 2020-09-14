({

   	doInit: function(component, event, helper) {
        var pageField = component.get('v.pageField');
        component.set('v.recordFields', [pageField]);
        var pageFieldMapping = component.get('v.pageFieldMapping');
        var pageFieldMap = {};
        var tokens = pageFieldMapping.split(',');
        var kv = null;
        tokens.forEach(function(token) {
            kv = token.trim().split('=');
            pageFieldMap[kv[0]] = kv[1];
        });
        //console.warn('pageFieldMap: ', pageFieldMap);
        component.set('v.pageFieldMap', pageFieldMap);        
    },    
    
    handleChange: function(component, event, helper) {
        //helper.showDashboard(component);
    },

    handlePageIdChange: function(component, event, helper) {
        //console.warn('handlePageIdChange');
        helper.changePage(component);
    },
    
    handleRecordInit: function(component, event, helper) {
        var initialized = component.get('v.initialized');
        if (initialized === true) {
            return;
        }
        
        //helper.updatePage(component);
    },

    handleRecordChange: function(component, event, helper) {
        helper.updatePage(component);
    },

    handleSelectionChanged: function (component, event, helper) {
        //console.warn('handleSelectionChanged: ', event.getParams(), JSON.stringify(event.getParams(), null, 2));

        var initialized = component.get('v.initialized');
        if (initialized === true) {
            return;
        }
        
        helper.updatePage(component);
        
    },
    
    handleChangeDashboardPage: function(component, event, helper) {
        var params = event.getParams();
        //console.warn('changeDashboardPage params: ', JSON.stringify(params, null, 2));
        var developerName = component.get("v.developerName");
        var dashboardId = component.get("v.dashboardId");
        
        if (developerName === params.developerName || dashboardId === params.dashboardId) {
	        var pageId = params.pageId;
            component.set('v.pageId', pageId);
        }
    },
    
    handleRefresh: function(component, event, helper) {        
        var dashboardId = component.get('v.dashboardId');
        var versionId = component.get('v.versionId');
        if (typeof dashboardId !== 'undefined' && dashboardId !== null && dashboardId !== '') {
            helper.showDashboard(component, dashboardId, versionId);        
        }
    }
    
})