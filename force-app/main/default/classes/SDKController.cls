global with sharing class SDKController {

    @AuraEnabled
    global static Map<String, String> getSObjectNames() {
        Map<String, Schema.SObjectType> gd = Schema.getGlobalDescribe();
        Map<String, String> names = new Map<String, String>();
        Schema.SObjectType sot = null;
        Schema.DescribeSObjectResult dsr = null;
        for (String name: gd.keySet()) {
            sot = gd.get(name);
            dsr = sot.getDescribe();
            if (dsr.isAccessible() && dsr.isQueryable()) {
                names.put(name, dsr.getLabel());        
            }
        }
        return names;
    }
    
    @AuraEnabled
    global static Map<String, String> getUsers() {
    
        // Query for users, leaving out analytics users, non standard users, etc.
        //List<SObject> records = [SELECT Id,Name FROM User WHERE UserType = 'Standard' AND (NOT Profile.Name LIKE 'Analytics%') ORDER BY Name ASC];
        List<SObject> records = [SELECT Id,Name FROM User ORDER BY Name ASC];

        Map<String, String> pickListMap = new Map<String, String>();        

        String value = null;
        for (SObject record: records) {
            value = (String) record.get('Name');
            pickListMap.put(value, value);
        }
        
        return pickListMap;
    }
    
    @AuraEnabled
    global static Map<String, String> getFieldValues(String sobjectName, String fieldName) {
    
        Boolean isDTC = false;
        
        // Weird cases for the crazy 'DTC' Trailhead datasets
        if (fieldName == 'Owner' || fieldName.contains('UniqueUserName')) {
            fieldName = 'Owner.Name';
            isDTC = true;
        } else if (fieldName == 'Stage' && sobjectName == 'Stage') {
            sobjectName = 'Opportunity';
            fieldName = 'StageName';
            isDTC = true;
        }                       
            
        // Use 'fieldName' alias to make it easier to get the values from the records
        String query = 'SELECT ' + fieldName + ' fieldName FROM ' + sobjectName + ' GROUP BY '+ fieldName;

        // Weird special case code for wacko Product objects
        query = query.replaceAll('Product', 'Product2');

        
        List<SObject> records = Database.query(query);

        Map<String, String> pickListMap = new Map<String, String>();        
        
        String value = null;
        Integer index = 1;
        String indexStr = '';
        for (SObject record: records) {
            value = (String) record.get('fieldName');
        
            // Crazy DTC dataset code
            if (isDTC == true && fieldName == 'StageName') {
                indexStr = index < 10 ? '0' + index : '' + index;
                value = indexStr + ' - ' + value;
            }            

            pickListMap.put(value, value);
            
            index++;
        }
        
        return pickListMap;
    
    }
 
    @AuraEnabled
    global static Map<String, String> getPicklistValues(String sobjectName, String fieldName) {
        String[] types = new String[]{sobjectName};
        Schema.DescribeSobjectResult[] results = Schema.describeSObjects(types);
        Schema.DescribeSobjectResult dsr = results[0];        
        Map<String, Schema.SObjectField> fieldMap = dsr.fields.getMap();        
        List<Schema.PicklistEntry> pickListValues = fieldMap.get(fieldName).getDescribe().getPickListValues();
        
        Map<String, String> pickListMap = new Map<String, String>();        
        
        for (Schema.PicklistEntry ple : pickListValues) {
            pickListMap.put(ple.getLabel(), ple.getValue());
        }        
       
        // Get the possible values for the field, which may not be in the picklist!!!
        
        String query = 'SELECT ' + fieldName + ' FROM ' + sobjectName + ' LIMIT 200';
        
        List<SObject> records = Database.query(query);
        String value = null;
        for (SObject record: records) {
            value = (String) record.get(fieldName);
            pickListMap.put(value, value);
        }
        
        return pickListMap;
    }
}