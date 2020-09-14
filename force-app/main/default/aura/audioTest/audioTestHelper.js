({
    setup: function(component) {
        console.warn('audioTestHelper.setup');
        var speechSynth = window.speechSynthesis;
        console.warn('speechSynth: ', typeof speechSynth);    
	},
    
    soundMap: {
        'CA': {instrument: 'piano', note: 'C', octave: 4, duration: 1},
        'TX': {instrument: 'piano', note: 'D', octave: 4, duration: 1},
        'NC': {instrument: 'piano', note: 'E', octave: 4, duration: 1},
        'FL': {instrument: 'piano', note: 'F', octave: 4, duration: 1},
        'GA': {instrument: 'organ', note: 'B', octave: 3, duration: 2},
        'NY': {instrument: 'organ', note: 'C', octave: 3, duration: 2},
        'IL': {instrument: 'organ', note: 'D', octave: 3, duration: 2},
        'TN': {instrument: 'piano', note: 'A', octave: 2, duration: 3},
        'CO': {instrument: 'piano', note: 'B', octave: 2, duration: 3},
        'KS': {instrument: 'piano', note: 'C', octave: 2, duration: 3},
        'MS': {instrument: 'acoustic', note: 'C', octave: 2, duration: 2},
        'MN': {instrument: 'acoustic', note: 'D', octave: 2, duration: 2},
        'WA': {instrument: 'acoustic', note: 'E', octave: 2, duration: 2},
        'MI': {instrument: 'acoustic', note: 'F', octave: 2, duration: 2},
        'OR': {instrument: 'acoustic', note: 'A', octave: 2, duration: 2}

        
    },
    
	playSound: function(component, instrument, note, octave, duration) {
        try {
            var synth = component.get('v.synth');
            var instrumentInstances = component.get('v.instrumentInstances') || {};
            var instrumentInstance = instrumentInstances[instrument] || synth.createInstrument(instrument);
            instrumentInstances[instrument] = instrumentInstance;
            component.set('v.instrumentInstances', instrumentInstances);
            instrumentInstance.play(note, octave, duration);
        } catch (e) {
            
        }
	}
})