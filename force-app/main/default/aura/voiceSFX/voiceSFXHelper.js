({
	setup: function(component) {
        var self = this;
		var resourceName = component.get('v.resourceName');
		var soundResources = component.get('v.soundResources');
        var resources = {};
        soundResources.forEach(function(info) {
           	resources[info.fileName] = $A.get('$Resource.' + resourceName) + '/' + info.fileName;
        });
        
        var voiceProxy = component.find('voiceSFXProxy');
        var uid = 'Einstein_Assistant_Load_Sounds';
        voiceProxy.loadSounds(resources, uid, function() {
            //console.warn('voiceProxy.loadSounds returned: ', arguments); 
        });
	}
})