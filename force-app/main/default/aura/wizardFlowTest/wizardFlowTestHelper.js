({
    starts: [
        {
            name: 'blank',
            label: 'Blank App',
            imageURL: '/analytics/wave/web/proto/images/template/wizardicons/default.png',
            description: 'Create and add datasets, lenses, or dashboards manually',
            buttonLabel: 'Create Blank App'
        },
        {
            name: 'template',
            label: 'Start from Template',
            imageURL: '/analytics/wave/web/proto/images/template/wizardicons/custom.png',
            description: 'Choose from a number of templates and content packs to kickstart your project',
            buttonLabel: 'Create App from Template'
        }
	],
    
	setup: function(component) {
        component.set('v.starts', this.starts);
	}
})