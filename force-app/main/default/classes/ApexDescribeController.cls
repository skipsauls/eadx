@RestResource(urlMapping='/apexdescribe/*') 
global with sharing class ApexDescribeController {
               
    @HttpPost            
    global static String describe(String sobjectName) {

        final List<String> strings = new List<String>(); 
        final List<String> numbers = new List<String>(); 
        final List<Object> groupings = new List<String>();
        
        String jsonResponse = null;
        List<Object> records = new List<Object>();
        
        if (sobjectName != null) {
            try {
                String[] types = new String[]{sobjectName};
                Schema.DescribeSobjectResult[] results = Schema.describeSObjects(types);
                
                Map<String, String> field = null;
                        
                for (Schema.DescribeSobjectResult dsr : results) {
                    Map<String, Schema.SObjectField> fieldMap = dsr.fields.getMap();
                    for (String s : fieldMap.keySet()) {
                        field = new Map<String, String>();
                        field.put('Name', fieldMap.get(s).getDescribe().getName());
                        field.put('Type', fieldMap.get(s).getDescribe().getType().name());
                        records.add(field);
                    }        
                }
            } catch(Exception e) {
            
            }
        }                    
        strings.add('Name');
        strings.add('Type');
                    
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