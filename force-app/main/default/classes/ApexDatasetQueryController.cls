@RestResource(urlMapping='/datasetquery/*') 
global with sharing class ApexDatasetQueryController {

    @HttpPost            
    global static String execQuery(String datasetId, String fields, Integer lim) {
        List<String> fieldsList = fields.split(',');
        
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
        
        String currentVersionId = (String) dataset.get('currentVersionId');
        
        String query = '';
        query += 'q = load "' + datasetId + '/' + currentVersionId + '";\n';
        query += 'q = foreach q generate ';
        String sep = ' ';
        for (String field: fieldsList) {
            query += sep + '\'' + field + '\' as \'' + field + '\'';
            sep = ', ';
        }
        query += ';\n';
        query += 'q = limit q ' + lim + ';\n';
        
        ConnectApi.LiteralJson result =  ConnectApi.Wave.executeQuery(query);
    
        Map<String, Object> root = (Map<String, Object>) JSON.deserializeUntyped(result.json);
        
        Map<String, Object> results = (Map<String, Object>) root.get('results');
        List<Object> metadata = (List<Object>) results.get('metadata');
        List<Object> records = (List<Object>) results.get('records');
        
        List<String> strings = new List<String>();
        List<String> numbers = new List<String>();
        List<String> groupings = new List<String>();

        Map<String, Object> md = null;
        Map<String, Object> lineage = null;
        Map<String, Object> projection = null;
       	Map<String, Object> field = null;
        List<Object> projections = null;
        List<Object> columns = null;
        List<Object> groups = null;
        String type = null;
        String name = null;
        String id = null;
        for (Object m: metadata) {
            md = (Map<String, Object>) m;
            
            lineage = (Map<String, Object>) md.get('lineage');
            projections = (List<Object>) lineage.get('projections');
            for (Object p: projections) {
                projection = (Map<String, Object>) p;
                field = (Map<String, Object>) projection.get('field');
                id = (String) field.get('id');
                type = (String) field.get('type');
                name = id.replace('q.', '');
                if (type == 'numeric') {
                     numbers.add(name);
                } else {
                	strings.add(name);             
                }
            }
            
        }

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