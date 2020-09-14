({
    run: function(component, event, helper) {
               
        let startDate = component.get('v.startDate');
        let endDate = component.get('v.endDate');
        let interval = component.get('v.interval');
        
        let startTime = new Date(startDate).getTime();
        let endTime = new Date(endDate).getTime();
        
        let intervalObj = setInterval(function() {
            helper.bringTheHeat(component, startTime, endTime);
            startTime += interval;
        }, 1000);
        
        component.set('v.intervalObj', intervalObj);
    },
    
    run2: function(component, event, helper) {
               
        let startDate = component.get('v.startDate');
        let endDate = component.get('v.endDate');
        let interval = component.get('v.interval');
        
        let startTime = new Date(startDate).getTime();
        let endTime = new Date(endDate).getTime();
        
        helper.bringTheHeat2(component, startTime, endTime);
    },
    
    handleSelectionChanged: function(component, event, helper) {
        var params = event.getParams();
        console.warn('params: ', params);        
        var id = params.id;
        console.warn('id: ', id);
        var noun = params.noun;
        console.warn('noun: ', noun);
        var verb = params.verb;
        console.warn('verb: ', verb);
        var payload = params.payload;
        console.warn('payload: ', payload);
        var row = null;        
        if (payload) {                
            var step = payload.step;
            console.warn('step: ', step);
            var data = payload.data;
            console.warn('data: ', data);
            data.forEach(function(obj) {
                for (var k in obj) {
                    console.warn(k, obj[k]);
                }
            });
        }
    }    
    
})