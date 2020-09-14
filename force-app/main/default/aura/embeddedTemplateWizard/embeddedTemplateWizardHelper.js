({
    showToast : function(cmp, title, message, messageData, variant, mode) {
        cmp.find('notifyLib').showToast({
            title: title,
            message: message,
            messageData: messageData || null,
            variant: variant || 'info',
            mode: mode || 'dismissable'
        });        
    },  

    createAppRequest : function(cmp){
        var wairApi = cmp.find('wairApi');
        var requestPermissions = cmp.get('v.requestPermissions');
        var templateMetadata = cmp.get('v.templateMetadata');
        if (requestPermissions && requestPermissions.canCreate){  
            cmp.set('v.busy', true);
            var helper = this;
            wairApi.createInstallRequest('Create app', cmp.get('v.templateApiName'), null, 
                'WaveAppCreate', 'Enqueued', {}, function(request, error){
                if (request){
                    cmp.set('v.waveAutoInstallRequest', request);
                } else {
                    helper.showToast(cmp, 'Unable to create request ' + requestType, error, null, 'error');
                }
                cmp.set('v.busy', false);
            });
        }        
    }
})