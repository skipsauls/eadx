global with sharing class eadlManagerController {

    global static Folder queryEmbeddedApp(String templateApiName) {
        Folder app = null;
        
        try {
            app = [SELECT AccessType, CreatedBy.Name, CreatedDate, DeveloperName,
                   Id, IsReadonly, LastModifiedById, LastModifiedDate, Name,
                   NamespacePrefix, ParentId, Type
                   FROM Folder
                   WHERE Type = 'Insights' AND
                   Id IN (SELECT FolderId FROM WaveAutoInstallRequest
                          WHERE RequestStatus = 'Success'
                          AND TemplateApiName =: templateApiName)
                   LIMIT 1];
        } catch (Exception e) {
          	System.debug('Exception: ' + e);
        }
        
        return app;        
    }
    
	@AuraEnabled
    global static String getEmbeddedApp(String templateApiName) {
        
        Folder app = queryEmbeddedApp(templateApiName);
        
        String response = null;
        
        if (app != null) {
			response = JSON.serialize(app);            
	    } else {
            response = '{"Error":"Embedded App for Template ' + templateApiName + ' not found"}';
        }
        
        return response;
    }

    @AuraEnabled
    global static String getAutoInstallRequestsByTemplateApiName(String templateApiName) {
        WaveAutoInstallRequest request = [SELECT Id, Name, CreatedDate, CreatedBy.Name,
                                          LastModifiedDate, LastModifiedBy.Name, FolderId,
                                          Folder.Name, RequestType, 
                                          FailedReason, RequestStatus, TemplateApiName, 
                                          TemplateVersion, RequestLog 
                                          FROM WaveAutoInstallRequest
                                          WHERE TemplateApiName =: templateApiName
                                          ORDER BY LastModifiedDate DESC
                                          LIMIT 1];
        
        return JSON.serialize(request);
    }
    
    @AuraEnabled
    global static String deleteEmbeddedApp(String templateApiName) {
        
        Folder app = queryEmbeddedApp(templateApiName);

        String response = null;
        
        if (app != null) {
            WaveAutoInstallRequest delRequest = new WaveAutoInstallRequest();
            delRequest.put('Name', app.Name + ' (' + templateApiName + ') WaveAppDelete request');
            delRequest.put('RequestStatus', 'Enqueued');
            delRequest.put('FolderId', app.Id);
            delRequest.put('RequestType', 'WaveAppDelete');
            insert delRequest;
            response = JSON.serialize(delRequest.Id);
        } else {
            response = '{"Error":"Embedded App for Template ' + templateApiName + ' not found"}';
        }
        
        return response;
    }

    @AuraEnabled
    global static String createEmbeddedApp(String templateApiName, String name, Map<String, Object> appConfiguration) {
        
        Map<String, Object> configuration = new Map<String, Object>();
        
        configuration.put('appConfiguration', appConfiguration);
        
        WaveAutoInstallRequest newRequest = new WaveAutoInstallRequest();
        newRequest.put('Name', name + ' (' + templateApiName + ') WaveAppCreate request');
        newRequest.put('TemplateApiName', templateApiName);
        newRequest.put('RequestStatus', 'Enqueued');
        newRequest.put('RequestType', 'WaveAppCreate');
        newRequest.put('Configuration', JSON.serialize(configuration));
        insert newRequest;
        
        return JSON.serialize(newRequest.Id);
    }
}