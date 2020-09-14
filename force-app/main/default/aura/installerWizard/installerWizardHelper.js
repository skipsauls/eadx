({
    stepHandlers: {
        0: "showSelectAppTemplate",
        1: "showSelectApp"
        
    },
    
    openWizard: function(component) {
        this.resetWizard(component);
        var dialog = component.find("dialog");
		var backdrop = component.find("backdrop");
        $A.util.addClass(backdrop, "slds-backdrop_open");    
        $A.util.addClass(dialog, "slds-fade-in-open");        
    },
    
    closeWizard: function(component) {
        var dialog = component.find("dialog");
		var backdrop = component.find("backdrop");
        $A.util.removeClass(dialog, "slds-fade-in-open");
        $A.util.removeClass(backdrop, "slds-backdrop_open");        
    },
    
    resetWizard: function(component) {
        component.set("v.step", 0);
        this.showCurrentStep(component);
    },

    handleNext: function(component) {
        var step = component.get("v.step");
        step++;
        component.set("v.step", step);
        this.showCurrentStep(component);
    },

    handleBack: function(component) {
        var step = component.get("v.step");
        step = step > 0 ? step - 1 : 0;
        component.set("v.step", step);
        this.showCurrentStep(component);
        this.showCurrentStep(component);
    },
    
    showCurrentStep: function(component) {
        var self = this;
        var step = component.get("v.step");
        console.warn("step: ", step);
		var handler = self.stepHandlers[step];
        console.warn('handler: ', handler);
        if (handler && typeof self[handler] === "function") {
            self[handler](component);
        }
    },
    
    showSelectAppTemplate: function(component) {
        console.warn("installWizardHelper.showSelectAppTemplate");
        var appTemplates = component.get("v.appTemplates");
        var appTemplateMap = component.get("v.appTemplateMap");
        
        var config = {
            appTemplates: appTemplates,
            appTemplateMap: appTemplateMap,
            callback: function(context) {
                self.handleWizardCallback(component, context);
            }
        }
        $A.createComponent("c:installerAppTemplateSelect", config, function(cmp, status, err) {
            console.warn("createComponent: ", cmp, status, err);
            if (status === "SUCCESS") {
                var content = component.get("v.content");
                content = [];
                content.push(cmp);
                component.set("v.content", content);
            } else {
                //
            }
        });
        /*
        var appTemplate = null;
        for (var name in appTemplateMap) {
            appTemplate = appTemplateMap[name];
            console.warn("appTemplate: ", appTemplate);
        }
        */
    }
})