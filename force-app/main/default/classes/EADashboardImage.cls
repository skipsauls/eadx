@RestResource(urlMapping='/eadashboardimg/*') 
global with sharing class EADashboardImage {
               
    @HttpGet
    global static String getImage() {

        //String url = RestContext.request.params.get('imgUrl');
        
        // FOR TESTING
        String url = 'https://adx-dev-ed.my.salesforce.com/services/data/v41.0/wave/lenses/0FK1I000000Du0wWAC/files/0FJ1I000000GrnWWAS';
        
        HttpRequest request = new HttpRequest();        
        Http http = new Http();
        request.setEndpoint(url);
        request.setMethod('GET');
        request.setHeader('Content-type', 'application/json');
        request.setHeader('Authorization', 'OAuth ' + UserInfo.getSessionId());
        //request.setBody('{"config":' + config + '}');
        
        HTTPResponse response = http.send(request);
        
        // 'object'is a reserved word, so 'theobject' needs to be used
        String body = response.getBody();
        
        //ReturnMetadata rm = new ReturnMetadata(strings, numbers, groupings);
        
        return body; //JSON.serialize(new PackagedReturnItem(records, rm)); 
    } 
}