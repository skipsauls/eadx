global with sharing class AmazonItemLookupController {
    @AuraEnabled
    global static String getItem(String asin) {
    
        String url = 'https://analytics-ltngout-playground.herokuapp.com/amazon/item/lookup/' + asin;
        System.debug('url: ' + url);
        
        HttpRequest request = new HttpRequest();        
        Http http = new Http();
        request.setEndpoint(url);
        request.setMethod('GET');
        request.setHeader('Content-type', 'application/json');
        //request.setHeader('Authorization', 'Bearer ' + accessToken);
        
        HTTPResponse response = http.send(request);

        String body = response.getBody();                    

        return body;
    }
    
}