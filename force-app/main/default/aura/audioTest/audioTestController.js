({
	scriptsLoaded: function(component, event, helper) {
		console.warn('scriptsLoaded');
        var synth = new AudioSynth;
        component.set('v.synth', synth);

	},
    
    test: function(component, event, helper) {
        
    },
    
    playSound: function(component, event, helper) {
        console.warn('playSound: ', JSON.stringify(event.getSource().get('v.name'), null, 2));
        try {
            var name = event.getSource().get('v.name');
            var tokens = name.split('_');
            
            var instrument = tokens[0];
            var note = tokens[1];
            var octave = tokens[2];        
            var duration = component.get('v.duration');
            
            helper.playSound(component, instrument, note, octave, duration);            
        } catch (e) {
            
        }
	},
    
    handleSelectionChanged: function (component, event, helper) {
        console.warn('handleSelectionChanged: ', event.getParams(), JSON.stringify(event.getParams(), null, 2));
        
        var params = event.getParams();
        var id = params.id;
        //component.set("v.dashboardId", id);
        var payload = params.payload;
        //console.warn("payload: ", payload);
        var row = null;        
        if (payload) {                
            var step = payload.step;
            //console.warn("step: ", step);
            var data = payload.data;
            //console.warn("data: ", data);
            var idx = 0;
            data.forEach(function(obj) {
                for (var k in obj) {
                    //console.warn(k + ': ' + obj[k]);
                    if (k === 'statecode') {
                        try {
                            var sound = helper.soundMap[obj[k]];
                            helper.playSound(component, sound.instrument, sound.note, sound.octave, sound.duration);
                        } catch (e) {
                            
                        }
                    }
                }
            });
        }
    }
})