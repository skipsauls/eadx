({
    testLog: [
        {user: 'left', text: 'This is a test'},
        {user: 'right', text: 'How now brown cow.'},
        {user: 'left', text: 'Now is the time for all good men to come to the aid of their country.'},
        {user: 'left', text: 'The quick brown fox jumped over the lazy red dog.'},
        {user: 'right', text: 'Every good boy has his day.'},
        {user: 'left', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'}
    ],
        
	init: function(component) {
		//component.set('v.logentries', this.testLog);
		component.set('v.logentries', []);
	},
    
	log: function(component, entry) {
        //console.warn('log - entry: ', entry);
		let entries = component.get('v.logentries');
        entries.push(entry);
		component.set('v.logentries', entries);
        
        setTimeout($A.getCallback(function() {
            //console.warn('-----------------------> in setTimeout');
            let log = component.find('log');
            let logEl = log.getElement();         
            logEl.scrollTop = logEl.scrollHeight - logEl.clientHeight;
        }), entry.delay);
	},
    
    scrollIntoView: function(component) {
        
    },
    
	clear: function(component, entry) {
		let entries = component.get('v.logentries');
        entries = [];
		component.set('v.logentries', entries);
	}    
})