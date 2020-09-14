({
    document: {
        user: {
            "firstName": "${User.FirstName}",
            "hello": "${Variables.hello}"
        }        
    },
    
    values: {
        "Variables": {
            "hello": "world"
        }        
    },
    
    definition: {
        "rules": [
            {
                "name": "Example",
                "actions": [
                    {
                        "action": "put",
                        "description": "add hobby to user",
                        "key": "hobby",
                        "path": "$.user",
                        "value": "mountain biking"
                    }
                ]
            }
        ]
    },
    
    importMenuItems: [
        {
            label: 'Template',
            value: 'template',
            iconName: 'utility:rules'
        },
        {
            label: 'Dashbosrd',
            value: 'Dashboard',
            iconName: 'utility:layout'
        },
        {
            label: 'Lens',
            value: 'Lens',
            iconName: 'utility:zoomin'
        },
        {
            label: 'Dataset',
            value: 'Dataset',
            iconName: 'utility:matrix'
        },
        {
            label: 'Sample',
            value: 'sample',
            iconName: 'utility:text_template'
        }
    ],
    
    // For new doc names & ids
    newIndex: 0,
    
    setup: function(component) {
        let self = this;
        /*
        let document = JSON.stringify(this.document, null, 2);
        let values = JSON.stringify(this.values, null, 2);
        let definition = JSON.stringify(this.definition, null, 2);
        
        component.set('v.document', document);
        component.set('v.values', values);
        component.set('v.definition', definition);
        */
        component.set('v.importMenuItems', self.importMenuItems);
    },
    
    showToast: function(component, title, message, variant) {
        component.find('notifyLib').showToast({
            title: title,
            message: message,
            variant: variant
        });        
    },
    
    showErrors: function(component, name, tabId, errors) {
        let self = this;
        let title = '';
        let message = '';
        errors.forEach(function(err, i) {
            title = 'Error in ' + name + ' - ' + err.errorCode;
            message += 'Error ' + i + ':' + err.errorCode + '\n';
            message += err.message + '\n';
            self.showToast(component, title, err.message, 'error');
        });
    },
    
    loadAsset: function(component) {
        console.warn('jsonXformTabHelper.loadAsset');
        let assetType = component.get('v.assetType');
        let asset = component.get('v.asset');
        console.warn('assetType: ', assetType);
        console.warn('asset: ', asset);
        
    },
    
    newXform: function(component, config) {
        let self = this;
        let tabIndex = self.newIndex;
        let tabId = 'tab_' + tabIndex;
        
        if (config === null || typeof config === 'undefined') {
            config = {            
                name: 'New' + (tabIndex > 0 ? ' ' + tabIndex : ''),
                document: JSON.stringify({}, null, 2),
                values: JSON.stringify({}, null, 2),
                definition: JSON.stringify({}, null, 2)
            };
        }
        
        config.tabId = tabId;
        config.parent = component;
        
        self.newIndex++;
        
        $A.createComponent('c:jsonXformEditor', config, function(cmp, status, err) {
            
            $A.createComponent('lightning:tab', {
                label: cmp.getReference('v.name'),
                id: tabId,
                onactive: cmp.getReference('c.onActive')
                }, function(tab, status, err) {
                    tab.set('v.body', cmp);
                    
                    let tabs = component.get('v.tabs');
                    tabs.push(tab);
                    component.set('v.tabs', tabs);
                    let tabset = component.find('tabset');
                    tabset.set('v.selectedTabId', tabId);
                });
            
        });
    },
    
    selectXform: function(component, event, helper) {
        let self = this;
        component.set('v.modalAction', '');
        $A.createComponent("c:jsonXformSelector", {
            xform: component.getReference("v.xform"),
            name: component.getReference('v.name')            
        }, function(modalBody, status, errorMessage) {
            $A.createComponent("c:jsonXformSelectorFooter", {modalAction: component.getReference("v.modalAction")}, function(modalFooter, status, errorMessage) {
                component.find('overlayLib').showCustomModal({
                    header: "Load JSON Transform",
                    body: modalBody,
                    footer: modalFooter,
                    showCloseButton: true,
                    cssClass: "slds-modal_medium",
                    closeCallback: function(action) {
                        let modalAction = component.get('v.modalAction');
                        if (modalAction === 'load') {
                            self.loadXform(component);
                        }
                    }
                });
            });
        });        
    },
    
    loadXform: function(component, callback) {
        let self = this;
        let action = component.get("c.loadJson");
        let name = component.get('v.name');
        
        action.setParams({
            name: name
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                let results = response.getReturnValue();
                let document = JSON.parse(results.document);
                let values = JSON.parse(results.values);
                let definition = JSON.parse(results.definition);
                
                let config = {
                    name: name,
                    document: document,
                    values: values,
                    definition: definition
                };
                
                self.newXform(component, config);
                if (typeof callback === 'function') {
                    callback(null, results);
                }
            }
            else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var err = response.getError();
                console.error('error: ', err);
                if (typeof callback === 'function') {
                    callback(err, null);
                }
            }            
        });
        $A.enqueueAction(action);        
    }
    
})