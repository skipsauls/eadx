global with sharing class CommanderController {
/*
    @AuraEnabled
    global static List<Command__c> getAll() {
        String soql = 'SELECT Id, ' +
                        'CommandActionable__r.ActionType__c, ' + 
                        'CommandTarget__c, ' + 
                        'Name, ' +
                        '(SELECT Grammar__r.Name, PhraseIndex__c, ActionablePhrase__r.PhraseText__c '+
                          'FROM GrammarCommands__r ' + 
                          'ORDER BY ActionablePhrase__c, PhraseIndex__c) '+
                    'FROM Command__c ';
        List<Command__c> commands = Database.query(soql);
        
        return commands;
        return null;
    }
*/    
}