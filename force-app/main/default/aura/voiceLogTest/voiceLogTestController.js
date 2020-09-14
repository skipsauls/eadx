({
	submitSystem: function(component, event, helper) {
        let user = {
            type: 'system',
            name: 'Einstein',
            fallbackIconName: 'utility:einstein'
        };
		let text = component.get('v.systemText');
        let voiceLog = component.find('voiceLog');
        voiceLog.log(user, text, 0);
	},
    
	submitUser: function(component, event, helper) {
        let user = {
            type: 'user',
            name: 'Skip Sauls',
            initials: 'SS',
            avatarUrl: 'https://adx-dev-ed--c.gus.content.force.com/profilephoto/729B0000000Gv7A/T'
        };
		let text = component.get('v.userText');
        let voiceLog = component.find('voiceLog');
        voiceLog.log(user, text, 0);
	}
    
})