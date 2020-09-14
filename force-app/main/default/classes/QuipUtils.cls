global with sharing class QuipUtils {
   static String accessToken = 'XXXXXXXXXXXXXX';

    global static String getURL(String url) {
        System.debug('getURL: ' + url);
        
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


    global static String getUsers(List<String> ids) {    
        return getList('users', ids);
    }
    
    global static String getFolders(List<String> ids) {
        return getList('folders', ids);    
    }

    global static String getThreads(List<String> ids) {
        return getList('threads', ids);    
    }

    global static String getBlob(String threadId, String blobId) {
        String url = 'https://platform.quip.com/1/blob/' + threadId + '/';// + blobId;
        return getURL(url);
    }
    
    global static String getRecentThreads() {
    
        String url = 'https://platform.quip.com/1/threads/recent';
        //System.debug('url: ' + url);
        
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