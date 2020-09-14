global with sharing class ApexTwitterUtils {

    @AuraEnabled
    global static String fireEvent(String type, String target, String payload) {

        EinsteinAnalyticsEvent__e event = new EinsteinAnalyticsEvent__e();
        event.type__c = type;
        event.target__c = target;
        event.payload__c = payload;
        
        EventBus.publish(event);
        
        String ret = 'foo';
        return ret;    
    }
    
    global static String getBearerToken(Boolean refresh) {
    
        Token__c token = [SELECT Id,Name,ConsumerKey__c,ConsumerSecret__c,TokenType__c,AccessToken__c,RefreshToken__c,Expires__c FROM Token__c WHERE Name = 'Twitter'];
        
        if (token.AccessToken__c != null && refresh != true) {
            return token.AccessToken__c;
        } else {
            
            String authString = token.ConsumerKey__c + ':' + token.ConsumerSecret__c;
    
            Blob authBlob = Blob.valueOf(authString);
            
            String auth = EncodingUtil.base64Encode(authBlob);
            
            String url = 'https://api.twitter.com/oauth2/token';
            
            HttpRequest request = new HttpRequest();        
            Http http = new Http();
            request.setEndpoint(url);
            request.setMethod('POST');
            request.setHeader('Content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
            request.setHeader('Authorization', 'Basic ' + auth);
            request.setBody('grant_type=client_credentials');
            
            HTTPResponse response = http.send(request);
            
            String body = response.getBody();                    
    
            Map<String, Object> m = (Map<String, Object>) JSON.deserializeUntyped(body);
            
            String accessToken = (String) m.get('access_token');
                        
            token.AccessToken__c = accessToken;
            
            upsert token;
            
            return accessToken;
        }
    }
    
        
    // Map for looking up the Month by name from Twitter dates
    global static Map<String, Integer> MonthMap = new Map<String, Integer>{
        'Jan'=>1,'Feb'=>2,'Mar'=>3,'Apr'=>4,'May'=>5,'Jun'=>6,'Jul'=>7,'Aug'=>8,'Sep'=>9,'Oct'=>10,'Nov'=>11,'Dec'=>12
    };
    
    @AuraEnabled
    global static String getAppRateLimit(String resources) {
    
        if (resources == null) {
            resources = 'statuses';
        }
        
        String url = 'https://api.twitter.com/1.1/application/rate_limit_status.json?resources=' + resources;

        System.debug('------------------------------------------------------> url: ' + url);
            
        String accessToken = ApexTwitterUtils.getBearerToken(false);
    
        HttpRequest request = new HttpRequest();        
        Http http = new Http();
        request.setEndpoint(url);
        request.setMethod('GET');
        request.setHeader('Content-type', 'application/json');
        request.setHeader('Authorization', 'Bearer ' + accessToken);
        
        HTTPResponse response = http.send(request);

        String body = response.getBody();                    
        
        return body;
    
    }
    
    @AuraEnabled
    global static void updateApexStepList(String name, List<String> items) {
    
        ApexStepList__c l = null;
        String itemString = String.join(items, ',');
        
        try {
            l = [SELECT Id, Name__c, Items__c FROM ApexStepList__c WHERE Name__c =: name];
        } catch (Exception e) {
            l = new ApexStepList__c();
            l.Name__c = name;
        }
        
        l.Items__c = itemString;
        
        UPSERT l;
    }

    @AuraEnabled
    global static void deleteApexStepList(String name, List<String> items) {
    
        ApexStepList__c l = null;
        String itemString = String.join(items, ',');
        
        try {
            l = [SELECT Id, Name__c, Items__c FROM ApexStepList__c WHERE Name__c =: name];
            DELETE l;
        } catch (Exception e) {
        }
    }
    
    @AuraEnabled
    global static List<String> listApexStepLists() {
        List<ApexStepList__c> items = [SELECT Id, Name__c FROM ApexStepList__c];
        List<String> l = new List<String>();
        for (ApexStepList__c item : items) {
            l.add(item.Name__c);
        }
        
        return l;
    }

    @AuraEnabled
    global static List<String> getApexStepListItems(String name) {
        List<String> items = new List<String>();
        try {
            ApexStepList__c l = [SELECT Id, Name__c, Items__c FROM ApexStepList__c WHERE Name__c =: name];
            items = l.Items__c.split(',');
        } catch (Exception e) {
        }
        return items;
    }
        

    @AuraEnabled
    global static ApexStepList__c getApexStepList(String name) {
        ApexStepList__c l = [SELECT Id, Name__c, Items__c FROM ApexStepList__c WHERE Name__c =: name];
        
        return l;
    }
        
}