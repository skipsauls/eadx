({
    createApp: function(component, callback) {
        var appName = component.get('v.appName');
        var templateId = component.get('v.templateId');
        console.warn('create app ', appName, ' from template with the id ', templateId);
        
        var proxy = component.find('proxy');
        var templateId = component.get('v.templateId');
        var selectedType = component.get('v.selectedType');
        var ready = proxy.get('v.ready');
        var self = this;
        if (ready === false) {
            setTimeout(function() {
                self.getTemplate(component, callback);
            }, 100);
        } else {
            //var url = 'https://df17eadx-dev-ed.my.salesforce.com/services/data/v42.0/wave/folders';
            var url = '/services/data/v42.0/wave/folders';
            var method = 'POST';
            
            var config = {
                assetIcon:"16.png",
                description: "",
                label: appName,
                name: appName,
                templateSourceId: templateId,
                templateValues: {},
                templateOptions: {
                    appAction: "Create"
                }
            };
            
            var body = JSON.stringify(config);
            
            proxy.exec(url, method, body, function(response) {
                response = JSON.parse(JSON.stringify(response));
                if (response && response.body) {
                    if (typeof callback === 'function') {
                        callback(response.body);
                    }
                }
            });
        }        
    }    
    
})