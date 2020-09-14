({
	doInit: function(component, event, helper) {
		
	},

    onRender: function(component, event, helper) {
        //helper.setupVisualizer(component);
        helper.handleResize(component);
    },
    
    showVisualizationChange: function(component, event, helper) {
        var showVisualization = component.get('v.showVisualization');
        if (showVisualization === true) {
            helper.startVisualization(component);
        } else {
            helper.stopVisualization(component);            
        }
    },
    
    voiceAnalysisProxyReady: function(component, event, helper) {
        console.warn('voiceVisualizerController.voiceAnalysisProxyReady');
    },
    
    toggleAwake: function(component, event, helper) {
        helper.toggleAwake(component);
    }
    
})