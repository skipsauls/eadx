({
    refreshTree: function(component, callback) {
        var self = this;
        
        console.warn('refreshTree');
        let items = component.get('v.items');

        let actionItems = component.get('v.actionItems') || [];
        let channelItems = component.get('v.channelItems') || [];
        
        if (items === null || typeof items === 'undefined') {
			items = [
                {
                    label: 'Actions',
                    name: 'actions',
                    disabled: false,
                    expanded: true,
                    items: actionItems
                },
                {
                    label: 'Channels',
                    name: 'channels',
                    disabled: false,
                    expanded: true,
                    items: channelItems
                }
            ];        
        }
        
        component.set('v.items', items);
        component.set('v.actionItems', actionItems);
        component.set('v.channelItems', channelItems);
        
        self.listActions(component, function(err, actions) {
            console.warn('listActions returned: ', JSON.parse(JSON.stringify(actions)));
            self.addActionItems(component, 'actions', 'action', actions);
        });
        
        self.listChannels(component, function(err, channels) {
            console.warn('listChannels returned: ', JSON.parse(JSON.stringify(channels)));
            self.addChannelItems(component, 'channels', 'channel', channels);
        });
        
    },
    
    selectItem: function(component, name) {
        let self = this;
        console.warn('selectItem: ', name);
        if (name === 'add_action') {
            self.addAction(component);
        } else if (name === 'add_channel') {
            self.addChannel(component);
        } else {
            component.set('v.selectedActionName', name);
            var items = component.get('v.items');
            //console.warn('items: ', items);
            
            var itemMaps = component.get('v.itemMaps');
            //console.warn('itemMaps: ', itemMaps);
            
            var itemMap = null;
            var item = null;
            for (var nodeLabel in itemMaps) {
                itemMap = itemMaps[nodeLabel];
                item = itemMap[name];
                if (item !== null && typeof item !== 'undefined') {
                    break;
                }
            }
            console.warn('item: ', item);
            console.warn('nodeLabel: ', nodeLabel);
            if (item && item.action) {
                component.set('v.actionType', item.action.type);
                component.set('v.actionId', item.action.id);
                component.set('v.action', item.action);
                
                component.set('v.channelId', null);
                component.set('v.channel', null);
            } else if (item && item.channel) {
                
                component.set('v.channelId', item.channel.id);
                component.set('v.channel', item.channel);
                
                component.set('v.actionId', null);
                component.set('v.action', null);
                
            }
        }
    },
    
    addAction: function(component) {
        console.warn('addAction');
        let self = this;

        let action = {
            label: '',
            name: '',
            type: '',
            description: '',
            commandTarget: {
                name: null
            }
        };
        let config = {
            action: action
        };
        
        $A.createComponents([
            ["c:commanderActionEditor", config],
            ["c:commanderParameterFooter", {}]
        ], function(components, status, err) {
            console.warn('components: ', components);
            console.warn('status: ', status);
            console.warn('err: ', err);
            if (status === "SUCCESS") {
                let modalBody = components[0];
                let modalFooter = components[1];
                modalBody.set('v.action', action);
                component.find('overlayLib').showCustomModal({
                    header: "New Action",
                    body: modalBody,
                    footer: modalFooter,
                    showCloseButton: true,
                    cssClass: "mymodal",
                    closeCallback: function() {
                        console.warn('action: ', action);
                        self.createAction(component, action);							                            
                    }
                })
            }                               
        });            
    },

    checkActionCompletion: function(component) {
        console.warn('checkActionCompletion');
        let self = this;
        let items = component.get('v.items');
        let actionCount = items[0].items.length;
        console.warn('actionCount: ', actionCount);
        
        self.listActions(component, function(err, actions) {
            console.warn('actions.length: ', actions.length);
            if (actions.length <= actionCount) {
                setTimeout($A.getCallback(function() {
                    self.checkActionCompletion(component);
                }), 2000);  
            } else {
                self.refreshTree(component, null);            
            }
        });
    },
    
    addIntent: function(component, actionDescribe) {
        console.warn('addIntent: ', actionDescribe);
        let self = this;
        let proxy = component.find('proxy');
        
        let url = actionDescribe.intentsUri;
        let config = {
            phrase: 'Test'
        };
        
        let body = JSON.stringify(config);
        console.warn('calling POST on url: ', url, ' with body: ', body);
        
        proxy.exec(url, 'POST', body, function(response) {
            console.warn('add intent response: ', response);
            //self.checkActionCompletion(component);
            setTimeout($A.getCallback(function() {
                self.refreshTree(component);
            }), 3000);  
        });
    },
    
    createAction: function(component, action) {
        let self = this;
        let proxy = component.find('proxy');
    	//let actionDescribe = component.get('v.actionDescribe');
        
        // How to best get this dynamically?
        let version = '46.0';
        let url = '/services/data/v' + version + '/einstein-conduit/actions/';
        
        let config = {
            label: action.label,
            name: action.name,
            type: action.type,
            description: action.description
        };
        
        if (action.commandTarget.name !== null && typeof action.commandTarget.name !== 'undefined') {
            /*
            config.commandTarget = {
                name: action.commandTarget.name
            };
			*/
            config.commandTarget = action.commandTarget.name;
        }
        let body = JSON.stringify(config);
        console.warn('calling POST on url: ', url, ' with body: ', body);
        
        proxy.exec(url, 'POST', body, function(response) {
            console.warn('create action response: ', response);
            let results = JSON.parse(response.body);
            if (results.length > 0) {
                console.error('Error code: ', results[0].errorCode, ', message: ', results[0].message);
            } else {
                // Add at least one intent
	            self.addIntent(component, results);
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
        
        $A.createComponents([
            ["c:commanderChannelEditor", config],
            ["c:commanderParameterFooter", {}]
        ], function(components, status, err) {
            console.warn('components: ', components);
            console.warn('status: ', status);
            console.warn('err: ', err);
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
                        console.warn('channel: ', channel);
                        self.createChannel(component, channel);							                            
                    }
                })
            }                               
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
        
        proxy.exec(url, 'POST', body, function(response) {
            console.warn('create channel response: ', response);
            let results = JSON.parse(response.body);
            if (results.length > 0) {
                console.error('Error code: ', results[0].errorCode, ', message: ', results[0].message);
            } else {
                setTimeout($A.getCallback(function() {
	                self.refreshTree(component, null);                                
                }), 2000);
            }
        });
    },

    createActionDetailItem: function(component, key, label, value, resType, action) {
        var self = this;    
        if (typeof value === "object") {
            //var label = key + (typeof value !== 'object' ? ': ' + value : '');
            var item = { 
                label: label + (typeof value !== 'object' ? ': ' + value : ''),
                name: key,
                action: action,
                expanded: false,
                disabled: false,
                items: []
            };
            
            var child = null;                
            if (value instanceof Array) {
                for (var i  = 0; i < value.length; i++) {
                    child = self.createActionDetailItem(component, key + "[" + i + "]", '' + i, value[i], resType, action);
                    item.items.push(child);
                }                    
            } else {
                for (var k in value) {
                    child = self.createActionDetailItem(component, key + "." + k, k, value[k], resType, action);
                    item.items.push(child);
                }                    
            }
            return item;
        } else {
            //var label = key + (typeof value !== 'object' ? ': ' + value : '');
            var item = {
                label: label + (typeof value !== 'object' ? ': ' + value : ''),
                name: key,
                action: action,
                expanded: false,
                disabled: false,
                items: []
            };
            return item;   
        }
    },
    
    addActionItems: function(component, nodeLabel, singularLabel, actions) {
        var items = component.get('v.items') || [];
        
        var itemMaps = component.get('v.itemMaps') || {};
        
        var self = this;
        var parent = null;
        items.forEach(function(item) {
            if (item.name === nodeLabel) {
                parent = item;
            } 
        });
        
        let selectedActionName = component.get('v.selectedActionName');

        var actionMap = itemMaps[nodeLabel] || {};
        var name = null;
        
        if (parent !== null) {
            parent.items = [];
            actions.forEach(function(action, i) {
                //console.warn('action: ', action);
                name = action.namespace ? action.namespace + '__' + action.name : action.name;
                if (name === selectedActionName) {
                    component.set('v.action', action);
                }
                var actionItem = { 
                    label: action.label,
                    name: name,
                    action: action,
                    expanded: false,
                    disabled: false,
                    items: [],
                    selected: i === 0
                };                
                var actionItems = [];
                var value = null;
                var item = null;
                for (var key in action) {
                    value = action[key];
                    item = self.createActionDetailItem(component, action.name + '.' + key, key, value, nodeLabel, action);
                    actionItems.push(item);
                }
                actionItem.items = actionItems;
                parent.items.push(actionItem);
                
                actionMap[name] = actionItem;
            });
        }
        
        var actionItem = { 
            label: '➕ Add ' + singularLabel.substring(0, 1).toUpperCase() + singularLabel.substring(1),
            name: 'add_' + singularLabel,
            expanded: false,
            disabled: false,
            items: null,
            selected: false
        };
        
        parent.items.push(actionItem);
        
        
        itemMaps[nodeLabel] = actionMap;
        
        component.set('v.itemMaps', itemMaps);
        
        //console.warn('setting v.items: ', items);
        
        component.set('v.items', items);

    },
    
    createChannelDetailItem: function(component, key, label, value, resType, channel) {
        var self = this;    
        if (typeof value === "object") {
            //var label = key + (typeof value !== 'object' ? ': ' + value : '');
            var item = { 
                label: label + (typeof value !== 'object' ? ': ' + value : ''),
                name: key,
                channel: channel,
                expanded: false,
                disabled: false,
                items: []
            };
            
            var child = null;                
            if (value instanceof Array) {
                for (var i  = 0; i < value.length; i++) {
                    child = self.createChannelDetailItem(component, key + "[" + i + "]", '' + i, value[i], resType, channel);
                    item.items.push(child);
                }                    
            } else {
                for (var k in value) {
                    child = self.createChannelDetailItem(component, key + "." + k, k, value[k], resType, channel);
                    item.items.push(child);
                }                    
            }
            return item;
        } else {
            //var label = key + (typeof value !== 'object' ? ': ' + value : '');
            var item = {
                label: label + (typeof value !== 'object' ? ': ' + value : ''),
                name: key,
                channel: channel,
                expanded: false,
                disabled: false,
                items: []
            };
            return item;   
        }
    },
    
    addChannelItems: function(component, nodeLabel, singularLabel, channels) {
        var items = component.get('v.items') || [];
        
        var itemMaps = component.get('v.itemMaps') || {};
        
        var self = this;
        var parent = null;
        items.forEach(function(item) {
            if (item.name === 'channels') {
                parent = item;
            } 
        });
        
        let selectedChannelName = component.get('v.selectedChannelName');

        var channelMap = itemMaps[nodeLabel] || {};
        var name = null;
        
        if (parent !== null) {
            parent.items = [];
            channels.forEach(function(channel, i) {
                name = channel.namespace ? channel.namespace + '__' + channel.name : channel.name;
                if (name === selectedChannelName) {
                    component.set('v.channel', channel);
                }
                var channelItem = { 
                    label: channel.label,
                    name: name,
                    channel: channel,
                    expanded: false,
                    disabled: false,
                    items: [],
                    selected: i === 0
                };                
                var channelItems = [];
                var value = null;
                var item = null;
                for (var key in channel) {
                    value = channel[key];
                    item = self.createChannelDetailItem(component, channel.name + '.' + key, key, value, nodeLabel, channel);
                    channelItems.push(item);
                }
                channelItem.items = channelItems;
                parent.items.push(channelItem);
                
                channelMap[name] = channelItem;
            });
        }
        
        var channelItem = { 
            label: '➕ Add ' + singularLabel.substring(0, 1).toUpperCase() + singularLabel.substring(1),
            name: 'add_' + singularLabel,
            expanded: false,
            disabled: false,
            items: null,
            selected: false
        };
        
        parent.items.push(channelItem);
        
        
        itemMaps[nodeLabel] = channelMap;
        
        component.set('v.itemMaps', itemMaps);
        
        component.set('v.items', items);
    },
    
    listActions: function(component, callback) {
        var self = this;
        var commanderApi = component.find('commanderApi');
        
        commanderApi.describe(null, null, null, function(response) {
            if (callback !== null && typeof callback !== 'undefined') {
                callback(null, response.actions);
            } else {
                return null;
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
    }
    
    
})