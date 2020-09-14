@RestResource(urlMapping='/quip/*') 
global with sharing class QuipDemoController {

    static String accessToken = 'XXXXXXXXXXXXXX';

    @AuraEnabled
    global static String getURL(String url) {
        System.debug('url: ' + url);
        
        HttpRequest request = new HttpRequest();        
        Http http = new Http();
        request.setEndpoint(url);
        request.setMethod('GET');
        request.setHeader('Content-type', 'application/json');
        request.setHeader('Authorization', 'Bearer ' + accessToken);
        
        HTTPResponse response = http.send(request);

        String body = response.getBody();
        
        System.debug('body: ' + JSON.serialize(body));

        return body;    
    }
        
    @AuraEnabled    
    global static String getList(String type, List<String> ids) {
        System.debug('getList');
        System.debug('type: ' + type);
        System.debug('ids: ' + ids);
        
        String url = 'https://platform.quip.com/1/' + type;
        
        if (ids != null) {
            url += '/';
            if (ids.size() == 1) {
                url += ids.get(0);
            } else if (ids.size() > 1) {
                url += '?ids=';
                String delim = '';
                for (String id : ids) {
                    url += delim + id;
                    delim = ',';
                }
            }
        }

        return getURL(url);                            
    }
    
    @HttpGet
    global static void doGet() {
        
        RestRequest req = RestContext.request;
        RestResponse res = RestContext.response;
        String type = RestContext.request.params.get('type');
        
        res.addHeader('Content-Type', 'application/json');
        System.debug('doGet - type: ' + type);
        if (type == 'recent') {
            //return getRecentThreads();
            String val = getRecentThreads();
            res.statusCode = 200;
            res.responseBody = Blob.valueOf(val);
        } else {
            type = type == 'user' ? 'users' : type;
            type = type == 'thread' ? 'threads' : type;
            type = type == 'folder' ? 'folders' : type;
            String idsParam = RestContext.request.params.get('ids');
            List<String> ids = idsParam.split(',');
            String val = getList(type, ids);
            res.statusCode = 200;
            res.responseBody = Blob.valueOf(val);            
        }
    }

    @AuraEnabled
    global static String getUsers(List<String> ids) {    
        return getList('users', ids);
    }
    
    @AuraEnabled
    global static String getFolders(List<String> ids) {
        return getList('folders', ids);    
    }

    @AuraEnabled
    global static String getThreads(List<String> ids) {
        return getList('threads', ids);    
    }

    @AuraEnabled
    global static String getBlob(String threadId, String blobId) {
        String url = 'https://platform.quip.com/1/blob/' + threadId + '/';// + blobId;
        return getURL(url);
    }
    
    @AuraEnabled
    global static String getRecentThreads() {
    
        String url = 'https://platform.quip.com/1/threads/recent';
        System.debug('url: ' + url);
        
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
    
   
}