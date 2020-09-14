global with sharing class ListAnalyticsDashboardsAction {

    public class Dashboard {
        @InvocableVariable
        public String name;
        @InvocableVariable
        public String id;
    }
    
    @InvocableMethod(label='List Analytics Dashboards' description='Lists the Analytics Dashboards.')
    public static List<ListAnalyticsDashboardsAction.Dashboard> getDashboards(List<String> criteria) {

        Integer resultLimit = 20;
        String query = String.join(criteria, ' ');
        List<ListAnalyticsDashboardsAction.Dashboard> dashboards = new List<ListAnalyticsDashboardsAction.Dashboard>();
    
        //Make sure your Salesforce instance URL is added in remote site settings
        String sfdcURL = URL.getSalesforceBaseUrl().toExternalForm(); 
        String restAPIURL = sfdcURL + '/services/data/v43.0/wave/dashboards?pageSize='+ resultLimit +'&q=' + 
            EncodingUtil.urlEncode(query, 'UTF-8');  
        System.Debug('Url: '+ restAPIURL);
        HttpRequest httpRequest = new HttpRequest();  
        httpRequest.setMethod('GET');   
        httpRequest.setHeader('Authorization', 'OAuth ' + UserInfo.getSessionId());        
        httpRequest.setHeader('Authorization', 'Bearer ' + UserInfo.getSessionID()); 
        httpRequest.setEndpoint(restAPIURL);  
        try {  
             Http http = new Http();   
             HttpResponse httpResponse = http.send(httpRequest);  
             if (httpResponse.getStatusCode() == 200 ) {  
                 Map<String, Object> response = (Map<String, Object>)JSON.deserializeUntyped(httpResponse.getBody());  
                 List<Object> dashboardList = (List<Object>)response.get('dashboards');
                 Map<String, Object> dashboardMap = null;
                 ListAnalyticsDashboardsAction.Dashboard dashboard = null;
                 for (Object dashboardObj: dashboardList) {
                     dashboardMap = (Map<String, Object>) dashboardObj;
                     dashboard = new ListAnalyticsDashboardsAction.Dashboard();
                     dashboard.name = (String) dashboardMap.get('name');
                     dashboard.id = (String) dashboardMap.get('id');
                     dashboards.add(dashboard);
                 }
            
             } else {  
                 System.debug(' httpResponse ' + httpResponse.getBody() );  
                 //throw new CalloutException( httpResponse.getBody() );  
             }   
        } catch( System.Exception e) {  
             System.debug('ERROR: '+ e);  
             throw e;  
        }
                    
        
        return dashboards;
    }
}