global with sharing class WairPermissions {
    @AuraEnabled
    global Boolean canCreate{get;set;}
    @AuraEnabled
    global Boolean canView{get;set;}
    @AuraEnabled
    global Boolean canSubscribeToEvents{get;set;}
}