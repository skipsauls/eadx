({
    getTemplate: function(component, callback) {
        var proxy = component.find('proxy');
        var templateId = component.get('v.templateId');
        var selectedType = component.get('v.selectedType');
        var ready = proxy.get('v.ready');
        var self = this;
        if (ready === false) {
            setTimeout(function() {
                self.gegTemplate(component, callback);
            }, 100);
        } else {
            var url = '/services/data/v42.0/wave/templates/' + templateId;
            var method = 'GET';
            
            proxy.exec(url, method, null, function(response) {
                response = JSON.parse(JSON.stringify(response));
                if (response && response.body) {
                    if (typeof callback === 'function') {
                        callback(response.body);
                    }
                }
            });
        }		
        
    },
    
	setup: function(component) {
        var self = this;
        self.getTemplate(component, function(template) {
           	component.set('v.template', template); 
        });
	}
})