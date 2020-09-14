({
	init: function(component, event, helper) {
        
        helper.appColumns.push({ type: 'action', typeAttributes: { rowActions: helper.appActions, menuAlignment: 'right' } });
        helper.templateColumns.push({ type: 'action', typeAttributes: { rowActions: helper.templateActions, menuAlignment: 'right' } });
        helper.requestColumns.push({ type: 'action', typeAttributes: { rowActions: helper.requestActions, menuAlignment: 'right' } });
        
        component.set('v.appColumns', helper.appColumns);
        component.set('v.templateColumns', helper.templateColumns);
        component.set('v.requestColumns', helper.requestColumns);

        helper.getEmbeddedApps(component);
        helper.getEmbeddedAppTemplates(component);
        helper.getAutoInstallRequests(component);
        
        helper.setupSubscriptions(component);
        
    },
    
    getEmbeddedApps: function(component, event, helper) {
        helper.getEmbeddedApps(component);
    },
    
    getEmbeddedAppTemplates: function(component, event, helper) {
        helper.getEmbeddedAppTemplates(component);
    },
    
	getAutoInstallRequests: function(component, event, helper) {
		helper.getAutoInstallRequests(component);
	},
    
	handleRequestAutoUpdateChange: function(component, event, helper) {
        let requestAutoUpdate = component.get('v.requestAutoUpdate');
        console.warn('requestAutoUpdate: ', requestAutoUpdate);
        let timer = component.get('v.timer');
        console.warn('timer: ', timer);
        if (requestAutoUpdate === true) {
            
    		let timeout = component.get('v.timeout') || 5000;
	        timeout = timeout < 2000 ? 2000 : timeout;
            console.warn('timeout: ', timeout);

            helper.getAutoInstallRequests(component);

	        timer = setInterval($A.getCallback(function() {
	           	helper.getAutoInstallRequests(component);
    	    }), timeout);
            
	        component.set('v.timer', timer);    
        } else {
            if (timer !== null && typeof timer !== 'undefined') {
                clearInterval(timer);
			    component.set('v.timer', null);
            }            
        }
        
    },
    
    handleAppRowSelection: function(component, event, helper) {
        console.warn('handleAppRowSelection');
        let selectedRows = event.getParam('selectedRows');
        selectedRows.forEach(function(selectedRow) {
            console.warn('selectedRow: ', selectedRow); 
            helper.getInfo(component, selectedRow);
        });
        let currentSelectedRows = component.get('v.appSelectedRows');
        currentSelectedRows.forEach(function(name) {
            console.warn('name: ', name);
        });
    },

    handleTemplateRowSelection: function(component, event, helper) {
        console.warn('handleTemplateRowSelection');
        let selectedRows = event.getParam('selectedRows');
        selectedRows.forEach(function(selectedRow) {
            console.warn('selectedRow: ', selectedRow);
            helper.getInfo(component, selectedRow);
        });
        let currentSelectedRows = component.get('v.templateSelectedRows');
        currentSelectedRows.forEach(function(name) {
            console.warn('name: ', name);
        });
    },

    handleRequestRowSelection: function(component, event, helper) {
        console.warn('handleRequestRowSelection');
        let selectedRows = event.getParam('selectedRows');
        selectedRows.forEach(function(selectedRow) {
            console.warn('selectedRow: ', selectedRow); 
            helper.getInfo(component, selectedRow);
        });
        let currentSelectedRows = component.get('v.requestSelectedRows');
        currentSelectedRows.forEach(function(name) {
            console.warn('name: ', name);
        });
    },
    
    handleAppRowAction: function(component, event, helper) {
        let action = event.getParam('action');
        let row = event.getParam('row');
        console.warn('handleAppRowAction: ', action.name);
        console.warn('row: ', JSON.parse(JSON.stringify(row)));
        
        if (action.name === 'get_info') {
            helper.getInfo(component, row);
        } else if (action.name === 'delete_app') {
            helper.deleteApp(component, row);
        }
        
    },

    handleTemplateRowAction: function(component, event, helper) {
        let action = event.getParam('action');
        let row = event.getParam('row');
        console.warn('handleTemplateRowAction: ', action.name);
        console.warn('row: ', JSON.parse(JSON.stringify(row)));
                        
        if (action.name === 'get_info') {
            helper.getInfo(component, row);
        } else if (action.name === 'create_app') {
            helper.createApp(component, row);
            
        }
        
    },

    handleRequestRowAction: function(component, event, helper) {
        let action = event.getParam('action');
        let row = event.getParam('row');
        console.warn('handleRequestRowAction: ', action.name);
        console.warn('row: ', JSON.parse(JSON.stringify(row)));
                        
        if (action.name === 'get_info') {
            helper.getInfo(component, row);
        }        
    },
    
    handleRefreshApps: function(component, event, helper) {
       helper.getEmbeddedApps(component); 
    },
    
    handleRefreshTemplates: function(component, event, helper) {
       helper.getEmbeddedAppTemplates(component); 
    },
    
    handleRefreshRequests: function(component, event, helper) {
       helper.getAutoInstallRequests(component); 
    },
    
    handleDashboardTest: function(component, event, helper) {
        let value = event.getSource().get("v.value");
        console.warn('value: ', value);
        let dashboards = component.get('v.selectedAssetDashboards');
        if (dashboards) {
            let dashboard = dashboards[value];
            console.warn('dashboard: ', dashboard);
            
            $A.createComponent("c:eadlModal", {dashboardDef: dashboard},
                               function(content, status) {
                                   if (status === "SUCCESS") {
                                       let modalBody = content;
                                       component.find('overlayLib').showCustomModal({
                                           header: "Application Confirmation",
                                           body: modalBody,
                                           showCloseButton: true,
                                           cssClass: "slds-modal_large",
                                           closeCallback: function() {
                                               //alert('You closed the alert!');
                                           }
                                       })
                                   }
                               });
        }
    },
    
    
})