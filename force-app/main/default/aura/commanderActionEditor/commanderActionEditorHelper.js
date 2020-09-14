({
    actionTypes: [
        'ChannelSubscribe',
        'ChannelUnsubscribe',
        'NavigateCommanderState',
        'DatasetFilter',
        'DatasetSelection',
        'ViewAnalyticsDashboard',
        'AnalyticsDashboardUpdatePage',
        'ViewSobjectType',
        'InvocableActionApex'
    ],
    
    commandTargets: [
        {
            name: 'eadx__GenericAirInvocable'
        },
        {            
            name: 'eadx__SessionRecordingInvocable',
        }
    ],
    
    getCommandTargets: function(component, callback) {
        let self = this;
        let action = component.get('c.getInvocableActions');
        //action.setParams({query: query});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var val = response.getReturnValue();
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(null, val);
                }
            }
            else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var err = response.getError();
                console.error('error: ', err);
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(err, null);
                }
            }            
        });
        $A.enqueueAction(action);
    }
    
})