/* Class for use with the fornite Lightning Component */
global with sharing class FortniteAPIController2 {

    private static String FortniteApiKey = '6761864a-6d460da2-1081f57d-e2c14a6d';
    
    global class FortnitePlayer {
        public String username;
        public String account_id;        
    }
    
    global class FortniteStatDetails {
        public Integer placetop1 { get; set; }
        public Integer placetop3 { get; set; }
        public Integer placetop5 { get; set; }
        public Integer placetop6 { get; set; }
        public Integer placetop10 { get; set; }
        public Integer placetop12 { get; set; }
        public Integer placetop25 { get; set; }
        public Integer matchesplayed { get; set; }
        public Integer minutesplayed { get; set; }
        public Integer kills { get; set; }
        public Integer score { get; set; }
        public Integer bestscore { get; set; }
        public Integer playersoutlived { get; set; }
        public Double kd { get; set; }
        public Double winrate { get; set; }
    }
/*
    global class FortniteStatsByGameType {
        public FortniteStatDetails solo { get; set; }
        public FortniteStatDetails duo { get; set; }
        public FortniteStatDetails squad { get; set; }
        public FortniteStatDetails ltm { get; set; }
    }
    
    global class FortniteStatsByControllerType {
        public Map<String, FortniteStatDetails> touch { get; set; }
        public Map<String, FortniteStatDetails> gamepad { get; set; }
        public Map<String, FortniteStatDetails> keyboardmouse { get; set; }
    }
*/    
    global class FortniteAccountStats {
        public Integer level { get; set; }
        public Double progress_pct { get; set; }
    }
    
    global class FortniteStats {
        public Boolean result { get; set; }
        public String source { get; set; }
        public String mode { get; set; }
        public String name { get; set; }
        public FortniteAccountStats account { get; set; }
        public Map<String, FortniteStatDetails> global_stats { get; set; }
        public Map<String, Map<String, FortniteStatDetails>> per_input { get; set; }
        public List<Integer> seasons_available { get; set; }
        public String season { get; set; }
    }

    
    @AuraEnabled
    global static String getGlobalPlayerStats(String username, String season) {
        
        if (season == null || season == '') {
            season = 'all';
        }


        FortnitePlayer player = null;
        
        Fortnite_Player__c playerRecord = null;
        
        String uid = null;

        try {
            playerRecord = [SELECT Id, Name, uid__c, username__c, platforms__c, seasons__c, LastModifiedDate FROM Fortnite_Player__c WHERE username__c =: username];
            player = new FortnitePlayer();
            player.account_id = playerRecord.uid__c;
            player.username = playerRecord.username__c;
        } catch (Exception e) {
            System.debug('Exception: ' + e);
            //return '{"error":"Player with username ' + username + ' was not found. Please try using getPlayerInfo."}';
	        player = lookupPlayerByUsername(username);
            playerRecord = new Fortnite_Player__c();
            
            playerRecord.uid__c = player.account_id;
            playerRecord.username__c = player.username;
        }        
        
        System.debug('player: ' + player);
        System.debug('playerRecord: ' + playerRecord);
        
        List<Fortnite_Player__c> playerStatsRecords = null;
     
        try {
            playerStatsRecords = [SELECT Id,Name,uid__c,username__c,
                           			(SELECT Id,input__c,gametype__c,kills__c,kd__c,score__c,bestscore__c,matchesplayed__c,minutesplayed__c,placetop1__c,placetop3__c,placetop5__c,placetop6__c,placetop10__c,placetop25__c,playersoutlived__c,winrate__c
                            			FROM Fortnite_Player_Stats__r)
                           			FROM Fortnite_Player__c WHERE username__c =: playerRecord.username__c];
        } catch (Exception e) {
            System.debug('Exception: ' + e);
            playerStatsRecords = new List<Fortnite_Player__c>();            
        }
        
        System.debug('playerStatsRecords: ' + playerStatsRecords);        
        
        List<Fortnite_Player_Stats__c> playerStats = [SELECT Id,input__c,gametype__c,kills__c,kd__c,score__c,bestscore__c,matchesplayed__c,minutesplayed__c,placetop1__c,placetop3__c,placetop5__c,placetop6__c,placetop10__c,placetop25__c,playersoutlived__c,winrate__c
                            			FROM Fortnite_Player_Stats__c];

        System.debug('playerStats: ' + playerStats);        
        
        Map<String, Fortnite_Player_Stats__c> playerStatsMap = new Map<String, Fortnite_Player_Stats__c>();
        String key = null;
        for (Fortnite_Player_Stats__c stats: playerStats) {
            System.debug('stats: ' + stats);
            key = (stats.input__c == null) ? '' : stats.input__c;
            key += '_' + stats.gametype__c;
            System.debug('key: ' + key);
            playerStatsMap.put(key, stats);
            //System.debug('playerStatsRecord: ' + (Fortnite_Player_Stats__c) playerStatsRecord.Id);
            //key = (playerStatsRecord.input__c == null) ? 'global' : playerStatsRecord.input__c;
            //playerStatsRecordMap.put(key, playerStatsRecord);
        }
        
        String url = 'https://fortniteapi.io/stats?account=' + player.account_id + '&season=' + season;
        
        HttpRequest request = new HttpRequest();        
        Http http = new Http();
        request.setEndpoint(url);
        request.setMethod('GET');
        request.setHeader('Authorization', FortniteApiKey);
        
        HTTPResponse response = http.send(request);
        
        System.debug('response.body: ' + response.getBody());
    
        
       	upsert playerRecord;

        
        FortniteStats stats = (FortniteStats) JSON.deserialize(response.getBody(), FortniteStats.class);
        
        System.debug('stats: ' + stats);
        
        List<String> inputTypes = new List<String>{ 'touch', 'gamepad', 'keyboardmouse' };
        List<String> gameTypes = new List<String>{ 'solo', 'duo', 'squad', 'ltm' };
            
		FortniteStatDetails statDetails = null;
		Map<String, FortniteStatDetails> statDetailsMap = null;
        
        Fortnite_Player_Stats__c playerStatsRecord = null;
        
        for (String gameType: gameTypes) {
            System.debug('gameType: ' + gameType);
            statDetails = (FortniteStatDetails) stats.global_stats.get(gameType);
            System.debug('statDetails: ' + statDetails);
            if (statDetails != null) {
                playerStatsRecord = createFortnitePlayerStatsRecord(playerRecord, null, gameType, statDetails);
                System.debug('playerStatsRecord: ' + playerStatsRecord);
                
                upsert playerStatsRecord;
            }
        }

        for (String inputType: inputTypes) {
            System.debug('inputType: ' + inputType);
            statDetailsMap = (Map<String, FortniteStatDetails>) stats.per_input.get(inputType);
            if (statDetailsMap != null) {
                for (String gameType: gameTypes) {
                    System.debug('gameType: ' + gameType);
                    statDetails = (FortniteStatDetails) statDetailsMap.get(gameType);
                    System.debug('statDetails: ' + statDetails);
                    if (statDetails != null) {
                        playerStatsRecord = createFortnitePlayerStatsRecord(playerRecord, inputType, gameType, statDetails);
                        System.debug('playerStatsRecord: ' + playerStatsRecord);
                        
                        upsert playerStatsRecord;

                    }
                }
            }
        }
        
        /*       
        Boolean result;
        String source;
        String mode;
        String name;
        FortniteAccountStats account;
        FortniteStatsByGameType global_stats;
        FortniteStatsByControllerType per_input;
        List<Integer> seasons_available;
        String season;        
   */     

        
//        SELECT Id,Name,eadx__uid__c,eadx__username__c, (SELECT Id,eadx__kills__c FROM eadx__Fortnite_Player_Stats__r) FROM eadx__Fortnite_Player__c WHERE eadx__username__c = 'Bloxitect'             
//        
        // Note that second argument determines null suppression
        String statsJson = JSON.serialize(stats, true);
        System.debug('statsJson: ' + statsJson);
        
        return statsJson;
    }
    

    global static Fortnite_Player_Stats__c createFortnitePlayerStatsRecord(Fortnite_Player__c playerRecord, String input, String gametype, FortniteStatDetails details) {
        System.debug('updateFortnitePlayerStatsRecord: ' + playerRecord + ', ' + input + ', ' + gametype);
        System.debug('updateFortnitePlayerStatsRecord: ' + details);
        
        Fortnite_Player_Stats__c stats = new Fortnite_Player_Stats__c();
        
        stats.Fortnite_Player__c = playerRecord.Id;
        
        stats.input__c = input;
        stats.gametype__c = gametype;
        
        stats.winrate__c = details.winrate;
        stats.score__c = details.score;
        stats.playersoutlived__c = details.playersoutlived;
        stats.placetop1__c = details.placetop1;
        stats.placetop3__c = details.placetop3;
        stats.placetop5__c = details.placetop5;
        stats.placetop6__c = details.placetop6;
        stats.placetop10__c = details.placetop10;
        stats.placetop12__c = details.placetop12;
        stats.placetop25__c = details.placetop25;
        stats.minutesplayed__c = details.minutesplayed;
        stats.matchesplayed__c = details.matchesplayed;
        stats.kills__c = details.kills;
        stats.kd__c = details.kd;
        
        return stats;
        
    }
    
    @AuraEnabled
    global static String listGameModes(String lang) {
        
        if (lang == null || lang == '') {
            lang = 'en';
        }
        
        String url = 'https://fortniteapi.io/game/modes?lang=' + lang;
        
        HttpRequest request = new HttpRequest();        
        Http http = new Http();
        request.setEndpoint(url);
        request.setMethod('GET');
        request.setHeader('Authorization', FortniteApiKey);
        
        HTTPResponse response = http.send(request);
        
        System.debug('response.body: ' + response.getBody());
        
        return response.getBody();
    }

    @AuraEnabled
    global static String listSeasons() {
        
        String url = 'https://fortniteapi.io/seasons/list';
        
        HttpRequest request = new HttpRequest();        
        Http http = new Http();
        request.setEndpoint(url);
        request.setMethod('GET');
        request.setHeader('Authorization', FortniteApiKey);
        
        HTTPResponse response = http.send(request);
        
        System.debug('response.body: ' + response.getBody());
        
        return response.getBody();
    }
    
    
    @AuraEnabled
    global static String lookupAccountIdByUsername(String username) {
        
        String url = 'https://fortniteapi.io/lookup?username=' + username;
        
        HttpRequest request = new HttpRequest();        
        Http http = new Http();
        request.setEndpoint(url);
        request.setMethod('GET');
        request.setHeader('Authorization', FortniteApiKey);
        
        HTTPResponse response = http.send(request);
        
        System.debug('response.body: ' + response.getBody());
        
        FortnitePlayer player = (FortnitePlayer) JSON.deserialize(response.getBody(), FortnitePlayer.class);  
        
        player.username = username;
        
        System.debug('returning player: ' + player);
        
        return JSON.serialize(player);
    }

    global static FortnitePlayer lookupPlayerByUsername(String username) {
        
        String url = 'https://fortniteapi.io/lookup?username=' + username;
        
        HttpRequest request = new HttpRequest();        
        Http http = new Http();
        request.setEndpoint(url);
        request.setMethod('GET');
        request.setHeader('Authorization', FortniteApiKey);
        
        HTTPResponse response = http.send(request);
        
        System.debug('response.body: ' + response.getBody());
        
        FortnitePlayer player = (FortnitePlayer) JSON.deserialize(response.getBody(), FortnitePlayer.class);  
        
        player.username = username;
        
        System.debug('returning player: ' + player);
        
        return player;
    }


    @AuraEnabled
    global static String getRecentMatches(String username) {
        
        FortnitePlayer player = lookupPlayerByUsername(username);
        
        String url = 'https://fortniteapi.io/matches?account=' + player.account_id;
        
        HttpRequest request = new HttpRequest();        
        Http http = new Http();
        request.setEndpoint(url);
        request.setMethod('GET');
        request.setHeader('Authorization', FortniteApiKey);
        
        HTTPResponse response = http.send(request);
        
        System.debug('response.body: ' + response.getBody());
/*        
        FortnitePlayer player = (FortnitePlayer) JSON.deserialize(response.getBody(), FortnitePlayer.class);  
        
        player.username = username;
        
        System.debug('returning player: ' + player);
        
        return JSON.serialize(player);
*/        
        return response.getBody();
    }
    
}