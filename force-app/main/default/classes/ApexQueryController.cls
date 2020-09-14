@RestResource(urlMapping='/apexquery/*') 
global with sharing class ApexQueryController {
               
    @HttpPost            
    global static String dynamicQuery(String sobjectName, String fields, Integer lim) {
        if (lim == null) {
            lim = 100;
        }

        List<Object> records = new List<Object>();
        List<String> strings = new List<String>();
        List<String> numbers = new List<String>();
        List<String> groupings = new List<String>();

        if (fields != null) {
    
            List<String> fieldList = fields.split(',');
            
            if (fieldList != null && fieldList.size() > 0) {
                String query = 'SELECT ';
                String delim = '';
                for (String f : fieldList) {
                    query += delim + f;
                    delim = ',';
                    strings.add(f);
                }
                                
                query += ' FROM ' + sobjectName;
    
                query += ' LIMIT ' + lim;
                
                try {
                    records = Database.query(query);
                } catch (System.QueryException qe) {
                }
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