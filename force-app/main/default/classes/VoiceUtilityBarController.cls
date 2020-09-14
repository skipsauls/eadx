global with Sharing Class VoiceUtilityBarController {
/*
    @AuraEnabled
    global static String getVoiceConfig(String name) {
        name = name == null ? 'Default' : name;
        System.debug('getVoiceConfig: ' + name);
        Id userId = Userinfo.getUserid();
        System.debug('userId: ' + userId);
        VoiceConfig__c voiceConfig = null;
        try {
            voiceConfig = [SELECT Id,Name,Config__c FROM VoiceConfig__c WHERE OwnerId =: userId AND Name =: name];
        } catch(Exception e) {
            voiceConfig = new VoiceConfig__c();
            voiceConfig.Name = name != null ? name : 'Default';
            UPSERT voiceConfig;
        }
        return voiceConfig.Config__c;
    }
    
    @AuraEnabled
    global static String updateVoiceConfig(String name, String config) {
        name = name == null ? 'Default' : name;
        System.debug('updateVoiceConfig - name: ' + name);
        System.debug('updateVoiceConfig - config: ' + config);
        Id userId = Userinfo.getUserid();
        System.debug('userId: ' + userId);
        VoiceConfig__c voiceConfig = [SELECT Id,Name,Config__c FROM VoiceConfig__c WHERE OwnerId =: userId AND Name =: name];
        if (voiceConfig == null) {
            voiceConfig = new VoiceConfig__c();
            voiceConfig.Name = name != null ? name : 'Default';
        }
        voiceConfig.Config__c = config;
        UPSERT voiceConfig;
        return voiceConfig.Config__c;
    }
    
    @AuraEnabled
    global static String execQuery(String query) {
        System.debug('query: ' + query);
        ConnectApi.LiteralJson result =  ConnectApi.Wave.executeQuery(query);
        System.debug('result: ' + result);
        System.debug('json: ' + result.json);
        return result.json;
    }
    
    @AuraEnabled
    global static List<Map<String, Object>> getCommandsByType(List<String> types) {
        List<Command__c> ocommands = [SELECT Id,Name,CommandTarget__c,CommandActionable__r.ActionType__c,CommandActionable__r.Id,CommandActionable__r.Name FROM Command__c WHERE CommandActionable__r.ActionType__c IN :types];
        System.debug('ocommands: ' + ocommands);
        List<Map<String, Object>> commands = new List<Map<String, Object>>();
        Map<String, Object> command = null;
        Map<String, Object> actionable = null;
        Map<String, Object> phrase = null;
        List<Map<String, Object>> phrases = null;
        for (Command__c ocommand : ocommands) {
                    
            command = new Map<String, Object>();
            command.put('id', ocommand.Id);
            command.put('name', ocommand.Name);
            command.put('target', ocommand.CommandTarget__c);
    
            actionable = new Map<String, Object>();
            
            actionable.put('id', ocommand.CommandActionable__r.Id);
            actionable.put('name', ocommand.CommandActionable__r.Name);
            actionable.put('actionType', ocommand.CommandActionable__r.ActionType__c);
            
            command.put('actionable', actionable);

            List<ActionablePhrase__c> ophrases = [SELECT Id,Name,PhraseText__c,Actionable__c FROM ActionablePhrase__c WHERE Actionable__r.Name =: ocommand.CommandActionable__r.Name];
            phrases = new List<Map<String, Object>>();
            for (ActionablePhrase__c ophrase: ophrases) {
                phrase = new Map<String, Object>();
                phrase.put('name', ophrase.Name);
                phrase.put('text', ophrase.PhraseText__c);
                phrases.add(phrase);
            }        
                
            command.put('phrases', phrases);
            
            commands.add(command);
        }
        return commands;
    }
*/    
}