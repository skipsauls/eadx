@RestResource(urlMapping='/apexformulas/*') 
global with sharing class ApexFormulasController {

    global static List<Object> callFormulaParser(String formulas) {
             
        String url = 'https://analytics-ltngout-playground.herokuapp.com/formulas/parse';
        
        HttpRequest request = new HttpRequest();        
        Http http = new Http();
        request.setEndpoint(url);
        request.setMethod('POST');
        request.setHeader('Content-type', 'application/json');
        request.setBody(formulas);
        
        HTTPResponse response = http.send(request);

        String body = response.getBody();                    

        List<Object> results = (List<Object>) JSON.deserializeUntyped(body);

        return results;
        /*
        if (transform == 'apex_step') {
            List<Map<String,Object>> xtweets = transformTweetsForApexStep(m);
            return xtweets;
        } else {
            return null;
        }
        */
    }
    
    @HttpPost     
    global static void doParseFormulas(String formulas, String dummy) {
        System.debug('formulas: ' + formulas);
        System.debug('dummy: ' + dummy);
        
        List<Object> results = callFormulaParser(formulas);

        List<String> strings;
        List<String> numbers;
        List<String> groupings;
        if (strings == null) {
            strings = new List<String>();
            strings.add('formula');      
            strings.add('code');      
            strings.add('error');
        }
        
        if (numbers == null) {
            numbers = new List<String>();
            numbers.add('result');
        }
        
        if (groupings == null) {
            groupings = new List<String>();
        }
        
        ReturnMetadata rm = new ReturnMetadata(strings, numbers, groupings);
            
        String body = JSON.serialize(new PackagedReturnItem(results, rm));
        
        RestContext.response.addHeader('Content-Type', 'application/json');
        RestContext.response.responseBody = Blob.valueOf(body);        
    } 
 
    @AuraEnabled
    global static String parseFormulas(String formulas, String dummy) {
        System.debug('formulas: ' + formulas);
        System.debug('dummy: ' + dummy);
        
        List<Object> results = callFormulaParser(formulas);

        List<String> strings;
        List<String> numbers;
        List<String> groupings;
        if (strings == null) {
            strings = new List<String>();
            strings.add('formula');            
        }
        
        if (numbers == null) {
            numbers = new List<String>();
            numbers.add('result');
        }
        
        if (groupings == null) {
            groupings = new List<String>();
        }
        
        ReturnMetadata rm = new ReturnMetadata(strings, numbers, groupings);
            
        String body = JSON.serialize(new PackagedReturnItem(results, rm));
        
        return body;                
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