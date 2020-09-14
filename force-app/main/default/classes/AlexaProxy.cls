@RestResource(urlMapping='/alexaproxy') 
global with sharing class AlexaProxy {

    @HttpGet
    global static void doGet() {        
        RestRequest req = RestContext.request;
        RestResponse res = RestContext.response;
        
        /*
        System.debug('baseUrl: ' + URL.getSalesforceBaseUrl());
        System.debug('hostname: ' + URL.getSalesforceBaseUrl().getHost());
        System.debug('path: ' + URL.getSalesforceBaseUrl().getPath());
        System.debug('port: ' + URL.getSalesforceBaseUrl().getPort());
        System.debug('protocol: ' + URL.getSalesforceBaseUrl().getProtocol());
        System.debug('query: ' + URL.getSalesforceBaseUrl().getQuery());
        System.debug('ref: ' + URL.getSalesforceBaseUrl().getRef());
        System.debug('externalForm: ' + URL.getSalesforceBaseUrl().toExternalForm());
        
        System.debug('requestUrl: ' + URL.getCurrentRequestUrl());
        System.debug('httpMethod: ' + req.httpMethod);        
        System.debug('resourcePath: ' + req.resourcePath);        
        System.debug('requestURI: ' + req.requestURI);
        System.debug('remoteAddress: ' + req.remoteAddress);
        */
        
        Map<String, String> params = req.params;
        String uri = params.get('proxy_uri');
        
        uri = uri.replace('%3F', '?');

        System.debug('uri: ' + uri);
                 
        String theUrl = URL.getSalesforceBaseUrl().toExternalForm() + uri;
        
        System.debug('theUrl: ' + theUrl);
        
        String delim = '?';
        for (String param: req.params.keySet()) {
            if (param != 'proxy_uri') {
                theUrl += delim + param + '=' + req.params.get(param);
                delim = '&';
            }
        }

        System.debug('theUrl: ' + theUrl);
        
        HttpRequest request = new HttpRequest();        
        Http http = new Http();
        request.setEndpoint(theUrl);
        request.setMethod('GET');
        for (String name: req.headers.keySet()) {
            System.debug('header: ' + name + ' = ' + req.headers.get(name));
            if (name.contains('X-Salesforce') != true) {
                request.setHeader(name, req.headers.get(name));
            }
        }
        
        request.setHeader('Content-type', 'application/json');
        request.setHeader('Authorization', 'Bearer ' + UserInfo.getSessionId()); //accessToken);
        
        HTTPResponse response = http.send(request);
        
        System.debug('response body: ' + response.getBody());
        
        String body = JSON.serialize(response.getBody());
        
        RestContext.response.addHeader('Content-Type', 'application/json');
        RestContext.response.responseBody = Blob.valueOf(response.getBody()); //body);        


        // Need to add the response details!!! 
        System.debug('Calling LogTransaction');
        LogTransaction(req, res);
        
 
    }
    
    global static void LogTransaction(RestRequest req, RestResponse res) {
    
        System.debug('LogTransaction called');
        Map<String, String> params = req.params;
        String uri = params.get('proxy_uri');
        
        String theUrl = URL.getSalesforceBaseUrl().toExternalForm() + uri;
    
        String delim = '?';
        for (String param: req.params.keySet()) {
            if (param != 'proxy_uri') {
                theUrl += delim + param + '=' + req.params.get(param);
                delim = '&';
            }
        }    
    
        VoiceTransaction__c vtx = new VoiceTransaction__c(
            Request_URL__c = URL.getCurrentRequestUrl().toExternalForm(),
            HTTP_Method__c = req.httpMethod,
            Remote_Address__c = req.remoteAddress,
            URI__c = uri,
            Proxied_Url__c = theUrl
        );
             
        System.debug('vtx: ' + vtx);
        
        String value = null;
        
        for (String name: req.headers.keySet()) {
            value = req.headers.get(name);
            System.debug('header: ' + name + ' = ' +value);
            if (name.equals('Amazon-Speaker-Id')) {
                vtx.Speaker_Id__c = value;
            } else if (name.equals('Amazon-Speaker-Confidence')) {
                vtx.Speaker_Confidence__c = Decimal.valueOf(value);
            } else if (name.equals('Amazon-Device-Id')) {
                vtx.Device_Id__c = value;
            } else if (name.equals('Amazon-User-Id')) {
                vtx.User_Id__c = value;
            } else if (name.equals('Amazon-Application-Id')) {
                vtx.Application_Id__c = value;
            } else if (name.equals('Amazon-Device-AudioPlayer')) {
                vtx.Audio__c = true;
            } else if (name.equals('Amazon-Device-Display')) {
                vtx.Display__c = true;
            } else if (name.equals('Amazon-Device-VideoApp')) {
                vtx.Video__c = true;
            } else if (name.equals('Amazon-Intent-Name')) {
                vtx.Intent_Name__c = value;
            } else if (name.equals('Amazon-Intent-Slots')) {
                vtx.Slot_Values__c = value;
            }
                
        }

        // Move mapping to logging step!!!!!
        List<VoiceMap__c> mapList = [SELECT Id,Name,Type__c,Value__c,User_Id__c,Vendor__c,Description__c,Alias__c FROM VoiceMap__c];
        Map<String, VoiceMap__c> mapping = new Map<String, VoiceMap__c>();
        for (VoiceMap__c item : mapList) {
            mapping.put(item.Value__c, item);
        }
        
        VoiceMap__c item = null;
        Boolean dirty = false;
        item = mapping.get(vtx.Application_Id__c);
        if (item != null) {
            vtx.Application_Alias__c = item.Alias__c;
        }                
        item = mapping.get(vtx.Device_Id__c);
        if (item != null) {
            vtx.Device_Alias__c = item.Alias__c;
        }                
        item = mapping.get(vtx.User_Id__c);
        if (item != null) {
            vtx.User_Alias__c = item.Alias__c;
        }                
        item = mapping.get(vtx.Speaker_Id__c);
        if (item != null) {
            vtx.Speaker_Alias__c = item.Alias__c;
        }                

        System.debug('vtx: ' + vtx);
        
        UPSERT vtx;
    
    }
    
    @AuraEnabled
    public static List<VoiceTransaction__c> getVoiceTransactions() {
        List<VoiceTransaction__c> transactions  = [SELECT Id,Name,Request_URL__c,HTTP_Method__c,Remote_Address__c,URI__c,Proxied_Url__c,Device_Id__c,Application_Id__c,User_Id__c,Speaker_Id__c,Speaker_Confidence__c,Device_Alias__c,Application_Alias__c,User_Alias__c,Speaker_Alias__c,Audio__c,Video__c,Display__c,Intent_Name__c,Slot_Values__c,LastModifiedBy.Id,LastModifiedBy.Username,LastModifiedDate,CreatedDate FROM VoiceTransaction__c ORDER BY CreatedDate DESC];        
        return transactions;        
    }
    
}