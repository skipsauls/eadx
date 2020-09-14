({
	scriptsLoaded: function(component, event, helper) {
       // console.warn('levenshtein: ', levenshtein);
        console.warn('window.levenshtein: ', window.levenshtein);
	},
    
    handleCommanderOutput: function(cmp, event, helper){
        console.warn('handleCommanderOutput: ', event);
        var text = event.getParam('text');
        var speech = event.getParam('speech');

        console.warn('text: ', text);
        console.warn('speech: ', speech);
    },
    
    test: function(component, event, helper) {
        let evt = $A.get('e.c:CommanderOutputEvent');
        console.warn('evt: ', evt);
        evt.setParams({
            text: 'This is the text',
            speech: 'This is the speech'
        });
        evt.fire();
        console.warn('after event fired');        
    },
    
	levenshtein: function(component, event, helper) {
        component.set('v.match', -1);
		let stringA = component.get('v.stringA');
		let stringB = component.get('v.stringB');
		let stringC = component.get('v.stringC');
		let stringD = component.get('v.stringD');
        let set = [stringB, stringC, stringD];
        let minDistance = 1000000;
        let distance = -1;
        let minIndex = 0;
        set.forEach(function(m, i) {
            distance = window.levenshtein(stringA, m);
            if (distance < minDistance) {
                minDistance = distance;
                minIndex = i;
            }
        });
        let match = set[minIndex];
        component.set('v.match', minIndex);
        console.warn('levenshtein: ', match);
	},

	compareTwoStrings: function(component, event, helper) {
		let stringA = component.get('v.stringA');
		let stringB = component.get('v.stringB');
        console.warn('compareTwoStrings: ', stringA, stringB);
        let result = window.stringSimilarity.compareTwoStrings(stringA, stringB);
        console.warn('result: ', result);
	},

	findBestMatch: function(component, event, helper) {
        component.set('v.match', -1);
		let stringA = component.get('v.stringA');
		let stringB = component.get('v.stringB');
		let stringC = component.get('v.stringC');
		let stringD = component.get('v.stringD');
        let set = [stringB, stringC, stringD];        
        console.warn('findBestMatch: ', stringA, stringB, stringC, stringD);
        let result = window.stringSimilarity.findBestMatch(stringA, set);
        console.warn('result: ', result);
        component.set('v.match', result.bestMatchIndex);
	},

	fuzzySet: function(component, event, helper) {
        component.set('v.match', -1);
		let stringA = component.get('v.stringA');
		let stringB = component.get('v.stringB');
		let stringC = component.get('v.stringC');
		let stringD = component.get('v.stringD');
        let set = [stringB, stringC, stringD];
        console.warn('fuzzySet: ', stringA, stringB, stringC, stringD);
        let fuzzySet = window.FuzzySet(set);
        let result = fuzzySet.get(stringA);
        console.warn('result: ', result);
        let match = result[0][1];
        console.warn('match: ', match);
        let matchIndex = -1;
        set.forEach(function(m, i) {
            if (match === m) {
                matchIndex = i;
            }
        });
        console.warn('matchIndex: ', matchIndex);
        component.set('v.match', matchIndex);
	},
    
})