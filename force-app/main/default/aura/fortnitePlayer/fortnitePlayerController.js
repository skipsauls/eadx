({
    doInit: function(component, event, helper) {
        helper.refreshPlayers(component);
    },
    
    handleLookupPlayer: function(component, event, helper) {
        helper.lookupPlayer(component);                               
    },
    
    
    // Newer below    
    handleLookupKeyUp: function (component, event, helper) {
        var isEnterKey = event.keyCode === 13;
        if (isEnterKey) {
            var username = component.find('username-search').get('v.value');
            console.warn('username: ', username);
            
            //helper.getPlayerInfo(component, username);

            //helper.lookupAccountIdByUsername(component, username);
            

            //helper.listGameModes(component, null);
            
            //helper.listSeasons(component, null);
            
            let season = '13';

            helper.getGlobalPlayerStats(component, username, season);

            
            //helper.getRecentMatches(component, username);

            // Clears the search, commented out for testing
            //component.find('username-search').set('v.value', null);
            //
        }
    },
    
    handleLookupPlayer2: function(component, event, helper) {
        helper.lookupPlayer2(component);                               
    },
    
    handleSelectItem: function(component, event, helper) {
        var name = event.getParam('name');
        console.warn('handleSelectItem: ', name);
        
        // The name should follow the username::type::value pattern, where value may be null
        // Types include username, uid, platforms, platform, etc.
        
        var tokens = name.split('::');
        
        var username = tokens[0];
        var type = tokens[1];
        var value = tokens[2];
        
        console.warn('username: ', username, ', type: ', type, ', value: ', value);
        
        if (type === 'platform' && value !== null) {
            helper.getPlayerData(component, username, value, 'alltime');
        }
    }, 
    
    
    handleSelectionChanged: function (component, event, helper) {
        //console.warn('fornitePlayerController.handleSelectionChanged: ', event.getParams(), JSON.stringify(event.getParams(), null, 2));
        
    }    
    
})