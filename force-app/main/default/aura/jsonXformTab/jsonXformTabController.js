({
    init: function(component, event, helper) {
        helper.setup(component);
    },
    
    handleImportMenuSelect: function(component, event, helper) {
        var value = event.getParam("value");
        component.set('v.assetType', value);
        component.set('v.modalAction', '');
        $A.createComponent("eadx:analyticsAssetSelector", {
            assetType: component.getReference("v.assetType"),
            asset: component.getReference("v.asset")
        }, function(modalBody, status, errorMessage) {
            $A.createComponent("eadx:analyticsAssetSelectorFooter", {modalAction: component.getReference("v.modalAction")}, function(modalFooter, status, errorMessage) {
                component.find('overlayLib').showCustomModal({
                    header: "Import Assets",
                    body: modalBody,
                    footer: modalFooter,
                    showCloseButton: true,
                    cssClass: "slds-modal_medium",
                    closeCallback: function(action) {
                        let modalAction = component.get('v.modalAction');
                        console.warn('modalAction: ', modalAction);
                        if (modalAction === 'load') {
                            helper.loadAsset(component);
                        }
                    }
                });
            });
        });        
    },
    
    handleTransform: function(component, event, helper) {
        let xformCmp = component.find('jsonXform');
        console.warn('xformCmp: ', xformCmp);
        xformCmp.transform();
    },
    
    handleTabChange: function(component, event, helper) {        
        console.warn('handleTabChange');
        let tabId = component.get('v.tabId');

    },
    
    handleNew: function(component, event, helper) {
        console.warn('handleNew');
        helper.newXform(component);
    },
    
    handleLoad: function(component, event, helper) {
        console.warn('handleLoad');
        helper.selectXform(component);
    },
    
    handleSave: function(component, event, helper) {
        console.warn('handleSave');
        //helper.saveXform(component);

        console.warn('handleSave');
        let tabId = component.get('v.tabId');
        console.warn('tabId: ', tabId);
        let tabs = component.get('v.tabs');
        tabs.forEach(function(tab, i) {
            if (tabId === tab.get('v.id')) {
                let body = tab.get('v.body');
                let cmp = body[0];
                cmp.save();
            }
        });

    },
    
    showErrors: function(component, event, helper) {
        helper.showErrors(component);
    },
    
    onEditorError: function(component, event, helper) {
        console.warn('onEditorError');
    },
    
    handleShowErrors: function(component, event, helper) {
        let params = event.getParam('arguments');
        console.warn('handleShowErrors: ', params);
        let name = params.name;
        let tabId = params.tabId;
        let errors = params.errors;
        helper.showErrors(component, name, tabId, errors);
    },

    handleNameChange: function(component, event, helper) {
        let params = event.getParam('arguments');
        let name = params.name;
        let tabId = params.tabId;
        console.warn('jsonXformTabController.handleNameChange: ', name, tabId);
        let tabs = component.get('v.tabs');
        let tabIndex = 0;
        tabs.forEach(function(tab, i) {
            if (tab.get('v.id') === tabId) {
                try {
					// Probably not the most robust...
	                let label = tab.get('v.label');
    	            label[0].set('v.value', name);            
                } catch (e) {}
            }
        });
    },
    
    handleShowToast: function(component, event, helper) {
        let params = event.getParam('arguments');
        console.warn('handleShowToast: ', params);
        let title = params.title;
        let message = params.message;
        let variant = params.variant;
        helper.showToast(component, title, message, variant);
    },
    
    handleCloseTab: function(component, event, helper) {
        helper.showToast(component, 'Not Implemented', 'Tab close has not been implemented.', 'warning');
        return;
        
        
        let params = event.getParam('arguments');
        console.warn('handleCloseTab: ', params);
        let tabId = params.tabId;
        console.warn('tabId to close: ', tabId);
        
        let tabs = component.get('v.tabs');
        console.warn('tabs: ', tabs);
        tabs.pop();
        console.warn('tabs: ', tabs);
        component.set('v.tabs', tabs);
        
/*        
        let tabs = component.get('v.tabs');
        let tabIndex = 0;
        tabs.forEach(function(tab, i) {
            if (tab.get('v.id') === tabId) {
                console.warn('tab: ', tab);
                //$A.util.addClass(tab, 'hidden');
                tab.set('v.class', 'hidden');
                tabIndex = i;
                //tabs[i] = [];
            }
        });
        let tabset = component.find('v.tabset');
        tabset.set('v.selectedTabId', tabs[1].get('v.id'));
*/        
        //component.set('v.')
        /*
        console.warn('tabs: ', tabs);
        console.warn('tabIndex: ', tabIndex);
        console.warn('tabs.length: ', tabs.length);
        let tabs2 = tabs.slice(0, tabIndex);
        let tabs3 = tabs.slice(tabIndex + 1, tabs.length - 1);
        let tabs4 = tabs2.concat(tabs3);
        console.warn('tabs4: ', tabs4);
        console.warn('tabs4.length: ', tabs4.length);
        component.set('v.tabs', tabs);        
        */
    },
    
})