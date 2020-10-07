global with sharing class DatatableController {


    @AuraEnabled
    global static List<Object> executeQuery(String query) {
        List<Object> records = new List<Object>();

        try {
            records = Database.query(query);
        } catch (System.QueryException qe) {
        }

		return records;        
    }
    
    @AuraEnabled
    global static String updateRecord(SObject record, String keyField) {
        System.debug('updateRecord - record: ' + record + ', keyField: ' + keyField);
        
        try {
            upsert record;
        } catch (Exception e) {
            System.debug('Exception: ' + e);
        }
        /*
        List<Object> records = new List<Object>();

        try {
            records = Database.query(query);
        } catch (System.QueryException qe) {
        }

		return records;        
		*/
        return 'foo';
    }
    
}