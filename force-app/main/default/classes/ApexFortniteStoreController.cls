@RestResource(urlMapping='/apexfortnitestore/*') 
global with sharing class ApexFortniteStoreController {

    // 24 hour default timeout
    private static Long cache_timeout = 86400000;
    
    private static String ForniteTrackerKey = '6a0ab664-15e1-4c2d-98c5-c5d7e69a2ea1';
    private static String FortniteApiKey = '50eb1016d2332fcd0a9bbca4ee36b51d';
    
    /* Fortnite API version */
    @AuraEnabled
    @HttpPost
    global static String getStore(Boolean refresh) {
            
        String url = 'https://fortnite-public-api.theapinetwork.com/prod09/store/get';
    
        Fortnite_API_Cache__c cache = null;
        String cacheId = null;
        
        try {
            cache = [SELECT Id, Name, url__c, body__c, LastModifiedDate FROM Fortnite_API_Cache__c WHERE url__c =: url LIMIT 1];
            cacheId = cache.Id;
            if (DateTime.now().getTime() > (cache.LastModifiedDate.getTime() + cache_timeout)) {
                cache = null;
            }
        } catch (Exception e) {
            System.debug('Exception: ' + e);
            cache = null;
        }

        //System.debug('cache: ' + cache);
        if (cache == null || refresh == true) {
        
            HttpRequest request = new HttpRequest();        
            Http http = new Http();
            request.setEndpoint(url);
            request.setMethod('POST');
            request.setHeader('Content-type', 'application/json');
            request.setHeader('Authorization', FortniteApiKey);
            request.setBody('');
            
            HTTPResponse response = http.send(request);
    
            String body = response.getBody();                    
    
            //System.debug('------------------------------------------------------> updating cache with body: ' + body);

            cache = new Fortnite_API_Cache__c();
            cache.Id = cacheId;
            cache.body__c = body;
            cache.url__c = url;
            
            UPSERT cache;
            
            return body;
        } else {
            //System.debug('------------------------------------------------------> returning from cache body: ' + cache.body__c);
            return cache.body__c;
        }
    }
    
    /* Fortnite Tracker version */
    @AuraEnabled
    global static String getFortniteTrackerStore() {
    
        String url = 'https://api.fortnitetracker.com/v1/store';
        
        HttpRequest request = new HttpRequest();        
        Http http = new Http();
        request.setEndpoint(url);
        request.setMethod('GET');
        request.setHeader('Content-type', 'application/json');
        request.setHeader('TRN-Api-Key', '6a0ab664-15e1-4c2d-98c5-c5d7e69a2ea1');
        
        HTTPResponse response = http.send(request);

        String body = response.getBody();                    

        System.debug('------------------------------------------------------> body: ' + body);

        //Map<String, Object> m = (Map<String, Object>) JSON.deserializeUntyped(body);

        //System.debug('map: ' + m);
        
        return body;

    }
    
}