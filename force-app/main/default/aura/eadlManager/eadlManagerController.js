({
	init: function(component, event, helper) {
        
        helper.updateStatus(component, function() {
            helper.setupTemplateConfig(component, function(err, result) {
                helper.checkStatus(component, function(err, data) {
                    console.warn('checkStatus returned: ', data);
                    if (data) {
                        component.set('v.status', data);
                    }                
                });
                helper.listDashboards(component);
            });
        });

        return;
        
        helper.listFolders(component);
        helper.setupTemplateVariables(component);
        helper.checkStatus(component);
        helper.listDashboards(component);
	},
    
	handleCreateApp: function(component, event, helper) {
        helper.createApp(component);
	},
    
	handleDeleteApp: function(component, event, helper) {
        helper.deleteApp(component);
	},
    
	handleCheckStatus: function(component, event, helper) {
        helper.checkStatus(component);
	},

	handleListDashboards: function(component, event, helper) {
        helper.listDashboards(component);
	},
    
    handleTestDashboard: function(component, event, helper) {
        let index = event.getSource().get("v.value");
        helper.testDashboard(component, index);
    }
})