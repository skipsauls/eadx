({
    starts: [
        {
            name: 'blank',
            label: 'Blank App',
            imageURL: '/analytics/wave/web/proto/images/template/icons/new-blank.svg',
            description: 'Create your own.',
            buttonLabel: 'Create'
        },
        {
            name: 'template',
            label: 'Start from Template',
            imageURL: '/analytics/wave/web/proto/images/template/icons/new-templates.svg',
            description: 'Choose a template to jumpstart your project.',
            buttonLabel: 'Create'
        }
	],
    
	setup: function(component) {
        component.set('v.starts', this.starts);
	}
})