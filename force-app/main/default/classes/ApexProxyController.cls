@RestResource(urlMapping='/apexproxy/*') 
global with sharing class ApexProxyController {
               
    @HttpPost            
    global static String proxy(String config) {

        String url = 'https://localhost:3001/apexstep';
        
        HttpRequest request = new HttpRequest();        
        Http http = new Http();
        request.setEndpoint(url);
        request.setMethod('POST');
        request.setHeader('Content-type', 'application/json');
        //request.setHeader('Authorization', 'OAuth ' + UserInfo.getSessionId());
        request.setBody('{"config":' + config + '}');
        
        HTTPResponse response = http.send(request);
        
        // 'object'is a reserved word, so 'theobject' needs to be used
        String body = response.getBody();
        
        //ReturnMetadata rm = new ReturnMetadata(strings, numbers, groupings);
        
        return body; //JSON.serialize(new PackagedReturnItem(records, rm)); 
    } 
}