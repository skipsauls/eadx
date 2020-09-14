({
    handleLookupAccountIdByUsername: function (component, event, helper) {
        helper.handleLookupAccountIdByUsername(component, event);
    },
    
    handleGetGlobalPlayerStats: function (component, event, helper) {
        //helper.handleGetGlobalPlayerStats(component, event);
        helper.callAPI(component, event, 'getGlobalPlayerStats');
    },
    
    handleGetRecentMatches: function (component, event, helper) {
        helper.handleGetRecentMatches(component, event);
    },
    
    handleListGameModes: function (component, event, helper) {
        helper.callAPI(component, event, 'listGameModes');
    },
    
    handleListSeasons: function (component, event, helper) {
        helper.callAPI(component, event, 'listSeasons');
    },
    
})