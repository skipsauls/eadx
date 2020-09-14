global with sharing class AppExController {

    @AuraEnabled
    global static String listApps() {
        
        //String url = 'https:EncodingUtil.urlEncode('https://api.appexchange.salesforce.com/services/apexrest/v1/listings?type=apps&lang=en_US', 'UTF-8');
        
        //String url = 'https://api.appexchange.salesforce.com//services/apexrest/v1/listings?type=Apps&sort=8&keywords=Einstein%20Analytics&lang=en_US';
        
        String url = 'https://api.appexchange.salesforce.com/services/apexrest/v1/listings?type=apps&lang=en_US&offset=5';
        //String url = 'https://api.appexchange.salesforce.com/services/apexrest/v1/listings?type=apps&lang=en_US&offset=5'; //&keywords=analytics';
       
        //String url = 'https://api.appexchange.salesforce.com/services/apexrest/v1/listings?type=components&filter=8&lang=en_US';

        System.debug('                                                   url: ' + url);
 
        //String encoded = EncodingUtil.urlEncode(url, 'UTF-8');
                       
        //System.debug('              encoded: ' + encoded);
        
        //url = encoded;

        System.debug('                                                   url: ' + url);
        
        HttpRequest request = new HttpRequest();        
        Http http = new Http();
        request.setEndpoint(url);
        request.setMethod('GET');
        request.setHeader('Content-type', 'application/json');
        request.setHeader('Accept', 'application/json');
        //request.setHeader('Authorization', 'Bearer ' + accessToken);
        
        HTTPResponse response = http.send(request);

        String body = response.getBody();
        return body;
    }
}