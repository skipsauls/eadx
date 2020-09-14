({
	handleSelectTab: function(component, event, helper) {
        let id = event.getParam('id');
        if (id === 'channels') {
            let viewer = component.find('commander-channel-viewer');
            viewer.refresh();
        } else if (id === 'actions') {
            let viewer = component.find('commander-action-viewer');
            viewer.refresh();            
        }
	}
})