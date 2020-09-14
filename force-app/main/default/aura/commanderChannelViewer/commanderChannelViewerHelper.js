({
    channelColumns: [
        {label: 'Channel Name', fieldName: 'name', type: 'text', cellAttributes: {}, editable: false, sortable: false},
        {label: 'Id', fieldName: 'id', type: 'text', cellAttributes: {}, editable: false, sortable: false},
        {
            type: 'action', 
            typeAttributes: {
                rowActions: [
                    {label: 'Open', name: 'open'},
                    {label: 'Delete', name: 'delete'}
                ]
            }
        }
    ],
    
    subscriberColumns: [
        {label: 'Subscriber Name', fieldName: 'name', type: 'text', cellAttributes: {}, editable: false, sortable: false},
        {label: 'Id', fieldName: 'id', type: 'text', cellAttributes: {}, editable: false, sortable: false},
        {label: 'Photo URL', fieldName: 'profilePhotoUrl', "class": 'foobar', type: 'url', cellAttributes: {}, editable: false},
        {
            type: 'action', 
            typeAttributes: {
                rowActions: [
                    {label: 'Edit', name: 'edit'},
                    {label: 'Delete', name: 'delete'}
                ]
            }
        }
    ],
    
/*
                    requestId: payload.requestId,
                    messageType: payload.messageType,
                    id: item.id,
                    label: item.label,
                    name: item.name,
                    createdDate: item.createdDate,
                    createdByName: item.createdBy.name,
                    createdById: item.createdBy.id,
                    lastModifiedDate: item.lastModifiedDate,
                    lastModifiedByName: item.lastModifiedBy.name,
                    lastModifiedById: item.lastModifiedBy.id,
                    state: item.state,
                    uri: item.uri
*/
    
    eventLogColumns: [
        {label: 'Request ID', fieldName: 'requestId', type: 'text', cellAttributes: {}, editable: false, sortable: false},
        {label: 'ID', fieldName: 'id', type: 'text', cellAttributes: {}, editable: false, sortable: false},
        {label: 'Message Type', fieldName: 'messageType', type: 'text', cellAttributes: {}, editable: false, sortable: false},
        {label: 'Label', fieldName: 'label', type: 'text', cellAttributes: {}, editable: false, sortable: false},
        {label: 'Name', fieldName: 'name', type: 'text', cellAttributes: {}, editable: false, sortable: false},
        {
            type: 'action', 
            typeAttributes: {
                rowActions: [
                    {label: 'Edit', name: 'edit'},
                    {label: 'Delete', name: 'delete'}
                ]
            }
        }
    ],
        
    refresh: function(component, callback) {
        let self = this;
        self.listChannels(component, function(err, channels) {
            component.set('v.channels', channels);
            component.set('v.channel', null);
            component.set('v.channelDetails', null);
            if (typeof callback === 'function') {
                callback(null, channels);
            }
        });
    },
    
    listChannels: function(component, callback) {
        var self = this;
        
        var commanderApi = component.find('commanderApi');
        
        commanderApi.getChannels(null, null, function(response) {
            if (callback !== null && typeof callback !== 'undefined') {
                callback(null, response.channels);
            } else {
                return null;
            }            
        });
    },
    
    handleChannelSelect: function(component) {
        let self = this;
        let channel = component.get('v.channel');
        console.warn('handleChannelSelect: ', channel);
        if (channel) {
            self.getChannelDetails(component, channel, function(err, channelDetails) {
                if (err) {
                    console.error('getChannelDetails error: ', err);
                } else {
                    component.set('v.channelDetails', channelDetails);
                }
            });
        } else {
            component.set('v.channelDetails', null);
        }
    },
    
    handleChannelAction: function(component, action, channel) {
        let self = this;
        console.warn('handleChannelAction');
        
        if (action.name === 'delete') {
            let answer = confirm('Are you sure you want to delete channel ' + channel.name + '?');
            if (answer === true) {
                self.deleteChannel(component, channel);
            }            
        } else if (action.name === 'open') {
            self.getChannelDetails(component, channel, function(err, channelDetails) {
                component.set('v.channelDetails', channelDetails);            
            });
        } else if (action.name === 'edit') {
            self.getChannelDetails(component, channel, function(err, channelDetails) {
                self.editChannel(component, channelDetails);         
            });
        }
    },
    
    getChannelDetails: function(component, channel, callback) {
        let self = this;
        
        let proxy = component.find('proxy');
        
        let url = channel.uri;
        
        let config = {
        };
        
        let body = JSON.stringify(config);
        
        proxy.exec(url, 'GET', body, function(response) {
            if (typeof callback === 'function') {
                callback(null, response.body);
            }
        });
    }, 
    
    addChannel: function(component) {
        console.warn('addChannel');
        let self = this;
        
        let channel = {
            name: '',
            description: ''
        };
        let config = {
            channel: channel
        };
        
        var closeAction = component.getReference('v.closeAction');
        
        $A.createComponents([
            ["c:commanderChannelEditor", config],
            ["c:commanderToolsModalFooter", {closeAction: closeAction}]
        ], function(components, status, err) {
            if (status === "SUCCESS") {
                let modalBody = components[0];
                let modalFooter = components[1];
                modalBody.set('v.channel', channel);
                component.find('overlayLib').showCustomModal({
                    header: "New Channel",
                    body: modalBody,
                    footer: modalFooter,
                    showCloseButton: true,
                    cssClass: "mymodal",
                    closeCallback: function() {
                        closeAction = component.get('v.closeAction');
                        if (closeAction === 'save') {
                            self.createChannel(component, channel);							                            
                        } else {
                            // Do nothing
                        }
                    }
                })
            }                               
        });            
    },

    editChannel: function(component, channelDetails) {
        console.warn('editChannel');
        let self = this;
        
        let channel = {
            name: channelDetails.name,
            description: channelDetails.description
        };
        
        let config = {
            channel: channel
        };
        
        var closeAction = component.getReference('v.closeAction');
        
        $A.createComponents([
            ["c:commanderChannelEditor", config],
            ["c:commanderToolsModalFooter", {closeAction: closeAction}]
        ], function(components, status, err) {
            if (status === "SUCCESS") {
                let modalBody = components[0];
                let modalFooter = components[1];
                modalBody.set('v.channel', channel);
                component.find('overlayLib').showCustomModal({
                    header: "New Channel",
                    body: modalBody,
                    footer: modalFooter,
                    showCloseButton: true,
                    cssClass: "mymodal",
                    closeCallback: function() {
                        closeAction = component.get('v.closeAction');
                        if (closeAction === 'save') {
                            self.updateChannel(component, channel);							                            
                        } else {
                            // Do nothing
                        }
                    }
                })
            }                               
        });            
    },
    
    showSpinner: function(component, text) {
        let spinner = component.find('spinner');
        spinner.set('v.alternativeText', text || '');
        $A.util.removeClass(spinner, 'slds-hide');
    },
    
    hideSpinner: function(component) {
        let spinner = component.find('spinner');
        $A.util.addClass(spinner, 'slds-hide');
    },
    
    showToast: function(component, title, message, messageData, variant, mode) {
        component.find('notifyLib').showToast({
            title: title,
            message: message,
            messageData: messageData || null,
            variant: variant || 'info',
            mode: mode || 'dismissable'
        });        
    },
    
    createChannel: function(component, channel) {
        let self = this;
        let proxy = component.find('proxy');
        
        // How to best get this dynamically?
        let version = '46.0';
        let url = '/services/data/v' + version + '/sobjects/StreamingChannel';
        
        let config = {
            name: channel.name,
            description: channel.description
        };
        
        let body = JSON.stringify(config);
        console.warn('calling POST on url: ', url, ' with body: ', body);
        
        
        self.showSpinner(component, 'Creating channel ' + channel.name);
        
        proxy.exec(url, 'POST', body, function(response) {
            console.warn('create channel response: ', response);
            let results = JSON.parse(response.body);
            if (results.length > 0) {
                console.error('Error code: ', results[0].errorCode, ', message: ', results[0].message);
                self.hideSpinner(component);
                self.showToast(component, 'Error Creating Channel', 'Failed to create channel ' + channel.name, null, 'error', 'dismissable');
            } else {
                setTimeout($A.getCallback(function() {
                    self.refresh(component);
                    self.hideSpinner(component);
                    self.showToast(component, 'Successfully Created Channel', 'Created channel ' + channel.name, null, 'success', 'dismissable');
                }), 3000);
            }
        });
    },

    updateChannel: function(component, channel) {
        let self = this;
        let proxy = component.find('proxy');
        
        // How to best get this dynamically?
        let version = '46.0';
        let url = '/services/data/v' + version + '/sobjects/StreamingChannel';
        
        let config = {
            name: channel.name,
            description: channel.description
        };
        
        let body = JSON.stringify(config);
        console.warn('calling PATCH on url: ', url, ' with body: ', body);
        
        
        self.showSpinner(component, 'Updating channel ' + channel.name);
        
        proxy.exec(url, 'PATCH', body, function(response) {
            console.warn('update channel response: ', response);
            let results = JSON.parse(response.body);
            if (results.length > 0) {
                console.error('Error code: ', results[0].errorCode, ', message: ', results[0].message);
                self.hideSpinner(component);
                self.showToast(component, 'Error Updating Channel', 'Failed to update channel ' + channel.name, null, 'error', 'dismissable');
            } else {
                setTimeout($A.getCallback(function() {
                    self.refresh(component);
                    self.hideSpinner(component);
                    self.showToast(component, 'Successfully Updated Channel', 'Updated channel ' + channel.name, null, 'success', 'dismissable');
                }), 3000);
            }
        });
    },
    
    deleteChannel: function(component, channel) {
        let self = this;
        //let channel = component.get('v.channel');
                
        let proxy = component.find('proxy');
        
        let version = '46.0';
        let url = '/services/data/v' + version + '/sobjects/StreamingChannel/' + channel.id;        
        
        let config = {
        };
        
        let body = JSON.stringify(config);
        console.warn('calling DELETE on url: ', url, ' with body: ', body);
        
        self.showSpinner(component, 'Deleting channel ' + channel.name);
        
        proxy.exec(url, 'DELETE', body, function(response) {
            //component.set('v.channel', null);
            //component.set('v.channelDetails', null);
            setTimeout($A.getCallback(function() {
                self.refresh(component);
                self.hideSpinner(component);
                self.showToast(component, 'Successfully Deleted Channel', 'Deleted channel ' + channel.name, null, 'success', 'dismissable');                
            }), 3000);
        });        
    },

    handleChannelSubscriptionClick: function(component) {
        let self = this;
        const empApi = component.find('empApi');
        let channelDetails = component.get('v.channelDetails');
        console.warn('channelDetails: ', channelDetails);
        console.warn('handleChannelSubscriptionClick: ', channelDetails.topic);
        let subscriptions = component.get('v.subscriptions') || {};
        let selectedSubscription = component.get('v.selectedSubscription'); //subscriptions[channelDetails.topic];
        if (selectedSubscription === null || typeof selectedSubscription === 'undefined') {
            
            let callback = function (message) {
                
                console.warn('message: ', message);
                let channel = message.channel;
                console.warn('channel: ', channel);
                let data = message.data;
                console.warn('data: ', data);
                let payload = JSON.parse(data.payload);
                console.warn('payload: ', payload);
                let selectedSubscription = component.get('v.selectedSubscription');
                console.warn('selectedSubscription: ', selectedSubscription);
                if (payload.messageType === 'Item') {
                    selectedSubscription.log.push({
                        payload: payload,
                        requestId: payload.requestId,
                        messageType: payload.messageType,
                        id: payload.item.id,
                        uid: Date.now(),
                        label: payload.item.label,
                        name: payload.item.name /*,
                        createdDate: payload.item.createdDate,
                        createdByName: payload.item.createdBy.name,
                        createdById: payload.item.createdBy.id,
                        lastModifiedDate: payload.item.lastModifiedDate,
                        lastModifiedByName: payload.item.lastModifiedBy.name,
                        lastModifiedById: payload.item.lastModifiedBy.id,
                        state: payload.item.state,
                        uri: payload.item.uri */
                    });
                } else if (payload.messageType === 'Header') {
                    selectedSubscription.log.push({
                        payload: payload,
                        requestId: payload.requestId,
                        messageType: payload.messageType,
                        clientActionType: payload.clientActionType,
                        type: payload.action.type,
                        id: payload.action.id,
                        uid: Date.now(),
                        label: payload.action.label,
                        name: payload.action.name /*,
                        createdDate: payload.action.createdDate,
                        createdByName: payload.action.createdBy.name,
                        createdById: payload.action.createdBy.id,
                        lastModifiedDate: payload.action.lastModifiedDate,
                        lastModifiedByName: payload.action.lastModifiedBy.name,
                        lastModifiedById: payload.action.lastModifiedBy.id,
                        uri: payload.action.uri,
                        executedByName: payload.executedBy.name,
                        executedById: payload.executedBy.id */
                    });
                } else if (payload.messageType === 'Parameters') {
                    selectedSubscription.log.push({
                        payload: payload,
                        requestId: payload.requestId,
                        messageType: payload.messageType,
                        uid: Date.now(),
                        parameters: payload.parameters
                    });
                } else {
                    console.error('Unhandled payload.messageType: ', payload.messageType);
                }
                
                //console.warn('selectedSubscripton.log: ', selectedSubscription.log);
                //
                component.set('v.selectedSubscription', selectedSubscription);
                
            }.bind(this);
            
            const replayId = -1;
            
            empApi.subscribe(channelDetails.topic, replayId, callback).then(function(value) {	
                selectedSubscription = {
                    channelDetails: channelDetails,
                    log: [],
                    subscription: value
                };
                
                subscriptions[channelDetails.topic] = selectedSubscription;
                
                component.set('v.subscriptions', subscriptions);
                component.set('v.selectedSubscription', selectedSubscription);
            });            
            
        } else {
            let subscription = selectedSubscription.subscription;
            
            empApi.unsubscribe(subscription, function(resp) {
                console.warn('Unsubscribed from channel '+ unsubscribed.subscription);
                subscriptions[channelDetails.topic] = null;
                component.set('v.subscriptions', subscriptions);
                component.set('v.selectedSubscription', null);
            });            
        }
    },
    
    handleSelectEventLogline: function(component, selectedRows) {
        console.warn('handleSelectEventLogline: ', selectedRows);
        let logline = selectedRows[0];
        let json = JSON.stringify(logline, null, 2);
        component.set('v.selectedLoglineJson', json);
        //let channelDetails = component.get('v.channelDetails');
        //let selectedSubscription = subscriptions[channelDetails.topic];
    },
    
    
})