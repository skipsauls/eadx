({
    init: function(component, event, helper) {
        helper.setup(component);
    },
    
    handleTransform: function(component, event, helper) {
        let xformCmp = component.find('jsonXform');
        console.warn('xformCmp: ', xformCmp);
        xformCmp.transform();
    },
    
    onActive: function(component, event, helper) {
        // Do any setup, etc. here?
    },

    handleNameChange: function(component, event, helper) {
        let parent = component.get('v.parent');
        let name = component.get('v.name');
        let tabId = component.get('v.tabId');
        parent.handleNameChange(name, tabId);
    },
    
    handleSave: function(component, event, helper) {
        helper.saveXform(component);
    },
    
    handleClose: function(component, event, helper) {
        let parent = component.get('v.parent');
        let tabId = component.get('v.tabId');
        parent.closeTab(tabId);
    },
    
    showErrors: function(component) {
        let self = this;
        let parent = component.get('v.parent');
        let name = component.get('v.name');
        let tabId = component.get('v.tabId');
        let errors = component.get('v.errors');
        parent.showErrors(name, tabId, errors);
        component.set('v.errors', null);
    },    
})