({
    
	handleProxyReady: function (component, event, helper) {
        console.warn('handleProxyReady');
    },
    
	handleLogin: function(component, event, helper) {
        //helper.authenticate(component, false);
        //return;
        
        let proxy = component.find('proxy');

		let methodName = 'authenticate';        
        let serverUrl = 'XXXXXXXX';
        let name = 'XXXXXXXX';
        let password = 'XXXXXXXX';
        let siteName = 'XXXXXXXX';
        let config = {};
        
        let url = '/services/apexrest/eadx/tableau?methodName=' + methodName;
        
        url += '&serverUrl=' + serverUrl;
        url += '&siteName=' + siteName;  
        url += '&name=' + name;
        url += '&password=' + password;  

        proxy.exec(url, 'GET', config, function(response) {
            console.warn(methodName + ' response: ', response);
            let val = JSON.parse(response.body);
            console.warn('val: ', val);
            component.set('v.tableauAuth', val);
        });
	},

	handleRefreshLogin: function(component, event, helper) {
        //helper.authenticate(component, true);
        //return;
        
        let proxy = component.find('proxy');

		let methodName = 'authenticate';        
        let serverUrl = 'XXXXXXXX';
        let name = 'XXXXXXXX';
        let password = 'XXXXXXXX';
        let siteName = 'XXXXXXXX';
        let config = {};
        
        let url = '/services/apexrest/eadx/tableau?methodName=' + methodName;
        
        url += '&serverUrl=' + serverUrl;
        url += '&siteName=' + siteName;  
        url += '&name=' + name;
        url += '&password=' + password;
        url += '&refesh=true';

        proxy.exec(url, 'GET', config, function(response) {
            console.warn(methodName + ' response: ', response);
            let val = JSON.parse(response.body);
            console.warn('val: ', val);
            component.set('v.tableauAuth', val);
        });
	},
    
	handleListViews: function(component, event, helper) {
        let proxy = component.find('proxy');

		let methodName = 'list_views';
        let serverUrl = 'XXXXXXXX';
        let name = 'XXXXXXXX';
        let siteName = 'XXXXXXXX';
        
        let url = '/services/apexrest/eadx/tableau?methodName=' + methodName;
        
        url += '&serverUrl=' + serverUrl;
        url += '&siteName=' + siteName;  
        url += '&name=' + name;
        let config = null;
        
        proxy.exec(url, 'GET', config, function(response) {
            console.warn(methodName + ' response: ', response);
            let val = JSON.parse(response.body);
            console.warn('val: ', val);
        });
    }
})