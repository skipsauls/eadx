({
	selectAppTemplate: function(component, event, helper) {
        var target = event.getTarget ? event.getTarget().getElement() : event.target;
        console.warn('target: ', target);
        var item = target.closest("li");
        console.warn("item: ", item);
        var templateId = item.getAttribute("data-template-id");
        console.warn("templateId: ", templateId);
        var appTemplateMap = component.get("v.appTemplateMap");
        var template = appTemplateMap[templateId];
        console.warn("template: ", template);
        component.set("v.selectedAppTemplate", template);
	}
})