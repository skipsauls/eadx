({
	interpret: function(component, text, callback) {
        let self = this;
        let proxy = component.find('proxy');
        
        let url = '/services/data/v46.0/einstein-conduit/actions/?q=' + text;
        // filterGroup=Supplemental&limit=1&
        
        let state = component.get('v.state');
        if (state) {
         	url += '&state=' + state;   
        }
        
        let config = {
        };
        
        let body = JSON.stringify(config);
        console.warn('calling GET on url: ', url, ' with body: ', body);
        
        proxy.exec(url, 'GET', body, function(response) {
            console.warn('get actions response: ', JSON.parse(JSON.stringify(response)));
            let actions = response.body;
            let actionsJSON = JSON.stringify(actions, null, 2);
            component.set('v.actionsJSON', actionsJSON);
            if (typeof callback === 'function') {
                callback(null, actions);
            }
        });          		
	},
    
	invoke: function(component, action, callback) {
        let self = this;
        let proxy = component.find('proxy');

        let state = component.get('v.state') || null;
        
        let channel = component.get('v.channel') || null;
       
        let payload = action.request.payload.replace(/\&quot\;/g, '"');
        console.warn('payload: ', payload);
        let payloadJSON = JSON.stringify(JSON.parse(payload), null, 2);
        component.set('v.payloadJSON', payloadJSON);
        let postData = {
            payload: payload,
            destination: {
                channel: channel ? { id: channel.id } : null,
                includeResponse: true
            },            
            token: action.request.token,
            state: state
        };
        console.warn('postData: ', postData);

        let host = '';
        
        let url = host + action.request.uri;
        
        let body = JSON.stringify(postData);
        console.warn('calling POST on url: ', url, ' with body: ', body);
        
        proxy.exec(url, 'POST', body, function(response) {
            console.warn('post response: ', JSON.parse(JSON.stringify(response)));
            let results = JSON.parse(response.body);
            let resultsJSON = JSON.stringify(results, null, 2);
            component.set('v.resultsJSON', resultsJSON);
            let items = results.response.items || results.response.channels;
            component.set('v.responseItems', items);
            if (items.length > 0) {
	            let itemJSON = JSON.stringify(items[0], null, 2);
                component.set('v.selectedItemJSON', itemJSON);
                component.set('v.state', items[0].state);
            } else if (results.response.state) {
                component.set('v.state', results.response.state);
            }

            if (results.response.channels && results.response.channels.length > 0) {
                component.set('v.channel', results.response.channels[0]);
            }
            
            if (typeof callback === 'function') {
                callback(null, results);
            }
        });          		
	}
    
})