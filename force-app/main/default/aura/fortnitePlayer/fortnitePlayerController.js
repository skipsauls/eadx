({
    doInit: function(component, event, helper) {
       
    },
    
    handleLookupPlayer: function(component, event, helper) {
        helper.lookupPlayer(component);                               
    },
    
    
    // Newer below    
    handleLookupKeyUp: function (component, event, helper) {
        let isEnterKey = event.keyCode === 13;
        if (isEnterKey) {
            var username = component.find('username-search').get('v.value');
            console.warn('username: ', username);
            
            let season = '14';

            helper.getGlobalPlayerStats(component, username, season, function(err, stats) {

                console.warn('getGlobalPlayerStats returned: ', err, stats);
                
                helper.refreshPlayers(component, function(err, res) {
                    console.warn('refresh returned: ', err, res); 
                });                
                
            });
        }
    },
    
    handleUpsertPlayer: function(component, event, helper) {
        let username = component.get('v.username');
        console.warn('username: ', username);
        
        let season = '14';
        helper.getGlobalPlayerStats(component, username, season);                         
    },
 
    handleUpdatePlayers: function(component, event, helper) {
     	let table = component.find('table');
        let selectedRows = table.get('v.selectedRows');
        let usernames = [];
        console.warn('selectedRows: ', selectedRows);
        selectedRows.forEach(function(row) {
            console.warn('row:', row);
            usernames.push(row.eadx__username__c);
        });
        
        let season = '14';
        
        helper.updateGlobalPlayerStats(component, usernames, season, function(err, res) {
            console.warn('updateGlobalPlayerStats returned: ', err, res);
	        helper.refreshPlayers(component, function(err, res) {
    	        console.warn('refreshPlayers returned: ', err, res); 
        	});            
        });
    },

    handleRefreshPlayers: function(component, event, helper) {
        helper.refreshPlayers(component, function(err, res) {
            console.warn('refreshPlayers returned: ', err, res); 
        });
    },
    
    handleLookupPlayer2: function(component, event, helper) {
        helper.lookupPlayer2(component);                               
    },
    
    handleSelectItem: function(component, event, helper) {
        let name = event.getParam('name');
        console.warn('handleSelectItem: ', name);
        
        // The name should follow the username::type::value pattern, where value may be null
        // Types include username, uid, platforms, platform, etc.
        
        let tokens = name.split('::');        
        let username = tokens[0];
        let type = tokens[1];
        let value = tokens[2];
        
        console.warn('username: ', username, ', type: ', type, ', value: ', value);
        
        if (type === 'platform' && value !== null) {
            helper.getPlayerData(component, username, value, 'alltime');
        }
    }, 
    
    
    handleSelectionChanged: function (component, event, helper) {
        //console.warn('fornitePlayerController.handleSelectionChanged: ', event.getParams(), JSON.stringify(event.getParams(), null, 2));
        
    },
    
    getRecentMatches: function(component, event, helper) {

        let username = component.find('username-search').get('v.value');
        console.warn('getRecentMatches: ', username);
        
        helper.getRecentMatches(component, username);
        
    }
    
})