({
	showDashboard: function(component, event, helper) {
		
        var el = event.getTarget ? event.getTarget().getElement() : event.target;
        var id = el.dataset.dashboardId;
        console.warn("el.dataset.showPanel: ", el.dataset.showPanel, typeof el.dataset.showPanel);
        var showPanel = el.dataset.showPanel === "true";
        console.warn("showPanel: ", showPanel);
        
        component.set("v.currentDashboardId", id);
        
        var config = {
            dashboardId: id,
            openLinksInNewWindow: false,
            height: "600"
        };
        
        $A.createComponent("wave:waveDashboard", config, function(cmp, msg, err) {
			var container = component.find("dashboard-outer");
            container.set("v.body", cmp);
            
            var panel = component.find("side-panel").getElement();
            var container = component.find("dashboard-container").getElement();;
            
            if (showPanel === true) {
                panel.classList.remove("slds-is-collapsed");
                panel.classList.remove("slds-hide");
                panel.classList.add("slds-size--1-of-3");
                
	            container.classList.remove("slds-size--3-of-3");
	            container.classList.add("slds-size--2-of-3");
                
            } else {
                panel.classList.add("slds-is-collapsed");
                panel.classList.add("slds-hide");
                panel.classList.remove("slds-size--1-of-3");
                
	            container.classList.remove("slds-size--2-of-3");
	            container.classList.add("slds-size--3-of-3");
                
            }

        });
        
	}
})