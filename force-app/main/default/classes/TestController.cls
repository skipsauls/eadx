global class TestController {


    @AuraEnabled
    global static String getDashboards() {
        
        String url = 'https://adx-dev-ed.my.salesforce.com/services/data/v40.0/wave/dashboards';
        
        HttpRequest req = new HttpRequest();
                    
        req.setMethod('GET');
        req.setEndpoint(url);
        req.setHeader('Content-type', 'application/json');
        req.setHeader('Authorization', 'OAuth ' + UserInfo.getSessionId());       
        req.setHeader('Authorization', 'Bearer ' + UserInfo.getSessionID());
                
        //req.setHeader('Authorization', 'Bearer ' + quipAccessToken);                 
        //req.setBody(content);
        
        Http http = new Http();

        HTTPResponse res = http.send(req);

        String resp = res.getBody();
        
        System.debug('response: ' + resp);
                
        return resp;
    }
}