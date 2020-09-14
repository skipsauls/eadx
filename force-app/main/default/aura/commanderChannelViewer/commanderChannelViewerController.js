({
    init: function(component, event, helper) {
        component.set('v.channelColumns', helper.channelColumns);
        component.set('v.subscriberColumns', helper.subscriberColumns);
        component.set('v.eventLogColumns', helper.eventLogColumns);
        
        const empApi = component.find('empApi');

		const errorHandler = function (message) {
            console.error('EMP API error ', message);
        }.bind(this);
        
        empApi.onError(errorHandler);        
	           
        helper.refresh(component);
    },

	refresh: function (component, event, helper) {
		var params = event.getParam('arguments');
        var callback = params.callback;
        helper.refresh(component, callback);
    },

    handleBack: function(component, event, helper) {
        helper.refresh(component, null);
    },
    
    handleChannelAction: function(component, event, helper) {
        var action = event.getParam('action');
        var row = event.getParam('row');  
        helper.handleChannelAction(component, action, row);
    },    
    
    handleChannelSelect: function(component, event, helper) {
        helper.handleChannelSelect(component);
    },

    handleCreateChannel: function(component, event, helper) {
        helper.addChannel(component);
    },
    
    handleDeleteChannel: function(component, event, helper) {
        let channel = component.get('v.channel');
        let answer = confirm('Are you sure you want to delete channel ' + channel.name + '?');
        if (answer === true) {
            helper.deleteChannel(component);
        }
    },
    
    handleSelectEventLogline: function(component, event, helper) {
        let selectedRows = event.getParam('selectedRows');
        helper.handleSelectEventLogline(component, selectedRows);
    },
    
    handleChannelSubscriptionClick: function(component, event, helper) {
        helper.handleChannelSubscriptionClick(component);
    }
    
})