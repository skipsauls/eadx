global with sharing class SOQLDatatableController {

    @AuraEnabled
    global static List<Map<String, Object>> execQuery(String query, List<String> fields) {
        
        System.debug('query: ' + query);
        
        List<SObject> records = new List<SObject>();
        
        List<Map<String, Object>> results = new List<Map<String, Object>>();
        Map<String, Object> result = null;
        
        try {
            records = Database.query(query);
            List<String> tokens = null;
            String oname = null;
            String fname = null;
            Object value = null;
            for (SObject record: records) {
                result = new Map<String, Object>();
                for (String field: fields) {
                    if (field.contains('.')) {
                        tokens = field.split('\\.');
                        SObject obj = record.getSObject(tokens.get(0));
                        value = obj.get(tokens.get(1));
                    } else {
                        value = record.get(field);
                    }
                    result.put(field, value);
                }
                results.add(result);
            }
        } catch (System.QueryException qe) {
            System.debug('QueryException: ' + qe);
        }    
        return results;
    }

    @AuraEnabled
    global static List<Object> listObjects(String fields, String whereClause) {

        System.debug('fields: ' + fields);
        
        List<Object> records = new List<Object>();

        if (fields != null) {
    
            List<String> fieldList = fields.split(',');
            
            if (fieldList != null && fieldList.size() > 0) {
                String query = 'SELECT ';
                String delim = '';
                for (String f : fieldList) {
                    query += delim + f;
                    delim = ',';                    
                }
                                
                query += ' FROM Office__c';
                
                if (whereClause != null && whereClause != '') {
                    query += ' ' + whereClause;
                }
    
                //query += ' LIMIT ' + lim;
                
                System.debug('query: ' + query);
                 
                try {
                    records = Database.query(query);
                } catch (System.QueryException qe) {
                    System.debug('QueryException: ' + qe);
                }
            }
        }                    


        //List<Office__c> offices = [SELECT Id,Name,Street__c,City__c,State__c,Country__c,PostalCode__c,Total_Booking_Rate__c,Occupancy_Rate__c,Predicted_Occupancy_Rate__c,OwnerId FROM Office__c];
        
        return records;
    }

}