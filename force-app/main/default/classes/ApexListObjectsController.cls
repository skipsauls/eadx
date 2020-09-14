@RestResource(urlMapping='/apexlistobjects/*') 
global with sharing class ApexListObjectsController {

    public static Map<String, Object> sortMap(Map<String, Object> theMap, String theOrder) {
        //create the return map
        Map<String, Object> returnMap = new Map<String, Object>();
        //get the set of the keys of the map we want to sort
        Set<String> keySet = theMap.keySet();
        //create a list and add all the keys from the set
        //a small workaround needed because we can't sort a set
        List<String> keyList = new List<String>();
        keyList.addAll(keySet);
        //sort the list ascending (predefined behaviour)
        keyList.sort();
        if (theOrder == 'DESC')
            //iterate from the last to the first key over the ascending ordered key list
            for (Integer i = (keyList.size() - 1); i >= 0; i--)
                returnMap.put(keyList[i], theMap.get(keyList[i]));
        else
            //iterate from the first to the last key over the ascending ordered key list
            for (Integer i = 0; i < keyList.size(); i++)
                returnMap.put(keyList[i], theMap.get(keyList[i]));
        //return the sorted map
        return returnMap;
    }
               
    @HttpPost            
    global static String listSObjects() {

        final List<String> strings = new List<String>(); 
        final List<String> numbers = new List<String>(); 
        final List<Object> groupings = new List<String>();
        
        String jsonResponse = null;
        List<Object> records = new List<Object>();
        Map<String, Object> recordMap = new Map<String, Object>();
        Map<String, String> field = null;
        
        for (Schema.SObjectType o : Schema.getGlobalDescribe().values()) {
            Schema.DescribeSObjectResult objResult = o.getDescribe();
            if (objResult.isAccessible() == true && objResult.isQueryable() == true) {

                System.debug('Sobject: ' + objResult);
                System.debug('Sobject API Name: ' + objResult.getName());
                System.debug('Sobject Label Name: ' + objResult.getLabel());               
                
                field = new Map<String, String>();
                field.put('Name', objResult.getName());
                
                recordMap.put(objResult.getName(), field);
                //records.add(field);
            }
        }
        
        Map<String, Object> sortedMap = sortMap(recordMap, 'ASC');
        
        for (String name : sortedMap.keySet()) {
            records.add(sortedMap.get(name));
        }
        
        strings.add('Name');
        //strings.add('Type');
                    
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