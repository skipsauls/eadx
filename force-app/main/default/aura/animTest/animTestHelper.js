({
    doWork: function(component) {
        var self = this;
        var timestamp = component.get("v.timestamp");
        var interval = component.get("v.interval");
        if (Date.now() >= timestamp + interval) {
            var counter = component.get("v.counter");
            counter++;
            component.set("v.counter", counter);
            component.set("v.timestamp", Date.now());            
        }
        var globalId = requestAnimationFrame($A.getCallback(function() {
            self.doWork(component);
        }));
        component.set("v.globalId", globalId);        
    },
    
	start: function(component) {
        console.warn("start");
        var self = this;
        var globalId = requestAnimationFrame($A.getCallback(function() {
            self.doWork(component);
        }));
        component.set("v.globalId", globalId);
	},
    
    stop: function(component) {
        console.warn("stop");
        var globalId = component.get("v.globalId");
        cancelAnimationFrame(globalId);
    }    
})