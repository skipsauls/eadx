@RestResource(urlMapping='/coverage/*') 
global with sharing class AnalyticsSharingCoverageController {

    global static String sobjectPartialUrl = '/sobjects';
    global static String datasetPartialUrl = '/wave/datasets';

    global static String baseUrl = null;
       
    global static String getBaseUrl() {
        if (baseUrl == null) {
            HttpRequest request = new HttpRequest();
            
            Http http = new Http();
            request.setEndpoint(System.Url.getSalesforceBaseURL().toExternalForm() + '/services/data');
            request.setMethod('GET');
            request.setHeader('Content-type', 'application/json');
            request.setHeader('Authorization', 'OAuth ' + UserInfo.getSessionId());        
        
            try {
                HTTPResponse response = http.send(request);
                JSONParser parser = JSON.createParser(response.getBody());
                
                while (parser.nextToken() != null) {
                    if ((parser.getCurrentToken() == JSONToken.FIELD_NAME) && (parser.getText() == 'url')) {
                        parser.nextToken();
                        baseUrl = parser.getText();
                    }
                }
            } catch(Exception exp) {
                System.debug('exception ' +exp);
            }
        }
        
        return System.Url.getSalesforceBaseURL().toExternalForm() + baseUrl;
    }

    public class Folder {
        public String namespace;
        public String name;
        public String label;
        public String id;
        public String url;
    }
    
    public class Dataset {
        public String namespace;
        public String name;
        public String label;
        public String id;
        public String currentVersionId;
        public String currentVersionUrl;
        public String url;
        public Folder folder;

        public Dataset() {
        
        }
    }

    public class DatasetSourceObject {
        public Boolean eligibleSharingSource;
        public String label;
        public String namespace;
        public String name;
        public String url;
    }
    
    public class DatasetSource {
        public DatasetSourceObject theobject;
        public List<String> securityFields;
        public DatasetSource() {
        }        
    }
    
    public class DatasetVersion {
        public String id;
        public String url;
        public Dataset dataset;
    }
    
    public class DatasetSharingCoverage {
        public DatasetVersion datasetVersion;
        public List<DatasetSource> sources;
        public DatasetSharingCoverage() {
        
        }
    }
    
    // A 'flattened' class for use in datasets, Apex Steps, etc.
    public class DatasetSharingCoverageFlat {
        public String type;
        public String datasetId;
        public String datasetVersionId;
        public String datasetNamespace;
        public String datasetName;
        public String datasetLabel;
        public Boolean eligibleSharingSource = false;
        public Integer eligibleSharingSourceNum = 0;
        public Integer count = 0;
        public String sourceObjectNamespace;
        public String sourceObjectName;
        public String sourceObjectLabel;
        public String securityField;
        
        public DatasetSharingCoverageFlat(DatasetSharingCoverage d) {
            type = 'dataset';
            datasetVersionId = d.datasetVersion.id;
            datasetId = d.datasetVersion.dataset.id;
            datasetNamespace = d.datasetVersion.dataset.namespace;
            datasetName = d.datasetVersion.dataset.name;
            datasetLabel = d.datasetVersion.dataset.label;
            for (DatasetSource s : d.sources) {
                eligibleSharingSource = s.theobject.eligibleSharingSource;
                eligibleSharingSourceNum = s.theobject.eligibleSharingSource == true ? 2 : 1;
                sourceObjectNamespace = s.theobject.namespace;
                sourceObjectName = s.theobject.name;
                sourceObjectLabel = s.theobject.label;
                for (String f: s.securityFields) {
                    securityField = f;
                }
            }
        }
    }        
      
    static void storeSharingCoverage(String name, String type, String json) {
        //Account newAcct = new Account(Name = 'Acme', BillingCity = 'San Francisco')
        eadx__SharingCoverage__c sc = new eadx__SharingCoverage__c(Name = name, Type__c = type, JSON__c = json);
        UPSERT sc;        
    }
    
    static String loadSharingCoverage(String name, String type) {
        try {
            List<eadx__SharingCoverage__c> sc = [SELECT Name, Type__c, JSON__c FROM eadx__SharingCoverage__c WHERE Name =: name AND Type__c =: type ORDER BY CreatedDate DESC];
            return sc[0].JSON__c;
        } catch (Exception e) {
            return null;
        }
    }

    global static String getDatasets() {
        String url = getBaseUrl() + datasetPartialUrl;        
        HttpRequest request = new HttpRequest();        
        Http http = new Http();
        request.setEndpoint(url);
        request.setMethod('GET');
        request.setHeader('Content-type', 'application/json');
        request.setHeader('Authorization', 'OAuth ' + UserInfo.getSessionId());        
        HTTPResponse response = http.send(request);
        return response.getBody();    
    }
    
    // REMOVE
    global static String OLDER_getDatasetSharingCoverage(Boolean flat) {
        String responseJson = getDatasets();
        String delim = '';
        JSONParser parser = JSON.createParser(responseJson);
        String id = null;
        String currentVersionId = null;
        List<String> datasetUrls = new List<String>();
        Map<String, String> datasetUrlMap = new Map<String, String>();
        
        Dataset dataset = null;
        
        parser = JSON.createParser(responseJson);        
        while (parser.nextToken() != null) {
            if ((parser.getCurrentToken() == JSONToken.FIELD_NAME) && (parser.getText() == 'currentVersionUrl')) {
                parser.nextToken();
                datasetUrls.add(parser.getText());
            }
        }

        
        String coverageJson = '{"datasets":[';        
        String url = null;
        DatasetSharingCoverage datasetSharingCoverage = null;
        DatasetSharingCoverageFlat datasetSharingCoverageFlat = null;
        
        List<DatasetSharingCoverage> datasetSharingCoverageList = new List<DatasetSharingCoverage>();
        List<DatasetSharingCoverageFlat> datasetSharingCoverageFlatList = new List<DatasetSharingCoverageFlat>();
        String body = null;
        
        for (String datasetUrl : datasetUrls) {
            
            url = getBaseUrl() + '/wave/security/coverage/datasets/' + datasetUrl.substringAfter('/datasets/');


            HttpRequest request = new HttpRequest();        
            Http http = new Http();
            request.setEndpoint(url);
            request.setMethod('GET');
            request.setHeader('Content-type', 'application/json');
            request.setHeader('Authorization', 'OAuth ' + UserInfo.getSessionId());        
            HTTPResponse response = http.send(request);
            
            if (flat == true) {
                // 'object'is a reserved word, so 'theobject' needs to be used
                body = response.getBody().replace('object', 'theobject');
                parser = JSON.createParser(body);
                while (parser.nextToken() != null) {
                    if (parser.getCurrentToken() == JSONToken.START_OBJECT) {
            
                        datasetSharingCoverage = (DatasetSharingCoverage) parser.readValueAs(AnalyticsSharingCoverageController.DatasetSharingCoverage.class);
                        datasetSharingCoverageList.add(datasetSharingCoverage);
                        //String s = JSON.serialize(datasetSharingCoverage);
                        //System.debug('Serialized datasetSharingCoverage: ' + s);
                        datasetSharingCoverageFlat = new DatasetSharingCoverageFlat(datasetSharingCoverage);
                        datasetSharingCoverageFlatList.add(datasetSharingCoverageFlat);                        
                        String s = JSON.serialize(datasetSharingCoverageFlat);
                        //System.debug('Serialized datasetSharingCoverageFlat: ' + s);
                        coverageJson += delim + s;
                        parser.skipChildren();
                    }
                }
            } else {        
                coverageJson += delim + response.getBody();
            }
            delim = ',';
        }
        
        coverageJson += ']}';
        
        return coverageJson;
    }

    static List<DatasetSharingCoverage> getDatasetSharingCoverage() {
        String responseJson = getDatasets();
        String delim = '';
        JSONParser parser = JSON.createParser(responseJson);
        String id = null;
        String currentVersionId = null;
        List<String> datasetUrls = new List<String>();
        Map<String, String> datasetUrlMap = new Map<String, String>();
        
        Dataset dataset = null;
        
        while (parser.nextToken() != null) {
            if ((parser.getCurrentToken() == JSONToken.FIELD_NAME) && (parser.getText() == 'currentVersionUrl')) {
                parser.nextToken();
                datasetUrls.add(parser.getText());
            }
        }
        
        String url = null;
        DatasetSharingCoverage datasetSharingCoverage = null;
        
        List<DatasetSharingCoverage> datasetSharingCoverageList = new List<DatasetSharingCoverage>();
        String body = null;
        
        for (String datasetUrl : datasetUrls) {
            
            url = getBaseUrl() + '/wave/security/coverage/datasets/' + datasetUrl.substringAfter('/datasets/');


            HttpRequest request = new HttpRequest();        
            Http http = new Http();
            request.setEndpoint(url);
            request.setMethod('GET');
            request.setHeader('Content-type', 'application/json');
            request.setHeader('Authorization', 'OAuth ' + UserInfo.getSessionId());        
            HTTPResponse response = http.send(request);
            
            // 'object'is a reserved word, so 'theobject' needs to be used
            body = response.getBody().replace('object', 'theobject');
            parser = JSON.createParser(body);
            while (parser.nextToken() != null) {
                if (parser.getCurrentToken() == JSONToken.START_OBJECT) {
        
                    datasetSharingCoverage = (DatasetSharingCoverage) parser.readValueAs(AnalyticsSharingCoverageController.DatasetSharingCoverage.class);
                    datasetSharingCoverageList.add(datasetSharingCoverage);
                    parser.skipChildren();
                }
            }
        }
        
        return datasetSharingCoverageList;
    }



    static List<DatasetSharingCoverageFlat> getDatasetSharingCoverageFlat() {
        String responseJson = getDatasets();
        String delim = '';
        JSONParser parser = JSON.createParser(responseJson);
        String id = null;
        String currentVersionId = null;
        List<String> datasetUrls = new List<String>();
        Map<String, String> datasetUrlMap = new Map<String, String>();
        
        Dataset dataset = null;
        
        while (parser.nextToken() != null) {
            if ((parser.getCurrentToken() == JSONToken.FIELD_NAME) && (parser.getText() == 'currentVersionUrl')) {
                parser.nextToken();
                datasetUrls.add(parser.getText());
            }
        }
        
        String url = null;
        DatasetSharingCoverage datasetSharingCoverage = null;
        DatasetSharingCoverageFlat datasetSharingCoverageFlat = null;
        
        List<DatasetSharingCoverage> datasetSharingCoverageList = new List<DatasetSharingCoverage>();
        List<DatasetSharingCoverageFlat> datasetSharingCoverageFlatList = new List<DatasetSharingCoverageFlat>();
        String body = null;
        Integer count = 0;
        
        for (String datasetUrl : datasetUrls) {
            
            url = getBaseUrl() + '/wave/security/coverage/datasets/' + datasetUrl.substringAfter('/datasets/');


            HttpRequest request = new HttpRequest();        
            Http http = new Http();
            request.setEndpoint(url);
            request.setMethod('GET');
            request.setHeader('Content-type', 'application/json');
            request.setHeader('Authorization', 'OAuth ' + UserInfo.getSessionId());        
            HTTPResponse response = http.send(request);
            
            // 'object'is a reserved word, so 'theobject' needs to be used
            body = response.getBody().replace('object', 'theobject');
            parser = JSON.createParser(body);
            while (parser.nextToken() != null) {
                if (parser.getCurrentToken() == JSONToken.START_OBJECT) {
        
                    datasetSharingCoverage = (DatasetSharingCoverage) parser.readValueAs(AnalyticsSharingCoverageController.DatasetSharingCoverage.class);
                    //datasetSharingCoverageList.add(datasetSharingCoverage);
                    datasetSharingCoverageFlat = new DatasetSharingCoverageFlat(datasetSharingCoverage);
                    count++;
                    datasetSharingCoverageFlat.count = count;
                    datasetSharingCoverageFlatList.add(datasetSharingCoverageFlat);                        
                    parser.skipChildren();
                }
            }
        }
        
        return datasetSharingCoverageFlatList;
    }

    global static String getSObjects() {
        String url = getBaseUrl() + sobjectPartialUrl;        
        HttpRequest request = new HttpRequest();        
        Http http = new Http();
        request.setEndpoint(url);
        request.setMethod('GET');
        request.setHeader('Content-type', 'application/json');
        request.setHeader('Authorization', 'OAuth ' + UserInfo.getSessionId());        
        HTTPResponse response = http.send(request);
        return response.getBody();    
    }
         
    @HttpGet 
    global static void doGet() {
        
        String type = RestContext.request.params.get('type');
        Boolean flat = RestContext.request.params.get('flat') == 'true' ? true : false;
        Boolean refresh = RestContext.request.params.get('refresh') == 'true' ? true : false; 
        System.debug('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> type: ' + type);
        System.debug('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> flat: ' + flat);
        System.debug('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> refresh: ' + refresh);
        String url = getBaseUrl();
        String jsonResponse = null;
        
        if (type == 'dataset') {
            String name = type + (flat == true ? '_flat' : '');
            jsonResponse = loadSharingCoverage(name, type);
            if (jsonResponse == null || refresh == true) {
                List<Object> records = null;
                if (flat == true) {
                    records = getDatasetSharingCoverageFlat();
                } else {
                    records = getDatasetSharingCoverage();
                }
                jsonResponse = JSON.serialize(records);
                storeSharingCoverage(name, type, jsonResponse);
            }
        } else if (type == 'sobject') {
            jsonResponse = getSObjects();
        }        

        RestResponse res = RestContext.response;
        res.addHeader('Content-Type', 'application/json');
        
        res.responseBody = Blob.valueOf(jsonResponse);
    }

    public class CoverageStat {
        public String name;
        public Integer value;
        public CoverageStat() {
        }
    }
               
    @HttpPost            
    global static String OLDgetCoverage(String type, Boolean refresh) { 
        refresh = refresh == true ? true : false;
        System.debug('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ refresh: ' + refresh);
        // Get the data/metadata from the query results. 
        final List<String> strings = new List<String>(); 
        final List<String> numbers = new List<String>(); 
        final List<Object> groupings = new List<String>();
        
        String jsonResponse = null;
        List<Object> records = null;
        DatasetSharingCoverageFlat datasetFlat = null;
        Integer count = 0;

        Integer eligible = 0;
        Integer notEligible = 0;
        
        if (type == 'dataset') {
            String name = type + '_flat';
            jsonResponse = loadSharingCoverage(name, type);
            if (jsonResponse == null || refresh == true) {
                records = getDatasetSharingCoverageFlat();
                jsonResponse = JSON.serialize(records);
                storeSharingCoverage(name, type, jsonResponse);
            } else {
                records = new List<Object>();
                JSONParser parser = JSON.createParser(jsonResponse);
                while (parser.nextToken() != null) {
                    if (parser.getCurrentToken() == JSONToken.START_ARRAY) {
                        while (parser.nextToken() != null) {
                            if (parser.getCurrentToken() == JSONToken.START_OBJECT) {
                                datasetFlat = (DatasetSharingCoverageFlat) parser.readValueAs(AnalyticsSharingCoverageController.DatasetSharingCoverageFlat.class);
                                records.add(datasetFlat);
                            }
                        }
                    }
                }
            }
        } else if (type == 'sobject') {
            jsonResponse = getSObjects();
        }                
        
        for (Object o : records) {
            datasetFlat = (DatasetSharingCoverageFlat) o;
            if (datasetFlat.eligibleSharingSource == true) {
                eligible++;
            } else {
                notEligible++;
            }
        }

        System.debug('eligible: ' + eligible);
        System.debug('notEligible: ' + notEligible);
/*
        List<CoverageStat> coverageStats = new List<CoverageStat>();
                
        CoverageStat stat = null;
        
        stat = new CoverageStat();
        stat.name = 'Covered';
        stat.value = eligible;
        coverageStats.add(stat);

        stat = new CoverageStat();
        stat.name = 'Not Covered';
        stat.value = notEligible;
        coverageStats.add(stat);  
              
        strings.add('name');
        
        numbers.add('value');
*/        
        
/*        
        for (Object o : records) {
            datasetFlat = (DatasetSharingCoverageFlat) o;
            if (datasetFlat.eligibleSharingSource == true) {
                datasetFlat.count = eligible;
            } else {
                datasetFlat.count = notEligible;
            }
        }
        
        List<Object> records = getDatasetSharingCoverageFlat();
*/
        
        /*
        strings.add('type');
        strings.add('sourceObjectNamespace');
        strings.add('sourceObjectName');
        strings.add('sourceObjectLabel');
        strings.add('securityField');
        strings.add('datasetLabel');
        strings.add('datasetId');
        strings.add('datasetVersionId');
        strings.add('datasetNamespace');
        */
                
        strings.add('datasetName');
        strings.add('eligibleSharingSource');
        
        numbers.add('eligibleSharingSourceNum');
        
        //groupings.add('count');
        groupings.add('securityField');
        
        //getQueryMetadata(strings, numbers, groupings, resultMap); 

        
        // Create an Object in the Apex step expected format. 
        ReturnMetadata rm = new ReturnMetadata(strings, numbers, groupings); 

        //return JSON.serialize(new PackagedReturnItem(coverageStats, rm)); 
        
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