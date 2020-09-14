@RestResource(urlMapping='/datasetlist/*') 
global with sharing class ApexDatasetListController {

    @HttpPost            
    global static String listDatasets() {
        
        String baseUrl = URL.getSalesforceBaseUrl().toExternalForm();
		String url = baseUrl + '/services/data/v47.0/wave/datasets';

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
        
        Map<String, Object> resp = (Map<String, Object>) JSON.deserializeUntyped(body);
        List<Object> datasets =  (List<Object>) resp.get('datasets');
        Map<String, Object> dataset = null;
        
        List<Object> records = new List<Object>();
            
        String label = null;
        Map<String, Object> folder = null;
        String folderLabel = null;
        String fullName = null;
        for (Object d: datasets) {
            dataset = (Map<String, Object>) d;
            
            // Create a "fullName" field to ensure uniqueness
            label = (String) dataset.get('label');
            folder = (Map<String, Object>) dataset.get('folder');
            folderLabel = (String) folder.get('label');
            fullName = label + ' (' + folderLabel + ')';
            dataset.put('fullName', fullName);
            records.add(dataset);
        }
        
        List<String> strings = new List<String>();
        List<String> numbers = new List<String>();
        List<String> groupings = new List<String>();

		strings.add('fullName');
		strings.add('id');
		strings.add('currentVersionId');
		strings.add('name');
		strings.add('namespace');

        ReturnMetadata rm = new ReturnMetadata(strings, numbers, groupings); 
        
        return JSON.serialize(new PackagedReturnItem(records, rm)); 
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