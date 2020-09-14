global with sharing class ListViewController {

    @AuraEnabled
    public static List<SObject> getRecords(String query) {
    
        List<SObject> records = Database.query(query);
    
        return records;
    }
}