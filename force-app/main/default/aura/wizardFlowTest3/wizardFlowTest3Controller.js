({
	init: function(component, event, helper) {
        console.warn('wizardFlowTest3Controller.init');
        
        return;
        
        // DO NOT CALL THE CONTROLLER!!!!
        
        //helper.setup(component);
        
		var configId = component.get('v.configId');
        console.warn('configId: ', configId);
        var action = component.get('c.getTemplateConfig');
        action.setParams({
            id: configId
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var config = response.getReturnValue();
                console.warn('config: ', config);
                
                if (typeof callback === 'function') {
                    callback(null, config);
                }
            }
            else if (state === 'INCOMPLETE') {
                // do something
            } else if (state === 'ERROR') {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.error('Error message: ' + errors[0].message);
                        if (typeof callback === 'function') {
                            callback('Error message: ' + errors[0].message, null);
                        }
                    }
                } else {
                    console.error('Unknown error');
                    if (typeof callback === 'function') {
                        callback('Unknown error', null);
                    }
                    
                }
            }            
        });
        $A.enqueueAction(action);
	},
    
	handleFilterChange: function(component, event, helper) {
        helper.filterTemplates(component);        
    },
    
	handleSearchTermChange: function(component, event, helper) {
        helper.searchTemplates(component);        
    },

    handleTypeChange: function(component, event, helper) {
        helper.setup(component);        
    },

	handleSelectTemplate: function(component, event, helper) {
        if (event.target && event.target.closest) {
            console.warn('event: ', event, event.target);
            var cardBody = event.target.closest('.card-outer');
            var templateId = cardBody.dataset.templateId;
            console.warn('templateId: ', templateId);

            var templateList = component.get('v.templateList');
            var template = null;
            templateList.forEach(function(t) {
                if (t.id === templateId) {
                    template = t;
                } 
            });
            console.warn('template: ', template);
	        component.set('v.templateId', templateId);
            component.set('v.nextStep', 'configure');
    
            var navigate = component.get('v.navigateFlow');
            navigate('NEXT');             
        }
    },

    preview: function(component, event, helper) {
        console.warn('preview');
        var cmp = event.getSource();
        var templateId = cmp.get('v.name');
        console.warn('templateId: ', templateId);
        var templateList = component.get('v.templateList');
        var template = null;
        templateList.forEach(function(t) {
            if (t.id === templateId) {
                template = t;
            } 
        });
        console.warn('template: ', template);
        component.set('v.templateId', templateId);
        component.set('v.nextStep', 'preview');
        
        var navigate = component.get('v.navigateFlow');
        navigate('NEXT');             
    },
    

	handleNext: function(component, event, helper) {
		var navigate = component.get('v.navigateFlow');
		navigate('NEXT'); 
    },

	handleBack: function(component, event, helper) {
		var navigate = component.get('v.navigateFlow');
		navigate('BACK'); 
    },
    
    
})