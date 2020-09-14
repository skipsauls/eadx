({
	doInit: function(component, event, helper) {
	},
    
    test: function(component, event,  helper) {
        helper.simulate(component);
        return;
        
        var payload = new Date() + " - Testing 123" + "\r\n";
        var eventLog = component.get("v.eventLog");
        eventLog.push(payload);
		component.set("v.eventLog", eventLog);
        component.set("v.eventLogStr", eventLog.join().replace(new RegExp("\,", "g"), ""));
    },

    clearLog: function(component, event,  helper) {
        component.set("v.eventLog", []);
        component.set("v.eventLogStr", "");
        var log = component.find("event-log").getElement();
		log.innerHTML = "";
    },        
    
	handleWaveAssetEvent: function(component, event, helper) {
        var payload = event.getParam("payload");
        helper.logWaveAssetEvent(component, payload);
        helper.handleWaveAssetEvent(component, payload);
	},
    
    createAppFromTemplate: function(component, event, helper) {
        helper.createAppFromTemplate(component);
    },
    
    createApp: function(component, event, helper) {
        helper.createApp(component);
    }
    
})