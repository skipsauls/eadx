global with sharing class eadlMonitorController {

	@AuraEnabled
    global static String listEmbeddedApps() {
        List<Folder> apps = [SELECT AccessType, CreatedBy.Name, CreatedDate, DeveloperName,
                             Id, IsReadonly, LastModifiedById, LastModifiedDate, Name,
                             NamespacePrefix, ParentId, Type
                             FROM Folder
                             WHERE Type = 'Insights' AND
                             Id IN (SELECT FolderId FROM WaveAutoInstallRequest WHERE RequestStatus = 'Success')];
        
        return JSON.serialize(apps);
    }

    @AuraEnabled
    global static String listEmbeddedAppTemplates() {
        List<WaveTemplate> templates = [SELECT AssetIcon, AssetVersion, CreatedBy.Name, CreatedDate,
                                        DeveloperName, Id, NamespacePrefix, TemplateBadgeIcon,
                                        TemplateDetailIcon, TemplateType, MasterLabel
                                        FROM WaveTemplate
                                      	WHERE TemplateType = 'EmbeddedApp'];
        
        return JSON.serialize(templates);
    }
        
    @AuraEnabled
    global static String listAutoInstallRequests() {
        List<WaveAutoInstallRequest> requests  = [SELECT Id, Name, CreatedDate, CreatedBy.Name,
                                                  LastModifiedDate, LastModifiedBy.Name, FolderId,
                                                  Folder.Name, RequestType, 
                                                  FailedReason, RequestStatus, TemplateApiName, 
                                                  TemplateVersion, RequestLog 
                                                  FROM WaveAutoInstallRequest 
                                                  ORDER BY LastModifiedDate DESC];
        
        return JSON.serialize(requests);
    }

    @AuraEnabled
    global static String listAutoInstallRequestsById(String requestId) {
        List<WaveAutoInstallRequest> requests  = [SELECT Id, Name, CreatedDate, CreatedBy.Name,
                                                  LastModifiedDate, LastModifiedBy.Name, FolderId,
                                                  Folder.Name, RequestType, 
                                                  FailedReason, RequestStatus, TemplateApiName, 
                                                  TemplateVersion, RequestLog 
                                                  FROM WaveAutoInstallRequest
                                                  WHERE Id =: requestId
                                                  ORDER BY LastModifiedDate DESC];
        
        return JSON.serialize(requests);
    }

    @AuraEnabled
    global static String listAutoInstallRequestsByTemplateApiName(String templateApiName) {
        List<WaveAutoInstallRequest> requests  = [SELECT Id, Name, CreatedDate, CreatedBy.Name,
                                                  LastModifiedDate, LastModifiedBy.Name, FolderId,
                                                  Folder.Name, RequestType, 
                                                  FailedReason, RequestStatus, TemplateApiName, 
                                                  TemplateVersion, RequestLog 
                                                  FROM WaveAutoInstallRequest
                                                  WHERE TemplateApiName =: templateApiName
                                                  ORDER BY LastModifiedDate DESC];
        
        return JSON.serialize(requests);
    }

    @AuraEnabled
    global static String listAutoInstallRequestsByFolderId(String folderId) {
        List<WaveAutoInstallRequest> requests  = [SELECT Id, Name, CreatedDate, CreatedBy.Name,
                                                  LastModifiedDate, LastModifiedBy.Name, FolderId,
                                                  Folder.Name, RequestType, 
                                                  FailedReason, RequestStatus, TemplateApiName, 
                                                  TemplateVersion, RequestLog 
                                                  FROM WaveAutoInstallRequest
                                                  WHERE FolderId =: folderId
                                                  ORDER BY LastModifiedDate DESC];
        
        return JSON.serialize(requests);
    }
    
    @AuraEnabled
    global static String deleteEmbeddedApp(String folderId, String name, String apiName) {
        
        WaveAutoInstallRequest delRequest = new WaveAutoInstallRequest();
        delRequest.put('Name', name + ' (' + apiName + ') WaveAppDelete request');
        delRequest.put('RequestStatus', 'Enqueued');
        delRequest.put('FolderId', folderId);
        delRequest.put('RequestType', 'WaveAppDelete');
        insert delRequest;
        
        return JSON.serialize(delRequest.Id);
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

    @AuraEnabled
    global static String listEmbeddedAppDashboards(String folderId, String name, String apiName) {
        
        List<Lens> assets = [SELECT Id,AllowPreview, CreatedBy.Name, CreatedDate, Description, 
                             DeveloperName, FolderId, InsightsApplicationId, LensVersion,
                             MasterLabel, NamespacePrefix, Type, VisualizationType
                             FROM Lens WHERE FolderId =: folderId];
        
        return JSON.serialize(assets);
        
    }
    
}