({
    getVoices: function(component) {
		var voiceProxy = component.find('voiceProxy');
        var self = this;
        if (voiceProxy.get('v.ready') !== true) {
            setTimeout(function() {
                self.getVoices(component);
            }, 100);            
        } else {
            voiceProxy.getVoices(function(voices) {
                component.set('v.voices', voices);
            });                    
        }
    },

    speak: function(component) {
		var voiceProxy = component.find('voiceProxy');
        var self = this;
        
        if (voiceProxy.get('v.ready') !== true) {
            setTimeout(function() {
                self.speak(component);
            }, 100);            
        } else {
	        var outputText = component.get('v.outputText');
			var voiceName = component.get('v.voiceName');
			var volume = component.get('v.volume');
			var rate = component.get('v.rate');
			var pitch = component.get('v.pitch');
            console.warn('------------------------------------------------------ speak: ', outputText, voiceName, volume, rate, pitch);
            voiceProxy.speak(outputText, voiceName, volume, rate, pitch, function(response) {
                console.warn('speak returned: ', response);
            });                    
        }
    },
    
	startDictation: function(component) {
        var voiceProxy = component.find('voiceProxy');
        var continuous = component.get('v.continuous');
        var interimResults = component.get('v.interimResults');
        var maxAlternatives = component.get('v.maxAlternatives');
        var recurring = component.get('v.recurring');
        var self = this;
        voiceProxy.startDictation('en-US', continuous, interimResults, maxAlternatives, function(response) {
            //console.warn('voiceProxyTabHelper voiceProxyStartDictation response: ', response);
            //console.warn('response phase: ', response.phase);
            if (response.phase === 'onresult') {
                if (response.results) {
                    var results = JSON.parse(JSON.stringify(response.results));
                    //console.warn('startDictation - results: ', results);
                    
                    // Wake word testing
                    var wakeWords = component.get('v.wakeWords');
                    //console.warn('wakeWords: ', wakeWords);
                    
                    var transcript = null;
                    var confidence = null;
                    var index = -1;
                    results.forEach(function(result) {
                        //console.warn('result: ', result);
                        result.forEach(function(alternative) {
                            //console.warn('alternative: ', alternative);
                            
                            transcript = alternative.transcript;
                            confidence = alternative.confidence;
    
                            //console.warn('transcript: ', transcript);
                            //console.warn('confidence: ', confidence);
                            
                            var index = transcript.toLowerCase().indexOf(wakeWords.toLowerCase());
                            if (index === 0) {
                                //console.warn('transcript contains wake words: ', transcript);
                                var substring = transcript.substring(wakeWords.length);
                                substring = substring.trim();
                                //console.warn('substring: ', substring);
                            }
                            console.warn('after');
                        });
                    });
                    
                    
                    // Standard behavior takes the first result
                    var result = response.results[0][0];
                    //console.warn('startDictation - result: ', result);
                    if (result.transcript) {
                        var results = component.get('v.results');
                        results.reverse();
                        results.push(result);
                        results.reverse();
                        component.set('v.results', results);
                    }
                }
                if (recurring === true) {
                    self.startDictation(component);
                }
            } else if (response.error) {
                console.error('voiceProxyTabHelper voiceProxyStartDictation error: ', response.error);
                if (recurring === true) {
                    self.startDictation(component);
                }
            } else if (response.message) {
                console.warn('voiceProxyTabHelper voiceProxyStartDictation message: ', response.message);
            }
        });
	},
    
	stopDictation: function(component) {
        var voiceProxy = component.find('voiceProxy');
        var self = this;
        voiceProxy.stopDictation(function(result) {
            results = JSON.parse(JSON.stringify(result));
            console.warn('stopDictation - result: ', result);
        });
	},
    
    handleResultsChange: function(component) {
        var results = component.get('v.results');
        var transcript = results[0].transcript;
        console.warn('transcript: ', transcript);
        var self = this;
        var postCommand = 'post to chatter';
        var lctext = transcript.toLowerCase();
        if (lctext.indexOf(postCommand) === 0) {
			var text = transcript.substring(postCommand.length);
            text = text.trim();
            console.warn('text: ', text);
	        self.postToChatter(component, text);
        }
    },
    
    postToChatter: function(component, text) {
        
        var action = component.get("c.test");
        var self = this;
        var communityId = null; //component.get('v.communityId');
        var subjectId = 'me'; //component.get('v.subjectId');
        //var text = component.get('v.text');
        
        action.setParams({communityId: communityId, subjectId: subjectId, text: text});
        action.setCallback(this, function(response) {
            console.warn('response: ', response);
            var state = response.getState();
            console.warn('state: ', state);
            if (state === "SUCCESS") {
                var val = response.getReturnValue();
                console.warn('val: ', val);

				// Need a selective update event or component method!                
                $A.get("e.force:refreshView").fire();

				/*                
                var feed = component.find('feed');
                feed.set('v.type', 'UserProfile');
                feed.set('v.type', 'News');
                */
                
            } else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var err = response.getError();
                console.error('error: ', err);
            }            
        });
        $A.enqueueAction(action);	        
        
    }
    
})