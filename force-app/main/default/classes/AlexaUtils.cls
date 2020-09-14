@RestResource(urlMapping='/alexa/*') 
global with sharing class AlexaUtils {

    global static String ns = null;
    
    static {
        ApexClass ac = [SELECT NameSpacePrefix FROM ApexClass WHERE Name = 'AlexaUtils'];
        ns = ac.NamespacePrefix;
    }
    
    @HttpGet
    global static void doGet() {
        RestRequest req = RestContext.request;
        RestResponse res = RestContext.response;

        System.debug('ns: ' + ns);
        System.debug('resourcePath: ' + req.resourcePath);        
        System.debug('requestURI: ' + req.requestURI);
        
        String path = req.requestURI.replace('/' + ns + '/alexa/', '');
        System.debug('path: ' + path);
        
        List<String> pathParams = path.split('/');
        System.debug('pathParams: ' + pathParams);

        Map<String, String> params = req.params;
        for (String key : params.keySet()) {
            System.debug('param - ' + key + ': ' + params.get(key));
        }
        
        Map<String, Object> response = new Map<String, Object>();
        
        if (pathParams.get(0) == 'resourceurl') {
            String name = params.get('name');
            if (name != null) {
                String resURL = getResourceURL(name);
                response.put('url', resURL);
            }
        }
        
        
        String body = JSON.serialize(response);
        
        RestContext.response.addHeader('Content-Type', 'application/json');
        RestContext.response.responseBody = Blob.valueOf(body);          
    }
    
    public static String getResourceURL(String resourceName) {
        
        List<StaticResource> resourceList = [
           SELECT Name, NamespacePrefix, SystemModStamp 
           FROM StaticResource 
           WHERE Name = :resourceName
        ];
                            
        if (resourceList.size() == 1) {
           String namespace = resourceList[0].NamespacePrefix;
           return '/resource/' 
              + resourceList[0].SystemModStamp.getTime() + '/' 
              + (namespace != null && namespace != '' ? namespace + '__' : '') 
              + resourceName; 
        } else return '';
        
    }    
}