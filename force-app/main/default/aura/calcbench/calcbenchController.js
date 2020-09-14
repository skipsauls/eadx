({
	calcLightning: function(component, event, helper) {
        var val = component.get("v.val");
        var exp = component.get("v.exp");
        var count = component.get("v.count");

        var p = [];
        var t1 = Date.now();        
        for (var i = 0; i < count; i++) {
            p.push(Math.pow(val, i));
        }
        var t2 = Date.now();
        var timing = t2 - t1;
        var results = [
            'count: ' + count,
			'time: ' + timing + ' ms',
			'' + Math.round(count / timing * 1000) + ' per second',
        	p[0]
        ];
        
        component.set("v.results", JSON.stringify(results, null, 4));

		/*
        console.warn('count: ', count);
        console.warn('time: ' + timing + ' ms');
        console.warn('' + Math.round(count / timing * 1000) + ' per second');
        console.warn(p[0]);
        */
	},

	calcApex: function(component, event, helper) {
        var val = component.get("v.val");
        var exp = component.get("v.exp");
        var count = component.get("v.count");
        
        var action = component.get("c.doCalc");
        action.setParams({
            d: val,
            exp: exp,
            count: count
        });
        var self = this;
        action.setCallback(this, function(response) {
	        var t2 = Date.now();
            var state = response.getState();
            if (state === "SUCCESS") {
                var val = response.getReturnValue();
                val.push('client time: ' +  (t2 - t1) + ' ms');
                val.push(Math.round(count / (t2 - t1) * 1000) + ' per second');
		        component.set("v.results", JSON.stringify(val, null, 4));
            }
            else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.error("Error message: " + errors[0].message);
                    }
                } else {
                    console.error("Unknown error");
                }
            }            
        });
        var t1 = Date.now();
        $A.enqueueAction(action);        
	},
    
	strLightning: function(component, event, helper) {
        var target = component.get("v.target");
        var match = component.get("v.match");
        var count = component.get("v.count");

        var p = [];
        var t1 = Date.now();        
        for (var i = 0; i < count; i++) {
            p.push(target.indexOf(match));
        }
        var t2 = Date.now();
        var timing = t2 - t1;

        var results = [
            'count: ' + count,
			'time: ' + timing + ' ms',
			'' + Math.round(count / timing * 1000) + ' per second',
        	p[0]
        ];
        
        component.set("v.results", JSON.stringify(results, null, 4));

		/*
        console.warn('count: ', count);
        console.warn('time: ' + timing + ' ms');
        console.warn('' + Math.round(count / timing * 1000) + ' per second');
        console.warn(p[0]);
        */
	},
    
	strApex: function(component, event, helper) {
        var target = component.get("v.target");
        var match = component.get("v.match");
        var count = component.get("v.count");
        
        var action = component.get("c.doStr");
        action.setParams({
            target: target,
            match: match,
            count: count
        });
        var self = this;
        action.setCallback(this, function(response) {
	        var t2 = Date.now();
            var state = response.getState();
            if (state === "SUCCESS") {
                var val = response.getReturnValue();
                val.push('client time: ' +  (t2 - t1) + ' ms');
                val.push(Math.round(count / (t2 - t1) * 1000) + ' per second');
		        component.set("v.results", JSON.stringify(val, null, 4));
            }
            else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.error("Error message: " + errors[0].message);
                    }
                } else {
                    console.error("Unknown error");
                }
            }            
        });
        var t1 = Date.now();
        $A.enqueueAction(action);        
	},
    
})