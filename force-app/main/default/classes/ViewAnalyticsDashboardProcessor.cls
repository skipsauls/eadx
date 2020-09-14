public class ViewAnalyticsDashboardProcessor
extends ActionProcessor{
    public override CommandAction getCommandAction(String requestedPhrase, String actionType, Command command, Integer resultLimit){
        String criteria = getPhraseAfterKeyword(requestedPhrase, 'Dashboard');
         if (null == criteria){
            return new CommandAction(CommandAction.ResultStatus.FAIL_NOT_ENOUGH_INFO, actionType, null);
        }
        //Make sure your Salesforce instance URL is added in remote site settings
        String sfdcURL = URL.getSalesforceBaseUrl().toExternalForm(); 
        String restAPIURL = sfdcURL + '/services/data/v43.0/wave/dashboards?pageSize='+ resultLimit +'&q=' + 
            EncodingUtil.urlEncode(criteria, 'UTF-8');  
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
                 Map<String, Object> response = 
                     (Map<String, Object>)JSON.deserializeUntyped(httpResponse.getBody());  
                 List<Object> dashboards = (List<Object>)response.get('dashboards');
                 return new CommandAction(CommandAction.ResultStatus.SUCCESS, actionType, dashboards);
                 
             } else {  
                 System.debug(' httpResponse ' + httpResponse.getBody() );  
                 throw new CalloutException( httpResponse.getBody() );  
             }   
        } catch( System.Exception e) {  
             System.debug('ERROR: '+ e);  
             throw e;  
        }  
    }
}