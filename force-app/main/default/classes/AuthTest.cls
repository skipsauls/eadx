global with sharing class AuthTest {

    global static String token = 'FOO';

    global static String getToken() {
        return token;
    }
    
    global static String getOAuthAccessToken() {

        token = 'NOT_SET';
        
        String clientId = 'XXXXXXXXXXXXX';
        String clientSecret = 'XXXXXXXXXXXXX';
        String username = 'demo@demo.com';
        String password = 'XXXXXXXXXXXXX';
        String securityToken = 'XXXXXXXXXXXXXXXXX';
        
        String config = 'grant_type=password';
        config += '&client_id=' + clientId;
        config += '&client_secret=' + clientSecret;
        config += '&username=' + username;
        config += '&password=' + password;// + securityToken;
        
        System.debug('config: ' + config);
       
        String url = 'https://login.salesforce.com/services/oauth2/token';
        
        HttpRequest request = new HttpRequest();        
        Http http = new Http();
        request.setEndpoint(url);
        request.setMethod('POST');
        request.setHeader('Content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        request.setHeader('Accept', 'application/json');
        //request.setHeader('Authorization', 'Basic ' + auth);
        request.setBody(config);
        
        HTTPResponse response = http.send(request);
        
        String body = response.getBody();
        
        System.debug('body: ' + body);

        Map<String, Object> m = (Map<String, Object>) JSON.deserializeUntyped(body);
        
        String accessToken = (String) m.get('access_token');
                    
        System.debug('accessToken: ' + accessToken);
        
        return accessToken;
    }
    
    global static void getAccessTokenVF() {
        getOAuthAccessToken();
    }
    
    @AuraEnabled
    global static String getAccessToken() {
        return getOAuthAccessToken();
    }
    
}