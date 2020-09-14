global with sharing class TemplateConfigController {

    @AuraEnabled
    global static TemplateConfig__c create(String name, String interviewId) {
        TemplateConfig__c config = new TemplateConfig__c();
        {
            config.Name = name;
            config.Interview_ID__c = interviewId;
        }
        upsert config;
        return [SELECT Id,Name,Start_From__c,Interview_ID__c FROM TemplateConfig__c WHERE Id =: config.Id];
    }

    @AuraEnabled
    global static List<TemplateConfig__c> listTemplateConfigs() {
        return [SELECT Id,Name,Start_From__c FROM TemplateConfig__c];
    }
    
    @AuraEnabled
    global static TemplateConfig__c getTemplateConfig(String id) {
        return [SELECT Id,Name,Start_From__c FROM TemplateConfig__c WHERE Id =: id];
    }
    
    @AuraEnabled
    global static void setStartFrom(String id, String val) {
        TemplateConfig__c config = [SELECT Id,Name,Start_From__c,Interview_ID__c FROM TemplateConfig__c WHERE Id =: id];
        config.Start_From__c = val;
        upsert config;
    }
}