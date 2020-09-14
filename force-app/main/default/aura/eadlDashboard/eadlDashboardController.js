({
	init: function(component, event, helper) {
		let namespace = component.getType().split(':')[0];
        console.warn('namespace: ', namespace);
        let developerName = component.get('v.developerName');
        console.warn('developerName: ' + developerName);
        /*
        if (namespace && namespace !== 'c') {
            developerName = namespace + '__' + developerName;
            console.warn('developerName: ' + developerName);
            component.set('v.developerName', developerName);
        }
        */
	}
})