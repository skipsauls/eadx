({
    doSwitch: function(component, event, helper) {
        let v = component.get('v.switch');
        component.set('v.switch', v === 'A' ? 'B' : 'A');
    },
    
    doFire: function(component, event, helper) {
        let v = component.get('v.switch');
        let selection = {
            datasets: {
                "eadx__oppty_demo": [
                    {
                        fields: ["StageName"],
                        selection: ["Closed Won"]
                    }
                ]
            }            
        };
        
        let evt = $A.get('e.wave:update');
        let params = {
            value: JSON.stringify(selection),
            devName: v === 'A' ? component.get('v.developerNameA') : component.get('v.developerNameB'),
            type: "dashboard"
        };
        evt.setParams(params);
        evt.fire();        
    }
})