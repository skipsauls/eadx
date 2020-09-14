@RestResource(urlMapping='/apexsimple/*') 
global with sharing class ApexSimpleController {
               
    @HttpPost            
    global static String doPost(String sobjectName, List<String> strings, List<String> numbers, List<String> groups, Integer lim) {
        if (lim == null) {
            lim = 100;
        }

        List<Object> records = new List<Object>();

        String query = 'SELECT ';
        String delim = '';
        
        if (strings != null && strings.size() > 0) {        
            for (String s : strings) {
                query += delim + s;
                delim = ', ';
            }
        }

        if (numbers != null && numbers.size() > 0) {
            for (String n : numbers) {
                query += delim + n;
                delim = ', ';
            }
        }
                                    
        query += ' FROM ' + sobjectName;
        query += ' LIMIT ' + lim;
        
                
        try {
            records = Database.query(query);
        } catch (System.QueryException qe) {
        
        }
                
        ReturnMetadata rm = new ReturnMetadata(strings, numbers, groups); 
        
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
        public final List<Object> groups; 
        
        public ReturnMetadata(List<String> strings, List<String> numbers, List<Object> groups) { 
            this.strings = strings; 
            this.numbers = numbers; 
            this.groups = groups; 
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