@RestResource(urlMapping='/datasetdescribe/*') 
global with sharing class ApexDatasetDescribeController {
    
    @HttpPost            
    global static String describe(String datasetId, String collectionTypes) {
        
        List<String> collectionTypesList = collectionTypes.split(',');
                     
        RestRequest req = RestContext.request;
        RestResponse res = RestContext.response;
        
        String baseUrl = URL.getSalesforceBaseUrl().toExternalForm();
		String url = baseUrl + '/services/data/v47.0/wave/datasets/' + datasetId;
        
        HttpRequest request = new HttpRequest();        
        Http http = new Http();
        request.setEndpoint(url);
        request.setMethod('GET');
        request.setHeader('Content-type', 'application/json');
        request.setHeader('Accept', 'application/json');
        request.setHeader('X-Chatter-Entity-Encoding', 'false');
		request.setHeader('Authorization', 'Bearer ' + UserInfo.getSessionId());        
        
        HTTPResponse response = http.send(request);

        String body = response.getBody().replaceAll('\\"', '"');
        
        Map<String, Object> dataset = (Map<String, Object>) JSON.deserializeUntyped(body);
        
        String currentVersionUrl = (String) dataset.get('currentVersionUrl');
        
        url = baseUrl + currentVersionUrl;
        
        // Get the current version of the dataset

        request = new HttpRequest();        
        http = new Http();
        request.setEndpoint(url);
        request.setMethod('GET');
        request.setHeader('Content-type', 'application/json');
        request.setHeader('Accept', 'application/json');
        request.setHeader('X-Chatter-Entity-Encoding', 'false');
		request.setHeader('Authorization', 'Bearer ' + UserInfo.getSessionId());        
        
        response = http.send(request);

        body = response.getBody().replaceAll('\\"', '"');
        
        Map<String, Object> resp = (Map<String, Object>) JSON.deserializeUntyped(body);
        
        Map<String, Object> xmdMain = (Map<String, Object>) resp.get('xmdMain');

        Map<String, Object> fieldMap = new Map<String, Object>();
        
        for (String collectionType: collectionTypesList) {
	        List<Object> itemsList = (List<Object>) xmdMain.get(collectionType);
            fieldMap = addRecordItems(itemsList, fieldMap);
            
        }
        
        List<String> sortedFieldNames = new List<String>();
        sortedFieldNames.addAll(fieldMap.keySet());
        sortedFieldNames.sort();

        List<Object> records = new List<Object>();
        
        for (String key: sortedFieldNames) {
            records.add(fieldMap.get(key));
        }

        final List<String> strings = new List<String>(); 
        final List<String> numbers = new List<String>(); 
        final List<Object> groupings = new List<String>();
        
        strings.add('Label');
        strings.add('Field');
        strings.add('Type');
        strings.add('Origin');
        strings.add('Name');
        
        ReturnMetadata rm = new ReturnMetadata(strings, numbers, groupings); 
        
        return JSON.serialize(new PackagedReturnItem(records, rm)); 
    } 
    
    private static Map<String, Object> addRecordItems(List<Object> itemsList, Map<String, Object> fieldMap) {
        
        Map<String, Object> item = null;
        Map<String, String> field = null;
        
        for (Object i: itemsList) {
            item = (Map<String, Object>) i;
            field = new Map<String, String>();
            field.put('Type', 'dimension');
            field.put('Label', (String) item.get('label'));
            field.put('Field', (String) item.get('field'));
            field.put('Origin', (String) item.get('origin'));
            field.put('Name', (String) item.get('fullyQualifiedName'));
            fieldMap.put(field.get('Label'), field);
        }
        
        return fieldMap;
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