({
    handleAnalysisIdChange: function(component, event, helper) {
        //console.warn('handleAnalysisIdChange');
        let analysisId = component.get('v.analysisId');
        if (analysisId !== null && typeof analysisId !== 'undefined') {
            helper.getAnalysis(component, function(err, analysis) {
                //console.warn('getAnalysis returned: ', JSON.parse(JSON.stringify(analysis)));
                component.set('v.analysis', analysis);
                
                helper.getAnalysisDetails(component, function(err, details) {
                    //console.warn('getAnalysisDetails returned: ', JSON.parse(JSON.stringify(details)));
                    component.set('v.analysisDetails', details);
                    
                    helper.getInputProfile(component, function(err, inputProfile) {
                        //console.warn('getInputProfile returned: ', JSON.parse(JSON.stringify(inputProfile)));
                        component.set('v.inputProfile', inputProfile);
                        
                        
                        helper.generateStory(component, function(err, story) {
                            //console.warn('generateStory returned: ', JSON.parse(JSON.stringify(story)));
                            component.set('v.story', story);
                            //helper.createStoryTree(component);
                            let insights = story.Body.insights;
                            component.set('v.insights', insights);
                            let index = component.get('v.index');
                            let insight = insights[index];
                            component.set('v.insight', insight);
                        });
                    });
                });
            });
        }
    },
    
    handleIndexChange: function(component, event, helper) {
        try {
            let story = component.get('v.story');
            let insights = component.get('v.insights');
            let index = component.get('v.index');
            let insight = insights[index];
            component.set('v.insight', insight);
        } catch (e) {
            console.error('handleIndexChange exception: ', e);
        }
    }
    
})