@RestResource(urlMapping='/apexsteplist/*') 
global with sharing class ApexStepListController {
 
    // Wrapper classes
    global class ListItem {
        public String Name;
        
        public ListItem(String n) {
            this.Name = n;
        }
    }
    
    @HttpPost            
    global static String getApexStepListItems(String name, String dummy) {
        System.debug('getApexStepListItems: ' + name);
        List<Object> items = new List<Object>();
        Map<String, String> item = null;
        try {
            ApexStepList__c l = [SELECT Id, Name__c, Items__c FROM ApexStepList__c WHERE Name__c =: name];
            System.debug('list: ' + l);
            List<String> names = l.Items__c.split(',');
            System.debug('names: ' + names);
            for (String s : names) {
                item = new Map<String, String>();
                System.debug('s: ' + s);
                item.put('Name', s);
                items.add(item);
            }
        } catch (Exception e) {
            System.debug('Exception: ' + e);
        }

        System.debug('items: ' + items);
        
        List<String> strings = new List<String>();
        List<String> numbers = new List<String>();
        List<String> groupings = new List<String>();
        strings.add('Name');
        
        ReturnMetadata rm = new ReturnMetadata(strings, numbers, groupings);

        System.debug('rm: ' + rm);
        
        String body = JSON.serialize(new PackagedReturnItem(items, rm));

        System.debug('body: ' + body);
        
        return body;
        //RestContext.response.addHeader('Content-Type', 'application/json');
        //RestContext.response.responseBody = Blob.valueOf(body);
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