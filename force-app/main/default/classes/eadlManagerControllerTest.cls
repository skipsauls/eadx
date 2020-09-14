@IsTest(SeeAllData=true)
private class eadlManagerControllerTest {
    
    static String namespacePrefix = 'eadx';
    static String developerName = 'Mortgage_Calculator';
    static String templateApiName = namespacePrefix + '__' + developerName;
    
    static testMethod void positiveTests() {
        
        System.debug('Calling eadlManagerController.queryEmbeddedApp with templateApiName: ' + templateApiName);
        
        Folder app = eadlManagerController.queryEmbeddedApp(templateApiName);
        
        System.debug('app: ' + app);
        
        System.assertEquals(app.NamespacePrefix, namespacePrefix);
        System.assertEquals(app.DeveloperName, developerName);
        
        
        
        System.debug('Calling eadlManagerController.getEmbeddedApp with templateApiName: ' + templateApiName);
        
        String appJson = eadlManagerController.getEmbeddedApp(templateApiName);

        System.debug('appJson: ' + appJson);
        
        app = (Folder) JSON.deserializeStrict(appJson, Folder.class);

        System.debug('app: ' + app);
        
        System.assertEquals(app.NamespacePrefix, namespacePrefix);
        System.assertEquals(app.DeveloperName, developerName);
        

        
        System.debug('Calling eadlManagerController.getAutoInstallRequestsByTemplateApiName with templateApiName: ' + templateApiName);
        
        String requestJson = eadlManagerController.getAutoInstallRequestsByTemplateApiName(templateApiName);
        
        System.debug('requestJson: ' + requestJson);
        
        WaveAutoInstallRequest request = (WaveAutoInstallRequest) JSON.deserializeStrict(requestJson, WaveAutoInstallRequest.class);
        
        System.debug('request: ' + request);
        
        System.assertEquals(request.TemplateApiName, templateApiName);
        //System.assertEquals(request.DeveloperName, developerName);
        
    }
    
    static testMethod void negativeTests() {
        String badTemplateApiName = 'bad__Non_Existent_Template';

        System.debug('Calling eadlManagerController.createEmbeddedApp with badTemplateApiName: ' + badTemplateApiName);

        
        String name = 'Negative test - bad templateApiName';
       	
        Map<String, Object> appConfiguration = new Map<String, Object>();
        
		String id = eadlManagerController.createEmbeddedApp(badTemplateApiName, name, appConfiguration);

        System.debug('id: ' + id);
        
        System.assertNotEquals(null, id);
        
        
        System.debug('Calling eadlManagerController.deleteEmbeddedApp with badTemplateApiName: ' + badTemplateApiName);
        
        String resp = eadlManagerController.deleteEmbeddedApp(badTemplateApiName);
        
        System.debug('resp: ' + resp);
        
        System.assertEquals(resp, '{"Error":"Embedded App for Template ' + badTemplateApiName + ' not found"}');
            
    }
}