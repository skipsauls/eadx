@RestResource(urlMapping='/apexsaqlquery/*') 
global with sharing class ApexSAQLQueryController {

    @AuraEnabled
    global static String execQuery(String queryName) {
        List<NamedQuery__c> namedQueries = [SELECT Id,Name,saql__c FROM NamedQuery__c WHERE Name =: queryName];
        
        String query = namedQueries[0].saql__c;
    
        System.debug('query: ' + query);
        ConnectApi.LiteralJson result =  ConnectApi.Wave.executeQuery(query);
        System.debug('result: ' + result);
        System.debug('json: ' + result.json);
        return result.json;
    }

    @AuraEnabled
    global static String getQuery(String queryName) {
        List<NamedQuery__c> namedQueries = [SELECT Id,Name,saql__c FROM NamedQuery__c WHERE Name =: queryName];
        NamedQuery__c namedQuery = namedQueries[0];
        
        return namedQuery.saql__c;
    }

               
    @AuraEnabled
    global static String updateQuery(String queryName, String saql) {
        List<NamedQuery__c> namedQueries = [SELECT Id,Name,saql__c FROM NamedQuery__c WHERE Name =: queryName];
        NamedQuery__c namedQuery = namedQueries[0];
        
        if (namedQuery == null) {
            namedQuery = new NamedQuery__c();
        }
        
        namedQuery.Name = queryName;
        namedQuery.saql__c = saql;
        
        UPSERT namedQuery;
        
        return namedQuery.Id;
    }

    @HttpPost            
    global static String saqlQuery(String queryName, String dummy) {

        List<NamedQuery__c> namedQueries = [SELECT Id,Name,saql__c FROM NamedQuery__c WHERE Name =: queryName];
        
        String query = namedQueries[0].saql__c;
        
        System.debug('query: ' + query);
        ConnectApi.LiteralJson result =  ConnectApi.Wave.executeQuery(query);
        System.debug('result: ' + result);
        System.debug('json: ' + result.json);
    
    
        //Map<String, Map<String, Object>> root = (Map<String, Map<String, Object>>) JSON.deserializeUntyped(result.json);
        Map<String, Object> root = (Map<String, Object>) JSON.deserializeUntyped(result.json);
        System.debug('root: ' + root);
        
        Map<String, Object> results = (Map<String, Object>) root.get('results');
        List<Object> metadata = (List<Object>) results.get('metadata');
        List<Object> records = (List<Object>) results.get('records');
        

        System.debug('results: ' + results);
        System.debug('metadata: ' + metadata);
        System.debug('results: ' + results);

        List<String> strings = new List<String>();
        List<String> numbers = new List<String>();
        List<String> groupings = new List<String>();

        Map<String, Object> md = null;
        List<Object> columns = null;
        List<Object> groups = null;
        for (Object m: metadata) {
            md = (Map<String, Object>) m;
            System.debug('md: ' + md);
            columns  = (List<Object>) md.get('columns');
            groups = (List<Object>) md.get('groups');
            Map<String, Object> column = null;
            String type = null;
            String name = null;
            for (Object c: columns) {
                column = (Map<String, Object>) c;
                System.debug('column: ' + column.get('name') + ' - ' + column.get('type'));
                name = (String) column.get('name');
                type = (String) column.get('type');
                if (type == 'numeric') {
                    numbers.add(name);
                } else {
                    strings.add(name);
                }
            }
            String grp = null;
            for (Object g: groups) {
                grp = (String) g;
                System.debug('group: ' + grp);
                groupings.add(grp);
            }
                
        }

                
        ReturnMetadata rm = new ReturnMetadata(strings, numbers, groupings); 
        
        return JSON.serialize(new PackagedReturnItem(records, rm)); 
    } 
    
    // Get the records from the query response 
    private static List<Object> getQueryRecords(Map<String, Object> resultMap) { 
        List<Object> records = (List<Object>)resultMap.get('records'); 
        return records; 
    } 
    
    // Get the metadata from the query response 
    private static void getQueryMetadata(List<String> strings, List<String> numbers, List<Object> groupings, Map<String, Object> resultMap) { 
    
        Map<String, Object> metadataMap = (Map<String, Object>)resultMap.get('metadata'); 
        List<Object> columns = (List<Object>)metadataMap.get('columns'); 
    
        for(Integer i = 0 ; i < columns.size(); i++) { 
            Map<String, Object> curColumn = (Map<String, Object>) columns[i]; 
            if(curColumn.get('type') == 'Numeric') { 
                numbers.add((String)curColumn.get('name')); 
            } else { 
                strings.add((String)curColumn.get('name')); 
            } 
        } 
        groupings = (List<Object>) metadataMap.get('groups'); 
    } 
    
    private class ReturnMetadata { 
    
        public final List<String> strings; 
        public final List<String> numbers; 
        public final List<Object> groupings; 
        
        public ReturnMetadata(List<String> strings, List<String> numbers, List<Object> groupings) { 
            this.strings = strings; 
            this.numbers = numbers; 
            this.groupings = groupings; 
        } 
    } 
    
    private class PackagedReturnItem { 
    
        public final List<Object> data; 
        public final ReturnMetadata metadata; 
        
        public PackagedReturnItem(List<Object> data, ReturnMetadata metadata) { 
            this.data = data; 
            this.metadata = metadata; 
        } 
    }     
}