global with sharing class AnalyticsDatatableController {
    @AuraEnabled
    global static String execQuery(String query) {
        ConnectApi.LiteralJson result =  ConnectApi.Wave.executeQuery(query);
        return result.json;
    }
}