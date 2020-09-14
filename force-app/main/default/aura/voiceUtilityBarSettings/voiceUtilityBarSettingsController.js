({
    doInit: function(component, event, helper) {
        console.warn('voiceUtilityBarSettingsController.doInit');
        /*
        helper.getVoices(component, function(voices) {
            console.warn('voices: ', voices);
            component.set('v.voices', voices);            
            helper.getVoiceConfig(component);            
        });
		*/
        
        //console.warn('v.hotKeys: ', helper.hotKeys, typeof helper.hotKeys);
        
        component.set('v.hotKeyColumns', helper.hotKeyColumns);
        //component.set('v.hotKeys', helper.hotKeys);
        
        //helper.getVoiceConfig(component);            
        
    },
    
    updateSettings: function(component, event, helper) {
        //helper.updateVoiceConfig(component);
        component.set('v.dirty', true);
    },
    
    saveSettings: function(component, event, helper) {
        helper.saveVoiceConfig(component);            
    },
    
	toggleUseHotKeys: function(component, event, helper) {
        var val = component.get('v.useHotKeys');
        val = !val;
        component.set('v.useHotKeys', val);
    },
    
    toggleSpeakOutput: function(component, event, helper) {
        var val = component.get('v.speakOutput');
        val = !val;
        component.set('v.speakOutput', val);
    },

	handleNew: function(component, event, helper) {
        console.warn('handleNew: ', event);
        
        var hotKeys = component.get('v.hotKeys');
        var maxId = -1;
        var id = null;
        var val = 0;
        hotKeys.forEach(function(hotKey) {
            id = hotKey.id ? hotKey.id.replace('HK-', '') : '0000000000';
            console.warn('id: ', id);
            val = parseInt(id);
            console.warn('val: ', val);
            if (val >= maxId) {
                maxId = val;
                console.warn('maxId: ', maxId);

            }
        });
        if (maxId >= 0) {
            maxId++;
        }
        console.warn('maxId: ', maxId);
        var hotKey = {
            id: 'HK-' + maxId.toLocaleString('en', {minimumIntegerDigits:10,minimumFractionDigits:0,useGrouping:false}),
            key: '',
            command: ''
        };
        console.warn('hotKey: ', hotKey);
        
        hotKeys.push(hotKey);
        component.set('v.hotKeys', hotKeys);
        
        //helper.saveVoiceConfig(component);
        //
        var datatable = component.find('hotkey-table');
        
        datatable.set('v.draftValues', [hotKey]);
        
    },  

    handleRowAction: function(component, event, helper) {
        console.warn('handleRowAction: ', event);
        
        var action = event.getParam('action');
        console.warn('action: ', action);
        var row = event.getParam('row');
        console.warn('row: ', row);
        
        var hotKeys = component.get('v.hotKeys');

        switch (action.name) {
            case 'delete_row':
                hotKeys.forEach(function(hotKey, idx) {
                    console.warn(hotKey, idx);
                    if (hotKey.id === row.id) {
                        console.warn('deleting hotKey at: ', idx);
                        hotKeys.splice(idx, 1);
                    }
                });
                console.warn('setting hotKeys: ', hotKeys);
                component.set('v.hotKeys', hotKeys);
                
                console.warn('setting draftValues to null');
                //var datatable = component.find('hotkey-table');
                //datatable.set('v.draftValues', null);

                //console.warn('calling saveVoiceConfig');
                //helper.saveVoiceConfig(component);

                component.set('v.dirty', true);
                
                break;
                
            default:
                console.warn('action.name not handled: ', action.name);
        }    
    },
    
    handleRowSelection: function(component, event, helper) {
        console.warn('handleRowSelection: ', event);
        
        var selectedRows = event.getParam('selectedRows');
        for (var i = 0; i < selectedRows.length; i++){
			console.warn(selectedRows[i].key, selectedRows[i].command);
        }        
    },

    handleSave: function(component, event, helper) {
        console.warn('handleSave: ', event, event.getParams());
        
        var draftValues = event.getParam('draftValues');
        console.warn('draftValues: ', draftValues);
        
        var hotKeys = component.get('v.hotKeys');
        console.warn('hotKeys: ', hotKeys);

        var match = false;
        draftValues.forEach(function(draftValue) {
            console.warn('draftValue: ', draftValue);
            match = false;
            hotKeys.forEach(function(hotKey) {
                if (hotKey.id === draftValue.id) {
                    match = true;
                    for (var key in draftValue) {
                        hotKey[key] = draftValue[key];
                    }
                } 
            });
            if (match === false) {
              	hotKeys.push(draftValue);
            }
        });
        
        console.warn('hotKeys: ', hotKeys);
        
        // Setting value will trigger save
        component.set('v.hotKeys', hotKeys);
        
        helper.saveVoiceConfig(component);
        var datatable = component.find('hotkey-table');
        datatable.set('v.draftValues', null);
    },
    
    handleCancel: function(component, event, helper) {
        console.warn('handleCancel: ', event, event.getParams());
        
        var draftValues = event.getParam('draftValues');
        console.warn('draftValues: ', draftValues);
        
        var hotKeys = component.get('v.hotKeys');
        console.warn('hotKeys: ', hotKeys);
        
        component.get('v.hotKeys', hotKeys);
    },

    handleCellChange: function(component, event, helper) {
        console.warn('handleCellChange: ', event, event.getParams());
        
        var draftValues = event.getParam('draftValues');
        console.warn('draftValues: ', draftValues);
        
        var hotKeys = component.get('v.hotKeys');
        console.warn('hotKeys: ', hotKeys);
    }
    
})