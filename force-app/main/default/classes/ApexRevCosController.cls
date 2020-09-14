@RestResource(urlMapping='/apexrevcos/*') 
global with sharing class ApexRevCosController {
       
    private class Results {
        public String label;
        public Double value;
        
        public Results(String label, Double value) {
            this.label = label;
            this.value = value;
        }
    }        
    
    @HttpPost            
    global static String compute(String tableName, Double revenues, Double costOfRevenues) {
        
        //List<Results> records = new List<Results>();
        List<Map<String, Object>> records = new List<Map<String, Object>>();
        List<String> strings = new List<String>();
        List<String> numbers = new List<String>();
        List<String> groupings = new List<String>();

        Map<String, Object> record = new Map<String, Object>();
        record.put(tableName, 'Revenues');
        record.put('value', revenues);
        records.add(record);
        
        record = new Map<String, Object>();
        record.put(tableName, 'Cost of Revenues');
        record.put('value', costOfRevenues);
        records.add(record);
        
        record = new Map<String, Object>();
        record.put(tableName, 'Gross Margin');
        record.put('value', revenues + costOfRevenues);
        records.add(record);
        
        
        /*
        records.add(new Results('Revenues', revenues));
        records.add(new Results('Cost of Revenues', costOfRevenues));
        records.add(new Results('Gross Margin', revenues + costOfRevenues));
        */
                        
        //strings.add('label');
        strings.add(tableName);
        numbers.add('value');
        
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