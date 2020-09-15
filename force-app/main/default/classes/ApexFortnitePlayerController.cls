@RestResource(urlMapping='/fortniteplayers/*') 
global with sharing class ApexFortnitePlayerController {

    // 24 hour default timeout
    private static Long cache_timeout = 86400000;
    
    private static String ForniteTrackerKey = '6a0ab664-15e1-4c2d-98c5-c5d7e69a2ea1';
    private static String FortniteApiKey = '50eb1016d2332fcd0a9bbca4ee36b51d';
    
	@AuraEnabled
    global static List<Object> OLD_REMOVE_getFortnitePlayers(List<String> usernameList) {
        List<String> cacheNames = new List<String>();
        if (usernameList != null) {
            for (String username: usernameList) {
                cacheNames.add(username + '%'); //_user_info');
            }            
        
            //System.debug('cacheNames: ' + cacheNames);
                
            List<Fortnite_API_Cache__c> playerInfoList = [SELECT Id, Name, Cache_Key__c, url__c, body__c, Type__c, LastModifiedDate FROM Fortnite_API_Cache__c WHERE Type__c = 'UserInfo' AND Cache_Key__c LIKE :cacheNames];
            
            Map<String, Object> playerInfo = null;
            cacheNames = new List<String>();
            for (Fortnite_API_Cache__c info: playerInfoList) {
                playerInfo = (Map<String, Object>) JSON.deserializeUntyped(info.body__c);
                cacheNames.add((String) playerInfo.get('uid') + '%');
            }
            
            //System.debug('cacheNames: ' + cacheNames);

        } else {
            cacheNames.add('%');
        }

        List<Fortnite_API_Cache__c> players = [SELECT Id, Name, Cache_Key__c, url__c, body__c, Type__c, LastModifiedDate FROM Fortnite_API_Cache__c WHERE Type__c = 'UserData' AND Cache_Key__c LIKE :cacheNames];
        
        List<Object> playerList = new List<Object>();
        
        for (Fortnite_API_Cache__c player: players) {
            //System.debug('player: ' + player);
            String body = (String) player.get('body__c');
            Map<String, Object> playerData = (Map<String, Object>) JSON.deserializeUntyped(body);
            //System.debug('playerData: ' + playerData);
            playerList.add(playerData);
        }
    
        return playerList;
    }

	@AuraEnabled
    global static List<Fortnite_Player_Data__c> getFortnitePlayers(List<String> usernameList, List<String> platformList, String window) {

        List<String> userNames = new List<String>();
        if (usernameList != null) {
            for (String username: usernameList) {
               	userNames.add(username + '%');
            }            
        
        } else {
            userNames.add('%');
        }

        List<String> platforms = new List<String>();
        if (platformList != null) {
            for (String platform: platformList) {
               	platforms.add(platform + '%');
            }            
        
        } else {
            platforms.add('%');
        }
        
        System.debug('platforms: ' + platforms);
        
        List<Fortnite_Player_Data__c> playerDataList= null;//[SELECT Id, Name, Fortnite_Player__r.uid__c, Fortnite_Player__r.username__c, platform__c, window__c, totals__c, stats__c, LastModifiedDate FROM Fortnite_Player_Data__c WHERE Fortnite_Player__r.username__c LIKE : userNames AND platform__c LIKE : platforms AND window__c =: window ORDER BY Fortnite_Player__r.username__c ASC];
/*        
        List<String> cacheNames = new List<String>();
        if (usernameList != null) {
            for (String username: usernameList) {
                cacheNames.add(username + '%'); //_user_info');
            }            
        
            System.debug('cacheNames: ' + cacheNames);
                
            List<Fortnite_API_Cache__c> playerInfoList = [SELECT Id, Name, Cache_Key__c, url__c, body__c, Type__c, LastModifiedDate FROM Fortnite_API_Cache__c WHERE Type__c = 'UserInfo' AND Cache_Key__c LIKE :cacheNames];
            
            Map<String, Object> playerInfo = null;
            cacheNames = new List<String>();
            for (Fortnite_API_Cache__c info: playerInfoList) {
                playerInfo = (Map<String, Object>) JSON.deserializeUntyped(info.body__c);
                cacheNames.add((String) playerInfo.get('uid') + '%');
            }
            
            System.debug('cacheNames: ' + cacheNames);

        } else {
            cacheNames.add('%');
        }

        List<Fortnite_API_Cache__c> players = [SELECT Id, Name, Cache_Key__c, url__c, body__c, Type__c, LastModifiedDate FROM Fortnite_API_Cache__c WHERE Type__c = 'UserData' AND Cache_Key__c LIKE :cacheNames];
        
        List<Object> playerList = new List<Object>();
        
        for (Fortnite_API_Cache__c player: players) {
            //System.debug('player: ' + player);
            String body = (String) player.get('body__c');
            Map<String, Object> playerData = (Map<String, Object>) JSON.deserializeUntyped(body);
            //System.debug('playerData: ' + playerData);
            playerList.add(playerData);
        }
*/    
        return playerDataList;
    }
    
    @AuraEnabled
    @HttpPost
    global static String getPlayers(String usernames, String platforms, String window, String dimensions, String measures, String dummy) {
        
        usernames = usernames == null || usernames.length() == 0 ? '*' : usernames;
        platforms = platforms == null || platforms.length() == 0 ? '*' : platforms;
        window = window == null ? 'alltime' : window;
        dimensions = dimensions == null || dimensions.length() == 0 ? '*' : dimensions;
		measures = measures == null || measures.length() == 0 ? '*' : measures;
        
        /*
        System.debug('usernames: ' + usernames);
        System.debug('platforms: ' + platforms);
        System.debug('window: ' + window);
        System.debug('dimensions: ' + dimensions);
        System.debug('measures: ' + measures);
        */
        //List<Fortnite_API_Cache__c> players = [SELECT Id, Name, Cache_Key__c, url__c, body__c, Type__c, LastModifiedDate FROM Fortnite_API_Cache__c WHERE Type__c = 'UserData'];

        Map<String, String> usernameMap = new Map<String, String>();
        List<String> usernameList = null;
        if (usernames != '*') {
            usernameList = usernames.split(',');
            for (String d: usernameList) {
                usernameMap.put(d, d);
            }            
        }

        Map<String, String> platformMap = new Map<String, String>();
        List<String> platformList = null;
        if (platforms != '*') {
            platformList = platforms.split(',');
            for (String d: platformList) {
                platformMap.put(d, d);
            }            
        }
        
        Map<String, String> dimensionMap = new Map<String, String>();
        if (dimensions != '*') {
            List<String> dimensionList = dimensions.split(',');
            for (String d: dimensionList) {
                dimensionMap.put(d, d);
            }            
        }

        Map<String, String> measureMap = new Map<String, String>();
        if (measures != '*') {
            List<String> measureList = measures.split(',');
            for (String m: measureList) {
                measureMap.put(m, m);
            }
        }
        
        List<Fortnite_Player_Data__c> playerList = getFortnitePlayers(usernameList, platformList, window);
        
        //System.debug('playerList.size(): ' + playerList.size());
        
		Integer count = 0;
        
        List<String> strings = new List<String>();
        List<String> numbers = new List<String>();
        List<String> groupings = new List<String>();
        
        List<Map<String, Object>> records = new List<Map<String, Object>>();        
        Map<String, Object> record = null;
        
        List<String> defaultDimensions = new List<String>();
        defaultDimensions.add('username');
        defaultDimensions.add('uid');
        defaultDimensions.add('platform');
        defaultDimensions.add('window');        
        
        for (Fortnite_Player_Data__c playerData: playerList) {
            //System.debug('playerData: ' + playerData);

            record = new Map<String, Object>();

            for (String key: defaultDimensions) {
                if (dimensions == '*' || dimensionMap.get(key) != null) {
                    if (key == 'username') {
	                    //record.put(key, playerData.Fortnite_Player__r.username__c);                        
                    } else if (key == 'uid') {
                        //record.put(key, playerData.Fortnite_Player__r.uid__c);                        
                    } else if (key == 'platform') {
                        record.put(key, playerData.platform__c);                        
                    } else if (key == 'window') {
                        record.put(key, playerData.window__c);                        
                    }

                    if (count < 1) {
                        strings.add(key);
                    }            
                }                
            }
            
            Map<String, Object> totals = (Map<String, Object>) JSON.deserializeUntyped(playerData.totals__c);
            Map<String, Object> total = null;
            for (String key: totals.keySet()) {
                if (measures == '*' || measureMap.get(key) != null) {
                    if (count < 1) {
                        numbers.add(key);
                    }
                    record.put(key, totals.get(key));                    
                }
            }
            
            Map<String, Object> stats = (Map<String, Object>) JSON.deserializeUntyped(playerData.stats__c);
            Map<String, Object> stat = null;
            for (String key: stats.keySet()) {
                if (measures == '*' || measureMap.get(key) != null) {
                    if (count < 1) {
                        numbers.add(key);
                    }
                    record.put(key, stats.get(key));
                }
            }
           
			records.add(record);
            
            count++;
        }

        Map<String, Object> metadata = new Map<String, Object>();
        metadata.put('strings', strings);
        metadata.put('numbers', numbers);
        metadata.put('groupings', groupings);

        Map<String, Object> retValue = new Map<String, Object>();        
        retValue.put('metadata', metadata);
        retValue.put('data', records);
        
        String body = JSON.serialize(retValue);
        //System.debug('body: ' + body);
        
        return body;
    }
    
    @AuraEnabled
    global static String getPlayerInfo(String name, Boolean refresh) {
            
        String url = 'https://fortnite-public-api.theapinetwork.com/prod09/users/id';
    
        String cacheKey = name + '_user_info';
        //System.debug('cacheKey: ' + cacheKey);
         
        Fortnite_API_Cache__c cache = null;
        String cacheId = null;
        
        try {
            cache = [SELECT Id, Name, Cache_Key__c, url__c, body__c, LastModifiedDate FROM Fortnite_API_Cache__c WHERE Cache_Key__c =: cacheKey LIMIT 1];
            //System.debug('cache: ' + cache);
            cacheId = cache.Id;
            if (DateTime.now().getTime() > (cache.LastModifiedDate.getTime() + cache_timeout)) {            
                cache = null;
            }                        
        } catch (Exception e) {
            System.debug('Exception: ' + e);
            cache = null;
        }

        if (cache == null || refresh == true) {
        
            HttpRequest request = new HttpRequest();        
            Http http = new Http();
            request.setEndpoint(url);
            request.setMethod('POST');
            //request.setHeader('Content-type', 'application/json');
            request.setHeader('Authorization', FortniteApiKey);
            
            String body = 'username=' + name;
            
            request.setBody(body);
            
            HTTPResponse response = http.send(request);
    
            body = response.getBody();                    
    
            Map<String, Object> resp = (Map<String, Object>) JSON.deserializeUntyped(body);
            //System.debug('resp: ' + resp);
            if (resp.get('err') != null || resp.get('error') != null) {
                
            
                //System.debug('------------------------------------------------------> updating cache with body: ' + body);
    
                cache = new Fortnite_API_Cache__c();
                cache.Id = cacheId;
                cache.Name = name;
                cache.Cache_Key__c = cacheKey;
                cache.body__c = body;
                cache.url__c = url;
                
                UPSERT cache;
            }
            
            return body;
        } else {
            //System.debug('------------------------------------------------------> returning from cache body: ' + cache.body__c);
            return cache.body__c;
        }
    }

    @AuraEnabled
    global static String getPlayerData(String userId, String platform, String window, Boolean refresh) {
            
        String url = 'https://fortnite-public-api.theapinetwork.com/prod09/users/public/br_stats';
    
        String cacheKey = userid + '_' + platform + '_' + window;
        //System.debug('cacheKey: ' + cacheKey);

        //System.debug('userId: ' + userId);
        
        Fortnite_API_Cache__c cache = null;
        String cacheId = null;
        
        try {
            cache = [SELECT Id, Name, Cache_Key__c, url__c, body__c, LastModifiedDate FROM Fortnite_API_Cache__c WHERE Cache_Key__c =: cacheKey LIMIT 1];
            //System.debug('cache: ' + cache);
            cacheId = cache.Id;
            if (DateTime.now().getTime() > (cache.LastModifiedDate.getTime() + cache_timeout)) {
                cache = null;
            }
        } catch (Exception e) {
            System.debug('Exception: ' + e);
            cache = null;
        }

        if (cache == null || refresh == true) {
        
            HttpRequest request = new HttpRequest();        
            Http http = new Http();
            request.setEndpoint(url);
            request.setMethod('POST');
            request.setHeader('Authorization', FortniteApiKey);
            
            String body = 'user_id=' + userId + '&platform=' + platform + '&window=' + window ;
            
            request.setBody(body);
            
            HTTPResponse response = http.send(request);
    
            body = response.getBody();                    
    
            //System.debug('------------------------------------------------------> updating cache with body: ' + body);

            cache = new Fortnite_API_Cache__c();
            cache.Id = cacheId;
            cache.Name = userId;
            cache.Cache_Key__c = cacheKey;
            cache.body__c = body;
            cache.url__c = url;
            
            UPSERT cache;
            
            return body;
        } else {
            //System.debug('------------------------------------------------------> returning from cache body: ' + cache.body__c);
            return cache.body__c;
        }
    }
}