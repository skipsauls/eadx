// Here is a sample of a controller to get bindable stock data in a dashboard:

@RestResource(urlMapping='/covfefe/*')
global with sharing class SharingCoverageController {

    global static String sobjectPartialUrl = '/sobjects';
    global static String datasetPartialUrl = '/wave/datasets';
    
    @HttpGet 
    global static String sharingCoverage() {
    
        String type = RestContext.request.params.get('type');
        
        String url = System.Url.getSalesforceBaseURL().toExternalForm();
        
        if (type == 'dataset') {
            url += datasetPartialUrl;
        } else if (type == 'sobject') {
            url += sobjectPartialUrl;

        }
        
        HttpRequest request = new HttpRequest();
        Http http = new Http();
        request.setEndpoint(url);
        request.setMethod('GET');
        request.setHeader('Content-type', 'application/json');
        request.setHeader('Authorization', 'OAuth ' + UserInfo.getSessionId());        

        HTTPResponse response = http.send(request);

        return JSON.serialize(response.getBody());
/*        
        String url = '/wave/security/coverage/datasets/' + id + '/versions/" + resource.currentVersionId;
        
        
        
        
        try {
            HTTPResponse response = http.send(request);
            JSONParser parser = JSON.createParser(response.getBody());
            
            while (parser.nextToken() != null) {
                if (parser.getCurrentToken() == JSONToken.START_OBJECT) {
                    StockResponse responseObject = (StockResponse)parser.readValueAs(StockResponse.class);
                    
                    List<ReturnItem> returnItems = new List<ReturnItem>();
                    Integer i = 0;
                    for (String curDate : responseObject.dates) {
                        returnItems.add(new ReturnItem(curDate, responseObject.elements.get(0).dataSeries.close.values.get(i++)));
                    }
                    
                    return JSON.serialize(new PackagedReturnItem(returnItems));
                }
            }
        } catch(Exception exp) {
            System.debug('exception '+exp);
        }
        
        return '';
*/        
    }
    
    public class StockResponse {
        
        public List<String> dates;
        public List<StockResponseElement> elements;
        
        public StockResponse(List<String> dates, List<StockResponseElement> elements) {
            this.dates = dates;
            this.elements = elements;
        }
        
    }
    
    public class StockResponseElement {
    
        public String type;
        public StockResponseDataSeries dataSeries;
        
        public StockResponseElement(String type, StockResponseDataSeries dataSeries) {
            this.type = type;
            this.dataSeries = dataSeries;
        }
    
    }
    
    public class StockResponseDataSeries {
    
        public StockResponseDataSeriesValues close;
        
        public StockResponseDataSeries(StockResponseDataSeriesValues close) {
            this.close = close;
        }
    
    }
    
    public class StockResponseDataSeriesValues {
    
        public List<Double> values;
        
        public StockResponseDataSeriesValues(List<Double> values) {
            this.values = values;
        }
    
    }
    
    public class ReturnItem {
        
        public String dateString;
        public Double value;
        
        public ReturnItem(String dateString, Double value) {
            this.dateString = dateString;
            this.value = value;
        }
        
    }
    
    public class ReturnMetadata {
    
        public List<String> strings;
        public List<String> numbers;
        public List<String> groups;
        
        public ReturnMetadata(List<String> strings, List<String> numbers, List<String> groups) {
            this.strings = strings;
            this.numbers = numbers;
            this.groups = groups;
        }
    
    }
    
    public class PackagedReturnItem {
    
        public List<ReturnItem> data;
        public ReturnMetadata metadata;
        
        public PackagedReturnItem(List<ReturnItem> data) {
            this.data = data;
            this.metadata = new ReturnMetadata(new List<String>{'dateString'}, new List<String>{'value'}, new List<String>());
        } 
    
    }
    
}