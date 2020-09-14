({
    handleAnalysisIdChange: function(component, event, helper) {
        console.warn('handleAnalysisIdChange');
        let analysisId = component.get('v.analysisId');
        if (analysisId !== null && typeof analysisId !== 'undefined') {
            helper.getAnalysisDetails(component, function(err, details) {
                console.warn('getAnalysisDetails returned: ', JSON.parse(JSON.stringify(details)));
                component.set('v.analysisDetails', details);
    
                helper.getInputProfile(component, function(err, inputProfile) {
                    console.warn('getInputProfile returned: ', JSON.parse(JSON.stringify(inputProfile)));
                    component.set('v.inputProfile', inputProfile);
    
    
                    helper.generateStory(component, function(err, story) {
                        console.warn('generateStory returned: ', JSON.parse(JSON.stringify(story)));
                        component.set('v.story', story);
                        helper.createStoryTree(component);
                    });
                });
            });
        }
    },

    handleAnalysisChange: function(component, event, helper) {
        console.warn('handleAnalysisChange');
    },
    
    handleAnalysisDetailsChange: function(component, event, helper) {
        console.warn('handleAnalysisDetailsChange');
        return;
        
        helper.getInputProfile(component, function(err, inputProfile) {
            console.warn('getInputProfile returned: ', JSON.parse(JSON.stringify(inputProfile)));
            component.set('v.inputProfile', inputProfile);
        });
    },
    
    handleInputProfileChange: function(component, event, helper) {
        console.warn('handleInputProfileChange');        
        helper.generateStory(component, function(err, story) {
            console.warn('generateStory returned: ', story);
            console.warn('generateStory returned: ', JSON.parse(JSON.stringify(story)));
            component.set('v.story', story);
            helper.createStoryTree(component);
        });
    },
    
    handleTreeItemSelect: function(component, event, helper) {
        var name = event.getParam('name');
        console.warn('selected: ', name);
        
        var itemMap = component.get('v.itemMap');
        console.warn('itemMap: ', itemMap);
        
        var item = itemMap[name];
        
        console.warn('item: ', item);
        
        console.warn('item.name: ', item.name);
        console.warn('item.label: ', item.label);
        console.warn('item.type: ', item.type);
        console.warn('item.value: ', item.value);
        
        if (item.type === 'insight') {
            component.set('v.insight', item.value);
        }
    }
    
})