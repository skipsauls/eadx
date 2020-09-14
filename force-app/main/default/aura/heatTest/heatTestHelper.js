({
    bringTheHeat: function(component, startTime, endTime) {
        
        if (startTime > Date.now() || startTime >= endTime) {
            let intervalObj = component.get('v.intervalObj');
            clearInterval(intervalObj);            
        } else {
            
            let developerName = component.get('v.developerName');
            
            let datasetName = 'eadx__opportunity';
            
            let filter = {
                datasets: {}
            };
            
            filter.datasets[datasetName] = [
                {
                    fields: [],
                    filter: {
                        operator: null,
                        values: []
                    }
                }
            ];
            
            filter.datasets[datasetName][0].fields = ['CloseDate'];
            filter.datasets[datasetName][0].filter.operator = '>=<=';
            filter.datasets[datasetName][0].filter.values.push([startTime, endTime]);
            
            var params = {
                value: JSON.stringify(filter),
                id: developerName, // Can also use developerName in 218+
                type: "dashboard"
            };
            
            var evt = $A.get('e.wave:update');
            evt.setParams(params);
            evt.fire();
            
        }
        
        
    },
    
    lastTime: 0,
    
    bringTheHeat2: function(component, startTime, endTime) {
        
        let developerName = component.get('v.developerName');
        let interval = component.get('v.interval');
        let datasetName = 'eadx__opportunity';                       

        let animate = function() {
            
            if (startTime > Date.now() || startTime >= endTime) {
                console.warn('1');
                return;
            }
            
            if (Date.now() - 1000 <= self.lastTime) {
                console.warn('2');
                requestAnimationFrame(animate);
            }
            
            self.lastTime = Date.now();
            
            startTime += interval;

            
            let filter = {
                datasets: {}
            };
            
            filter.datasets[datasetName] = [
                {
                    fields: [],
                    filter: {
                        operator: null,
                        values: []
                    }
                }
            ];
            
            filter.datasets[datasetName][0].fields = ['CloseDate'];
            filter.datasets[datasetName][0].filter.operator = '>=<=';
            filter.datasets[datasetName][0].filter.values.push([startTime, endTime]);
            
            var params = {
                value: JSON.stringify(filter),
                id: developerName, // Can also use developerName in 218+
                type: "dashboard"
            };
            
            var evt = $A.get('e.wave:update');
            evt.setParams(params);
            evt.fire();
            
            requestAnimationFrame(animate);
        }
        
        requestAnimationFrame(animate);
    }
})