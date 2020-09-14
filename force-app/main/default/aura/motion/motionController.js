({
    init: function(component, event, helper) {
        
    },
    
    toggleRunning: function(component, event, helper) {
        console.warn('toggleRunning');
        let running = component.get('v.running');
        let interval = component.get('v.interval');
        let duration = component.get('v.duration');
        
        if (running) {
            window.clearInterval(interval);
            interval = null;
            running = false;
        } else {
            let position = {x: 0, y: 0, z: 0};
            component.set('v.position', position);
            interval = window.setInterval(function() {
                console.warn('interval');
                let history = component.get("v.history");
                let latest = component.get("v.latest");
                if (latest !== null && typeof latest !== 'undefined') {
	                history.push(latest);
    	            component.set('v.history', history);
                }
                
                /*
                let position = component.get('v.position');// || {x: 0, y: 0, z: 0};
                position.x = (parseFloat(position.x) + latest.acceleration.x).toFixed(4);
                position.y = (parseFloat(position.y) + latest.acceleration.y).toFixed(4);
                position.z = (parseFloat(position.z) + latest.acceleration.z).toFixed(4);
                component.set('v.position', position);
                */
                
            }, duration);
            running = true;
            component.set('v.interval', interval);
        }
        
        component.set('v.interval', interval);
        component.set('v.running', running);
        
    }
})