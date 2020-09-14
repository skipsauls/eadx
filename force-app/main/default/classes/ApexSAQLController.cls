global with sharing class ApexSAQLController {

    @AuraEnabled
    global static String execQuery(String query) {    
        //System.debug('query: ' + query);
        ConnectApi.LiteralJson result =  ConnectApi.Wave.executeQuery(query);
        //System.debug('result: ' + result);
        //System.debug('json: ' + result.json);
        return result.json;
    }
 }