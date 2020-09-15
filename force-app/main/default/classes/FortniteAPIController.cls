/* Class for use with the fornite Lightning Component */
global with sharing class FortniteAPIController {

    // 24 hour default timeout
    private static Long cache_timeout = 86400000;
    
    private static String FortniteApiKey = '50eb1016d2332fcd0a9bbca4ee36b51d';
    
    global class FortnitePlayerObj {
        global String username;
        String uid;
        List<String> platforms;
        List<String> seasons;
        public FortnitePlayerObj(Fortnite_Player__c p) {
            username = p.username__c;
            uid = p.uid__c;
            platforms = p.platforms__c.split(',');
            seasons = p.seasons__c.split(',');
        }
    }

    global class FortnitePlayerDataObj {
        global String username;
        String uid;
        String platform;
        String window;
        Map<String, Object> totals;
        Map<String, Object> stats;
        public FortnitePlayerDataObj(Fortnite_Player_Data__c p) {
            //username = p.Fortnite_Player__r.username__c;
            //uid = p.Fortnite_Player__r.uid__c;
            window = p.window__c;
            platform = p.platform__c;
            totals = (Map<String, Object>) JSON.deserializeUntyped(p.totals__c);
            stats = (Map<String, Object>) JSON.deserializeUntyped(p.stats__c);
        }
    }

    @AuraEnabled
    global static String getPlayers() {
        
		List<Fortnite_Player__c> playerList = null;
        List<FortnitePlayerObj> playerObjList = new List<FortnitePlayerObj>();
        
        try {
            playerList = [SELECT Id, Name, uid__c, username__c, platforms__c, seasons__c, LastModifiedDate FROM Fortnite_Player__c ORDER BY username__c ASC];
            for (Fortnite_Player__c player: playerList) {
				playerObjList.add(new FortnitePlayerObj(player));   
            }
        } catch (Exception e) {
            System.debug('Exception: ' + e);
        }
        
        return JSON.serialize(playerObjList);
    }
        

	@AuraEnabled
    global static String getPlayerInfo2(String username, Boolean refresh) {
        
        String url = 'https://fortnite-public-api.theapinetwork.com/prod09/users/id';
        
		Fortnite_Player__c player = null;
        FortnitePlayerObj playerObj = null;
        
        String uid = null;
        
        try {
            player = [SELECT Id, Name, uid__c, username__c, platforms__c, seasons__c, LastModifiedDate FROM Fortnite_Player__c WHERE username__c =: username];
            uid = player.uid__c;
            if (DateTime.now().getTime() > (player.LastModifiedDate.getTime() + cache_timeout)) {            
                player = null;
            }
        } catch (Exception e) {
            System.debug('Exception: ' + e);
            refresh = true;
        }
        
        if (player == null || refresh == true) {
        
            HttpRequest request = new HttpRequest();        
            Http http = new Http();
            request.setEndpoint(url);
            request.setMethod('POST');
            request.setHeader('Authorization', FortniteApiKey);
            
            String body = 'username=' + username;
            
            request.setBody(body);
            
            HTTPResponse response = http.send(request);
    
            body = response.getBody();                    
    
            System.debug('body: ' + body);
            
            Map<String, Object> resp = (Map<String, Object>) JSON.deserializeUntyped(body);
            if (resp.get('error') != true) {
                if (player == null) {
	                player = new Fortnite_Player__c();
    	            player.uid__c = (String) resp.get('uid');
        	        player.username__c = username;
                }
                
               	List<Object> platforms = (List<Object>) resp.get('platforms');
                player.platforms__c = String.join(platforms, ',');
                
                List<Object> seasons = (List<Object>) resp.get('seasons');
                player.seasons__c = String.join(seasons, ',');
                
                UPSERT player;
            }
            

            playerObj = new FortnitePlayerObj(player);            
            return JSON.serialize(playerObj);
        } else {
            playerObj = new FortnitePlayerObj(player);
            return JSON.serialize(playerObj);
        }
    }

	@AuraEnabled
    global static String getPlayerInfo3(String username, Boolean refresh) {
        
		Fortnite_Player__c player = null;
        FortnitePlayerObj playerObj = null;
        
        String uid = null;
        
        try {
            player = [SELECT Id, Name, uid__c, username__c, platforms__c, seasons__c, LastModifiedDate FROM Fortnite_Player__c WHERE username__c =: username];
            uid = player.uid__c;
            if (DateTime.now().getTime() > (player.LastModifiedDate.getTime() + cache_timeout)) {            
                player = null;
            }
        } catch (Exception e) {
            System.debug('Exception: ' + e);
            refresh = true;
        }
        
        if (player == null || refresh == true) {
        
	        String url = 'https://fortniteapi.io/lookup?username=' + username;
        
            HttpRequest request = new HttpRequest();        
            Http http = new Http();
            request.setEndpoint(url);
            request.setMethod('GET');
			request.setHeader('Authorization', '6761864a-6d460da2-1081f57d-e2c14a6d'); //FortniteApiKey);
            
            HTTPResponse response = http.send(request);
    
            String body = response.getBody();                    
/*    
            Map<String, Object> resp = (Map<String, Object>) JSON.deserializeUntyped(body);
            if (resp.get('error') != true) {
                if (player == null) {
	                player = new Fortnite_Player__c();
    	            player.uid__c = (String) resp.get('uid');
        	        player.username__c = username;
                }
                
               	List<Object> platforms = (List<Object>) resp.get('platforms');
                player.platforms__c = String.join(platforms, ',');
                
                List<Object> seasons = (List<Object>) resp.get('seasons');
                player.seasons__c = String.join(seasons, ',');
                
                UPSERT player;
            }
            

            playerObj = new FortnitePlayerObj(player);            
            return JSON.serialize(playerObj);
*/
            return body;
            
        } else {
            playerObj = new FortnitePlayerObj(player);
            return JSON.serialize(playerObj);
        }
    }
    
    @AuraEnabled
    global static String getPlayerData2(String username, String platform, String window, Boolean refresh) {
            
        String url = 'https://fortnite-public-api.theapinetwork.com/prod09/users/public/br_stats_v2';
    
		Fortnite_Player__c player = null;
        String uid = null;

        try {
            player = [SELECT Id, Name, uid__c, username__c, platforms__c, seasons__c, LastModifiedDate FROM Fortnite_Player__c WHERE username__c =: username];
        } catch (Exception e) {
            System.debug('Exception: ' + e);
            return '{"error":"Player with username ' + username + ' was not found. Please try using getPlayerInfo."}';
        }

		List<Fortnite_Player_Data__c> playerDataList = null;
		Fortnite_Player_Data__c playerData = null;
        FortnitePlayerDataObj playerDataObj = null;
        
        try {
            playerData = null;//[SELECT Id, Name, Fortnite_Player__r.uid__c, Fortnite_Player__r.username__c, platform__c, window__c, totals__c, stats__c, LastModifiedDate FROM Fortnite_Player_Data__c WHERE Fortnite_Player__r.uid__c =: player.uid__c AND platform__c =: platform AND window__c =: window];
            if (DateTime.now().getTime() > (playerData.LastModifiedDate.getTime() + cache_timeout)) {            
                playerData = null;
            }
        } catch (Exception e) {
            System.debug('Exception: ' + e);
            refresh = true;
        }
        
        if (playerData == null || refresh == true) {
        
            HttpRequest request = new HttpRequest();        
            Http http = new Http();
            request.setEndpoint(url);
            request.setMethod('POST');
            request.setHeader('Authorization', FortniteApiKey);
            
            String body = 'user_id=' + player.uid__c + '&platform=' + platform + '&window=' + window ;
            
            request.setBody(body);
            
            HTTPResponse response = http.send(request);
    
            body = response.getBody();                    
    
            Map<String, Object> resp = (Map<String, Object>) JSON.deserializeUntyped(body);
            System.debug('resp: ' + resp);
            if (resp.get('error') != true) {
                if (playerData == null) {
	                playerData = new Fortnite_Player_Data__c();
                    //playerData.Fortnite_Player__c = player.Id;
                    //playerData.Fortnite_Player__r.username__c = player.username__c;
                    //playerData.Fortnite_Player__r.uid__c = player.uid__c;
                    playerData.platform__c = (String) resp.get('platform');
                    playerData.window__c = (String) resp.get('window');
                }
                
                Map<String, Object> totals = (Map<String, Object>) resp.get('totals');
                System.debug('totals: ' + totals);
                playerData.totals__c = JSON.serialize(totals);
                
                Map<String, Object> stats = (Map<String, Object>) resp.get('stats');
                System.debug('stats: ' + stats);
                playerData.stats__c = JSON.serialize(stats);
                
                UPSERT playerData;
                
                System.debug('player.username__c: ' + player.username__c);
                System.debug('platform: ' + platform);
                System.debug('window: ' + window);
                    
	            playerDataList= null; //[SELECT Id, Name, Fortnite_Player__r.uid__c, Fortnite_Player__r.username__c, platform__c, window__c, totals__c, stats__c, LastModifiedDate FROM Fortnite_Player_Data__c WHERE Fortnite_Player__r.username__c =: player.username__c AND platform__c =: platform AND window__c =: window];
                System.debug('playerDataList: ' + playerDataList);
                playerData = playerDataList.get(0);
                
            }
            

            System.debug('1 ------------------------------------------');
            System.debug('playerData: ' + playerData);
            playerDataObj = new FortnitePlayerDataObj(playerData);
            System.debug('playerDataObj: ' + playerDataObj);            
            return JSON.serialize(playerDataObj);
            
        } else {
            System.debug('2 ------------------------------------------');
            System.debug('playerData: ' + playerData);
            playerDataObj = new FortnitePlayerDataObj(playerData);
            System.debug('playerDataObj: ' + playerDataObj);            
            return JSON.serialize(playerDataObj);
        }
    }

    
    /* NEW - June 2020 */
    @AuraEnabled
    global static String getPlayerData3(String username, String platform, String window, Boolean refresh) {
            
		Fortnite_Player__c player = null;
     
        String uid = null;

        try {
            player = [SELECT Id, Name, uid__c, username__c, platforms__c, seasons__c, LastModifiedDate FROM Fortnite_Player__c WHERE username__c =: username];
        } catch (Exception e) {
            System.debug('Exception: ' + e);
            return '{"error":"Player with username ' + username + ' was not found. Please try using getPlayerInfo."}';
        }

		List<Fortnite_Player_Data__c> playerDataList = null;
		Fortnite_Player_Data__c playerData = null;
        FortnitePlayerDataObj playerDataObj = null;
        
        try {
            playerData = null;//[SELECT Id, Name, Fortnite_Player__r.uid__c, Fortnite_Player__r.username__c, platform__c, window__c, totals__c, stats__c, LastModifiedDate FROM Fortnite_Player_Data__c WHERE Fortnite_Player__r.uid__c =: player.uid__c AND platform__c =: platform AND window__c =: window];
            if (DateTime.now().getTime() > (playerData.LastModifiedDate.getTime() + cache_timeout)) {            
                playerData = null;
            }
        } catch (Exception e) {
            System.debug('Exception: ' + e);
            refresh = true;
        }
       
        if (playerData == null || refresh == true) {
        
            String url = 'https://fortniteapi.io/stats?account=' + player.uid__c;
        

            HttpRequest request = new HttpRequest();        
            Http http = new Http();
            request.setEndpoint(url);
            request.setMethod('GET');
            request.setHeader('Authorization', '6761864a-6d460da2-1081f57d-e2c14a6d'); //FortniteApiKey);
            
            //String body = 'user_id=' + player.uid__c + '&platform=' + platform + '&window=' + window ;
            
            //request.setBody(body);
            
            HTTPResponse response = http.send(request);
    
            String body = response.getBody();                    
    
            System.debug('response body: ' + body);
/*            
            Map<String, Object> resp = (Map<String, Object>) JSON.deserializeUntyped(body);
            System.debug('resp: ' + resp);
            if (resp.get('error') != true) {
                if (playerData == null) {
	                playerData = new Fortnite_Player_Data__c();
                    playerData.Fortnite_Player__c = player.Id;
                    //playerData.Fortnite_Player__r.username__c = player.username__c;
                    //playerData.Fortnite_Player__r.uid__c = player.uid__c;
                    playerData.platform__c = (String) resp.get('platform');
                    playerData.window__c = (String) resp.get('window');
                }
                
                Map<String, Object> totals = (Map<String, Object>) resp.get('totals');
                System.debug('totals: ' + totals);
                playerData.totals__c = JSON.serialize(totals);
                
                Map<String, Object> stats = (Map<String, Object>) resp.get('stats');
                System.debug('stats: ' + stats);
                playerData.stats__c = JSON.serialize(stats);
                
                UPSERT playerData;
                
                System.debug('player.username__c: ' + player.username__c);
                System.debug('platform: ' + platform);
                System.debug('window: ' + window);
                    
	            playerDataList= [SELECT Id, Name, Fortnite_Player__r.uid__c, Fortnite_Player__r.username__c, platform__c, window__c, totals__c, stats__c, LastModifiedDate FROM Fortnite_Player_Data__c WHERE Fortnite_Player__r.username__c =: player.username__c AND platform__c =: platform AND window__c =: window];
                System.debug('playerDataList: ' + playerDataList);
                playerData = playerDataList.get(0);
                
            }
            

            System.debug('1 ------------------------------------------');
            System.debug('playerData: ' + playerData);
            playerDataObj = new FortnitePlayerDataObj(playerData);
            System.debug('playerDataObj: ' + playerDataObj);
            return JSON.serialize(playerDataObj);

*/
            return body;
            
        } else {
            System.debug('2 ------------------------------------------');
            System.debug('playerData: ' + playerData);
            playerDataObj = new FortnitePlayerDataObj(playerData);
            System.debug('playerDataObj: ' + playerDataObj);            
            return JSON.serialize(playerDataObj);
        }
    }
    
    
    
    @AuraEnabled
    global static String getPlayerInfo(String username, Boolean refresh) {
            
        String url = 'https://fortnite-public-api.theapinetwork.com/prod09/users/id';
    
        String cacheKey = username + '_user_info';
        //System.debug('cacheKey: ' + cacheKey);
         
        Fortnite_API_Cache__c cache = null;
        String cacheId = null;
        
        try {
            cache = [SELECT Id, Name, Cache_Key__c, url__c, body__c, Type__c, LastModifiedDate FROM Fortnite_API_Cache__c WHERE Cache_Key__c =: cacheKey LIMIT 1];
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
            
            String body = 'username=' + username;
            
            request.setBody(body);
            
            HTTPResponse response = http.send(request);
    
            body = response.getBody();                    
    
            Map<String, Object> resp = (Map<String, Object>) JSON.deserializeUntyped(body);
            System.debug('resp: ' + resp);
            if (resp.get('error') != true) {            
                //System.debug('------------------------------------------------------> updating cache with body: ' + body);
    
                cache = new Fortnite_API_Cache__c();
                cache.Id = cacheId;
                cache.Name = cacheKey;
                cache.Cache_Key__c = cacheKey;
                cache.body__c = body;
                cache.url__c = url;
                cache.Type__c = 'UserInfo';
                
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

        System.debug('userId: ' + userId);
        
        Fortnite_API_Cache__c cache = null;
        String cacheId = null;
        
        try {
            cache = [SELECT Id, Name, Cache_Key__c, url__c, body__c, Type__c, LastModifiedDate FROM Fortnite_API_Cache__c WHERE Cache_Key__c =: cacheKey LIMIT 1];
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
    
            Map<String, Object> resp = (Map<String, Object>) JSON.deserializeUntyped(body);
            System.debug('resp: ' + resp);
            if (resp.get('error') != true) {            
                
                //System.debug('------------------------------------------------------> updating cache with body: ' + body);
    
                cache = new Fortnite_API_Cache__c();
                cache.Id = cacheId;
                cache.Name = cacheKey;
                cache.Cache_Key__c = cacheKey;
                cache.body__c = body;
                cache.url__c = url;
                cache.Type__c = 'UserData';
    
                UPSERT cache;
            }            
            return body;
        } else {
            //System.debug('------------------------------------------------------> returning from cache body: ' + cache.body__c);
            return cache.body__c;
        }
    }
        
    @AuraEnabled
    global static String getStore(Boolean refresh) {
            
        String url = 'https://fortnite-public-api.theapinetwork.com/prod09/store/get';
    
        String cacheKey = 'fortnite_store';
    
        Fortnite_API_Cache__c cache = null;
        String cacheId = null;
        
        try {
            cache = [SELECT Id, Name, Cache_Key__c, url__c, body__c, Type__c, LastModifiedDate FROM Fortnite_API_Cache__c WHERE Cache_Key__c =: cacheKey LIMIT 1];
            //System.debug('cache: ' + cache);
            cacheId = cache.Id;
        
            //cache = [SELECT Id, Name, url__c, body__c, LastModifiedDate FROM Fortnite_API_Cache__c WHERE url__c =: url LIMIT 1];
            //cacheId = cache.Id;
            
            if (DateTime.now().getTime() > (cache.LastModifiedDate.getTime() + cache_timeout)) {
                cache = null;
            }
        } catch (Exception e) {
            System.debug('Exception: ' + e);
            cache = null;
        }

        //System.debug('cache: ' + cache);
        if (cache == null || refresh == true) {
        
            HttpRequest request = new HttpRequest();        
            Http http = new Http();
            request.setEndpoint(url);
            request.setMethod('POST');
            request.setHeader('Content-type', 'application/json');
            request.setHeader('Authorization', FortniteApiKey);
            request.setBody('');
            
            HTTPResponse response = http.send(request);
    
            String body = response.getBody();                    
    
            Map<String, Object> resp = (Map<String, Object>) JSON.deserializeUntyped(body);
            System.debug('resp: ' + resp);
            if (resp.get('error') != true) {            
            
                //System.debug('------------------------------------------------------> updating cache with body: ' + body);
    
                cache = new Fortnite_API_Cache__c();
                cache.Id = cacheId;
                cache.Name = 'Store';
                cache.Cache_Key__c = cacheKey;
                cache.body__c = body;
                cache.url__c = url;
                cache.Type__c = 'Store';
    
    
                UPSERT cache;
            }            
            return body;
        } else {
            //System.debug('------------------------------------------------------> returning from cache body: ' + cache.body__c);
            return cache.body__c;
        }
    }

}