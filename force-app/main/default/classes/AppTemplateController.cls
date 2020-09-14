global with sharing class AppTemplateController {
       
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
               
    @AuraEnabled
    global static String listAppTemplates() {
        String url = getBaseUrl() + '/wave/templates?type=app';        
        HttpRequest request = new HttpRequest();        
        Http http = new Http();
        request.setEndpoint(url);
        request.setMethod('GET');
        request.setHeader('Content-type', 'application/json');
        request.setHeader('Authorization', 'OAuth ' + UserInfo.getSessionId());        
        HTTPResponse response = http.send(request);
        return response.getBody(); 
    }
}