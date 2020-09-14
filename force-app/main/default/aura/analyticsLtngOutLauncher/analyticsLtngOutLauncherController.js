({
	launchPlayground: function(component, event, helper) {
		window.open("https://analytics-ltngout-playground.herokuapp.com?origin=" + window.location.origin, "_blank");
	},
    
	launchPlaygroundLocalhost: function(component, event, helper) {
        window.open("https://localhost\:3001?origin=" + window.location.origin, "_blank");
	}    
})