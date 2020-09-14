({
    payload: {
          "predictionDefinition": "0ORB0000000Ccs1OAC",
          "type": "Records",
          "records": ["a1SB0000000A9laMAC"]        
    },

    getPayload: function(component) {
    	let predictionDefinition = component.get('v.predictionDefinition');
        let type = component.get('v.type');
        let records = component.get('v.records').split(',');
        //console.warn('records: ', records, typeof records);
        let payload = {
            predictionDefinition: predictionDefinition,
            type: type,
            records: records
        };
        component.set('v.payload', payload);
        return payload;
    },
    
	getPrediction: function(component) {
        let self = this;
        
        let proxy = component.find('proxy');

        if (proxy.get('v.ready') !== true) {
            //console.warn('calling setTimeout');
            setTimeout(function() {
                self.getPrediction(component);
            }, 50);
        } else {
        
            let payload = self.getPayload(component);
            //console.warn('payload: ', payload);
            
            let baseUrl = component.get('v.baseUrl');
            
            var url = baseUrl + '/services/data/v47.0/smartdatadiscovery/predict';
    
            //console.warn('url: ', url);
            
            let config = JSON.stringify(payload);            
            
            proxy.exec(url, 'POST', config, function(response) {
                //console.warn('proxy returned: ', response)
                try {
	                let body = JSON.parse(response.body);
                    let predictions = body.predictions;
                    let prediction = predictions[0];
                    //console.warn('prediction: ', prediction);
                    component.set('v.prediction', prediction)                
                } catch (e) {
                    component.set('v.prediction', null);
                    console.error('Exception: ', e);
                }          
            });
        }
    },    
})