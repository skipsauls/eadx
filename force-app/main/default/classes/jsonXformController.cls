global class jsonXformController {
	@AuraEnabled
    global static String saveJson(String name, String document, String values, String definition) {
        JSON_Transform__c transform = null;
        
        try {
            transform = [SELECT Id, Name, document__c, values__c, definition__c FROM JSON_Transform__c WHERE name =: name];
        } catch (Exception e) {
            transform = new JSON_Transform__c();
            transform.Name = name;
        }
        transform.document__c = document;
        transform.values__c = values;
        transform.definition__c = definition;
        
        UPSERT transform;
        
        return transform.Id;
    }
    
	@AuraEnabled
    global static Map<String, String> loadJson(String name) {
        Map <String, String> resp = null;
        try {
	        JSON_Transform__c transform = [SELECT Id, Name, document__c, values__c, definition__c FROM JSON_Transform__c WHERE name =: name];
    		resp = new Map<String, String>();
            resp.put('id', transform.Id);
            resp.put('name', transform.Name);
            resp.put('document', transform.document__c);
            resp.put('values', transform.values__c);
            resp.put('definition', transform.definition__c);
        } catch (Exception e) {
        }
        
        return resp;
    }

	@AuraEnabled
    global static List<JSON_Transform__c> listXforms() {
        List<JSON_Transform__c> transforms = [SELECT Id, Name FROM JSON_Transform__c];
        return transforms;
    }
    
}