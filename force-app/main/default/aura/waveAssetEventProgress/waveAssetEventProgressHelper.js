({
    viewEventDetails: function(cmp, eventType){
        var events = cmp.get('v.eventData')[eventType].events;
        var title = 'Event Viewer - '+ cmp.get('v.eventData')[eventType].label;
        var config = {
            title: title,
            events: events
        };                   
        
        $A.createComponents([
            ["c:waveAssetEventDetail", config],
        ], function(components, status, err) {
            if (status === "SUCCESS") {
                cmp.find('overlayLib').showCustomModal({
                    header: title,
                    body: components[0],
                    cssClass : 'event-detail-modal slds-modal_medium',
                    showCloseButton: true,
                    closeCallback: function() {
                    }
                })
            }                               
        });            
    },
    
	handleProgressUpdate : function(cmp, event, helper) {
        var payload = event.getParam('arguments');
		cmp.set('v.current', payload.eventType);
        cmp.set('v.hasError', 'Fail' === payload.status);
        if (payload.index >= 0 && payload.total !== 0){
            var eventData = cmp.get('v.eventData');
            eventData[payload.eventType].events.push(payload);
            switch(payload.status){
                case 'Fail':
                    payload.statusIcon = 'utility:error';
                    payload.statusCssClass = 'icon-red';
                    break;
                case 'Success':
                    payload.statusIcon = 'utility:check';
                    payload.statusCssClass = 'icon-green';
                    break;
            }
            cmp.set('v.eventData', eventData);
            helper.enableEventTypeActivities(cmp, eventData, payload);
        }
	},
    
    enableEventTypeActivities: function(cmp, eventData, payload){
        var eventArray = cmp.get('v.eventArray');
        var button = cmp.find('event_type_node_button')[eventArray.indexOf(payload.eventType)];
        if (button){
	        button.set('v.disabled', false);
            var label = eventData[payload.eventType].label + 
                ' (' + payload.index + '/' + payload.total + ')';
            button.set('v.label', label);
            button.set('v.title', label);
            if (payload.status === 'Fail'){
                button.set('v.iconName', 'utility:error');
                $A.util.removeClass(button, 'slds-text-color_success');
                $A.util.addClass(button, 'slds-text-color_error');
            } else if (payload.status === 'Success' && payload.index === payload.total){
                button.set('v.iconName', 'utility:check');
                 $A.util.removeClass(button, 'slds-text-color_error');
                 $A.util.addClass(button, 'slds-text-color_success');
            } else {
                button.set('v.iconName', 'utility:spinner');                
            }
        }
    }
})