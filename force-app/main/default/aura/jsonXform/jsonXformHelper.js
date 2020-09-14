({
    timing: {t1: 0, t2: 0},
    
    sendToVF: function(component, payload) {
        let vfOrigin = "https://" + component.get("v.vfHost");
        let vfWindow = component.find("vfFrame").getElement().contentWindow;
        vfWindow.postMessage(payload, vfOrigin);
    },
    
    transform: function(component) {
        let self = this;
        try {
            let document = JSON.parse(component.get('v.document'));
            let values = JSON.parse(component.get('v.values'));
            let definition = JSON.parse(component.get('v.definition'));
            let requestId = Date.now();
            component.set('v.requestId', requestId);
            
            let payload = {
                action: 'transform',
                params: {
                    document: document,
                    values: values,
                    definition: definition,
                },            
                callback: 'handleTransformResult',
                requestId: requestId
            };
	        self.timing.t1 = Date.now();
            this.sendToVF(component, payload);
        } catch (e) {
            // Do nothing, it will only process when the JSON is valid
            // May provide a styling cue for valid JSON?
            //console.error('Error in jsonXformHelper.transform: ', e);
        }
    },
    
    handleTransformResult: function(component, err, resp, requestId) {
        let self = this;
        self.timing.t2 = Date.now();
        console.warn('timing: ', self.timing.t2 - self.timing.t1);
        if (component.get('v.requestId') !== requestId) {
            // Ignore
        } else {
            if (err) {
                let error = JSON.parse(JSON.stringify(err));
                let body = error.body;
                component.set('v.errors', body);
            } else {
                let response = JSON.parse(JSON.stringify(resp));
                let result = response.document;
                component.set('v.result', JSON.stringify(result, null, 2));
            }
        }
    },
    
    showToast: function(component, title, message) {
        component.find('notifyLib').showToast({
            title: title,
            message: message
        });        
    }
})