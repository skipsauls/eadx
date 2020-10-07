({
    createPlayerItem: function(component, player) {
        var platformItems = [];
        player.platforms.forEach(function(platform) {
            platformItems.push({
                label: platform,
                name: player.username + '::platform::' + platform
            });
        });        
        var item = {
            label: player.username,
            name: player.username + '::username',
            expanded: false,
            disabled: false,
            items: [
                {
                    label: 'username: ' + player.username,
                    name: player.username + '::username',                                
                },
                {
                    label: 'uid: ' + player.uid,
                    name: player.username + '::uid', 
                },
                {
                    label: 'platforms',
                    name: player.username + '::platforms',
                    items: platformItems,
                    expanded: false
                }
            ]
        };
        
        return item;
    },
    
    refreshPlayers: function(component) {
        var self = this;
        var fortnite = component.find('fortnite');
        fortnite.getPlayers(function(err, players) {
            if (err) {
                console.warn('fortnite.getPlayers error: ', err);
                component.find('notifications').showToast({
                    title: "Fortnite Error",
                    message: err.errorMessage,
                    variant: 'error'
                });                
            } else {
                console.warn('players: ', players);
                var playerInfoMap = component.get('v.playerInfoMap') || {};
                var items = [];
                var item = {};
                players.forEach(function(player) {
                    playerInfoMap[player.username] = player;;
                    item = self.createPlayerItem(component, player);
                    
                    items.push(item);
                    
                });
                items = items.sort(function(a, b) {
                    if (a.label <= b.label) {
                        return -1;
                    } else if (a.label > b.label) {
                        return 1;
                    }
                    return 0;
                });                
                component.set('v.items', items); 
                component.set('v.playerInfoMap', playerInfoMap);
            }
        });
        
    },
    
    getPlayerInfo: function(component, username) {
        var self = this;
        var fortnite = component.find('fortnite');
        var refresh = false;
        fortnite.getPlayerInfo2(username, refresh, function(err, playerInfo) {
            console.warn('getPlayerInfo2 returned: ', err, playerInfo);
            if (err) {
                console.warn('fortnite.getPlayerInfo2 error: ', err);
                component.find('notifications').showToast({
                    title: "Fortnite Error",
                    message: err.errorMessage + ': ' + username,
                    variant: 'error'
                }); 
            } else {
                // Add the user to the map and items
                var playerInfoMap = component.get('v.playerInfoMap') || {};
                playerInfoMap[playerInfo.username] = playerInfo;
                component.set('v.playerInfoMap', playerInfoMap);
                
                var items = component.get('v.items') || [];
                var playerItem = self.createPlayerItem(component, playerInfo);
                items.push(playerItem);
                items = items.sort(function(a, b) {
                    if (a.label <= b.label) {
                        return -1;
                    } else if (a.label > b.label) {
                        return 1;
                    }
                    return 0;
                });              
                component.set('v.items',items);
                
                // Get the player data for each platform
                function getPlayerPlatformData(component, username, platforms, window) {
                    var platform = platforms.pop();
                    self.getPlayerData(component, playerInfo.username, platform, window, function(err, playerData) {
                        if (platforms.length > 0) {
                            getPlayerPlatformData(component, username, platforms, window);
                        }
                    });
                }

                getPlayerPlatformData(component, playerInfo.username, playerInfo.platforms, 'alltime');

            }
        });
    },
    
    getPlayerData: function(component, username, platform, window, callback) {
        var self = this;
        var fortnite = component.find('fortnite');
        var refresh = false;
        fortnite.getPlayerData2(username, platform, window, refresh, function(err, playerData) {
            if (err) {
                console.warn('fortnite.getPlayerData error: ', err);
                component.find('notifications').showToast({
                    title: "Fortnite Error",
                    message: err.errorMessage + ': ' + username,
                    variant: 'error'
                });                
            } else {
                console.warn('playerData: ', playerData);
                var playerDataMap = component.get('v.playerDataMap') || {};
                playerDataMap[playerData.username] = playerData;
                component.set('v.playerDataMap', playerDataMap);
            }
            if (typeof callback === 'function') {
                callback(err, playerData);
            }
        });
    },
    
    
    /* NEWEST */
    lookupAccountIdByUsername: function(component, username) {
        
        var self = this;
        var fortniteAPI = component.find('fortniteAPI');
        var refresh = false;
        fortniteAPI.lookupAccountIdByUsername(username, function(err, playerData) {
            console.warn('playerData: ', playerData); 
        });        
    },
    
    getGlobalPlayerStats: function(component, username, season, callback) {
        
        var self = this;
        var fortniteAPI = component.find('fortniteAPI');
        var refresh = false;
        fortniteAPI.getGlobalPlayerStats(username, season, function(err, stats) {
            console.warn('stats: ', stats);
            if (typeof callback === 'function') {
                callback(err, stats);
            }
        });        
    },
    
    refreshPlayers: function(component, callback) {
     	let table = component.find('table');
        table.refreshPlayers(function(err, res) {
            console.warn('refresh returned: ', err, res);
            if (typeof callback === 'function') {
                callback(err, res);
            }
        });
    },
    
    updateGlobalPlayerStats: function(component, usernames, season, callback) {
        var self = this;
        var fortniteAPI = component.find('fortniteAPI');
        let counter = 0;
        usernames.forEach(function(username) {
            counter++;
            console.warn('-> counter: ', counter);
            setTimeout($A.getCallback(function() {
	            fortniteAPI.getGlobalPlayerStats(username, season, function(err, stats) {
    	            console.warn('stats: ', stats); 
                   	counter--;
                    console.warn('<- counter: ', counter);
                    if (counter <= 0) {
                        if (typeof callback === 'function') {
                            callback(null, {});
                        }
                    }
        	    });                        
            }), 500);
        });
    },
    
    getRecentMatches: function(component, username) {
        
        var self = this;
        var fortniteAPI = component.find('fortniteAPI');
        var refresh = false;
        fortniteAPI.getRecentMatches(username, function(err, matches) {
            console.warn('matches: ', matches); 
        });        
    },
    
    listGameModes: function(component, lang) {
        
        var self = this;
        var fortniteAPI = component.find('fortniteAPI');
        var refresh = false;
        fortniteAPI.listGameModes(lang, function(err, modes) {
            console.warn('modes: ', modes); 
        });        
    },

    listSeasons: function(component, lang) {
        
        var self = this;
        var fortniteAPI = component.find('fortniteAPI');
        var refresh = false;
        fortniteAPI.listSeasons(lang, function(err, seasons) {
            console.warn('seasons: ', seasons); 
        });        
    },
    
    
    
    // OLD - REMOVE
    lookupPlayer: function(component) {
        var self = this;
        var fortnite = component.find('fortnite');
        var username = component.get('v.username');
        var platform = component.get('v.platform');
        var window = component.get('v.window');
        var refresh = false;
        fortnite.getPlayerInfo(username, refresh, function(err, playerInfo) {
            if (err) {
                console.warn('fortnite.getPlayerInfo error: ', err);
                component.find('notifications').showToast({
                    title: "Fortnite Error",
                    message: err.errorMessage + ': ' + username,
                    variant: 'error'
                });                
            } else {
                component.set('v.playerInfo', playerInfo);
                fortnite.getPlayerData(playerInfo.uid, platform, window, refresh, function(err, playerData) {
                    if (err) {
                        console.error('fortnite.getPlayerData error: ', err);
                    } else {
                        component.set('v.playerData', playerData);                
                    }
                });
                
            }
        });
    },
    
    lookupPlayer2: function(component) {
        var self = this;
        var fortnite = component.find('fortnite');
        var username = component.get('v.username');
        var platform = component.get('v.platform');
        var window = component.get('v.window');
        var refresh = true;
        fortnite.getPlayerInfo2(username, refresh, function(err, playerInfo) {
            console.warn('getPlayerInfo2 returned: ', err, playerInfo);
            if (err) {
                console.warn('fortnite.getPlayerInfo2 error: ', err);
                component.find('notifications').showToast({
                    title: "Fortnite Error",
                    message: err.errorMessage + ': ' + username,
                    variant: 'error'
                });                
            } else {
                //component.set('v.playerInfo', playerInfo);
                fortnite.getPlayerData2(username, platform, window, refresh, function(err, playerData) {
                    console.warn('getPlayerData2 returned: ', err, playerData);
                    if (err) {
                        console.error('fortnite.getPlayerData2 error: ', err);
                    } else {
                        //component.set('v.playerData', playerData);                
                    }
                });
                
            }
        });
    }
    
    
})