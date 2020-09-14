({

	hotKeys: [
        {
            key: 'F1',
            command: 'Show Dashboard Coffee Time'
        },
        {
            key: 'F2',
            command: 'Select Channel by Stores'
        },
        {
            key: 'F3',
            command: 'Clear Channel'
        },
        {
            key: 'F4',
            command: 'Filter Type by Cold Drinks'
        },
        {
            key: 'F5',
            command: 'Reset Type'
        }
    ],
     
    hotKeyColumns: [
        { label: 'Key', fieldName: 'key', type: 'text', editable: 'true' },
        { label: 'Command', fieldName: 'command', type: 'text', editable: 'true' },
        { type: 'action', typeAttributes: {
            	rowActions: [
		    		{ label: 'Delete', name: 'delete_row' }
            	]
        	}
        }
    ],
    
    defaultConfig: {
        wakeWords: 'Einstein',
        voiceName: 'Alex',
        wakeTimeout: 10,
        speakOutput: true,
        hotKeys: {},
        useHotKeys: false,
        selectedCommanderChannel: {}
    },
    
    getVoiceConfig: function(component) {
        var self = this;
        var configName = component.get('v.configName');
        var action = component.get("c.getVoiceConfig");        
        action.setParams({name: configName});
        action.setCallback(this, function(response) {
            //console.warn('getVoiceConfig response: ', response);
            var state = response.getState();
            //console.warn('state: ', state);
            if (state === "SUCCESS") {
                var config = response.getReturnValue();
                config = JSON.parse(config);
                //console.warn('getVoiceConfig ---------------------------------------------------------> config: ', config);
                
                if (config === null || typeof config === 'undefined') {
                    config = self.defaultConfig;
                } else {
					// Patch config to include values not stored
                    for (var key in self.defaultConfig) {
                        if (typeof config[key] === 'undefined') {
                            config[key] = self.defaultConfig[key];
                        }
                    }
                }
                
                component.set('v.configName', configName);
                component.set('v.config', config);
                
                self.applyVoiceConfig(component);
                
            } else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var err = response.getError();
                console.error('error: ', err);
            }            
        });
        $A.enqueueAction(action)        
    },

    updateVoiceConfig: function(component) {
        var self = this;
        var configName = component.get('v.configName');
		var config = component.get('v.config');
        //console.warn('updateVoiceConfig - config: ', config);
        if (config === null || typeof config === 'undefined') {
            config = self.defaultConfig;
        }

        for (var key in config) {
            config[key] = component.get('v.' + key);
        }

        //console.warn('setting config: ', config);
        component.set('v.config', config);
        
        self.applyVoiceConfig(component);
        component.set('v.dirty', true);
    },
    
    saveVoiceConfig: function(component) {
        var self = this;
        var configName = component.get('v.configName');
		var config = component.get('v.config');
        console.warn('saveVoiceConfig - config: ', config);
        if (config === null || typeof config === 'undefined') {
            config = self.defaultConfig;
        }

        for (var key in config) {
            config[key] = component.get('v.' + key);
        }

        console.warn('save config: ', config);        
        
        var action = component.get("c.updateVoiceConfig");
        var json = JSON.stringify(config);
        //console.warn('config json: ', json);
        console.warn('configName: ', configName);
        action.setParams({name: configName, config: json});
        action.setCallback(this, function(response) {
            //console.warn('updateVoiceConfig response: ', response);
            var state = response.getState();
            console.warn('state: ', state);
            if (state === "SUCCESS") {
                var config = response.getReturnValue();
                //console.warn('updateVoiceConfig returned: ', config);
                component.set('v.config', JSON.parse(config));
                component.set('v.dirty', false);
                self.notifyVoiceConfig(component);                
            } else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var err = response.getError();
                console.error('error: ', err);
            }            
        });
        $A.enqueueAction(action)        
		        
    },

    applyVoiceConfig: function(component) {
        //console.warn('-------------------------------------------------- applyVoiceConfig');
        var self = this;
        var config = component.get('v.config');
        var configName = component.get('v.configName');
        //console.warn('configName: ', configName);
        console.warn('config: ', config);
        var value = null;
        for (var key in config) {
            value = config[key];
            value = JSON.parse(JSON.stringify(value));
            console.warn('key: ', key, ', value: ', value);
            component.set('v.' + key, value);
        }
        
        self.notifyVoiceConfig(component);                
    },
    
    notifyVoiceConfig: function(component) {
        var self = this;
        var config = component.get('v.config');
        var configName = component.get('v.configName');
        var params = {
            name: configName,
            config: config
        };
        //console.warn('params: ', params);
        var evt = $A.get('e.c:voiceConfigUpdate');
        evt.setParams(params);
        evt.fire();        
    },
    
    getVoices: function(component, callback) {
		var voiceProxy = component.find('voiceSettingsProxy');
        //console.warn('voiceProxy: ', voiceProxy);
        //console.warn('voiceProxy.ready: ', voiceProxy.get('v.ready'));        
        var self = this;
        if (voiceProxy.get('v.ready') !== true) {
            setTimeout(function() {
                self.getVoices(component, callback);
            }, 50);            
        } else {
            var uid = 'Einstein_Assistant_Settings_Get_Voices';
            voiceProxy.getVoices(uid, function(voices) {
                //console.warn('getVoices returned: ', voices);
                //console.warn('callback: ', callback, typeof callback);
                if (typeof callback === 'function') {
                    callback(voices);
                }
            });                    
        }
    }    
})