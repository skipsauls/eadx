global with sharing class GenericAirInvocable{
    
    @InvocableMethod(
        label='Manage Generic Wave Apps' 
        description='Manages any wave app lifecycle through the auto-installer'
    )
    global static List<Response> performOperation(List<Request> requests){
        return new GenericAirInvocable(requests.get(0)).doAutoInvoke();
    }

    @AuraEnabled
    global static List<WaveAutoInstallRequest> getAutoInstallRequests(String templateApiName, List<String> statuses){
        List<String> inStatuses = new List<String>();
        if (null != statuses){
            inStatuses.addAll(statuses);
        } else {
           inStatuses.add('New');
           inStatuses.add('Enqueued');
           inStatuses.add('InProgress');
           inStatuses.add('AppInProgress');
           inStatuses.add('Cancelled');
           inStatuses.add('Success');
           inStatuses.add('Failed');
        }
        return [SELECT Id, FolderId, Folder.Name, Name, RequestStatus, RequestLog  
            FROM WaveAutoInstallRequest 
            WHERE TemplateApiName = :templateApiName
                AND RequestStatus IN :inStatuses
            ORDER BY LastModifiedDate DESC];
    }
    
    @AuraEnabled
    global static WaveAutoInstallRequest getAutoInstallRequest(String autoInstallRequestId){
        return [SELECT Id, FolderId, Folder.Name, Name, RequestStatus, RequestLog  
            FROM WaveAutoInstallRequest 
            WHERE Id = :autoInstallRequestId];
    }

    @AuraEnabled
    global static WaveAutoInstallRequest cancelAutoInstallRequest(String autoInstallRequestId){
        WaveAutoInstallRequest request = [SELECT Id, FolderId, Folder.Name, Name, RequestStatus, RequestLog  
            FROM WaveAutoInstallRequest 
            WHERE Id = :autoInstallRequestId];
        if (null != request && (request.RequestStatus == 'Enqueued' || 
            request.RequestStatus == 'InProgress' || 
            request.RequestStatus == 'AppInProgress')){
            // Cancel request.
            request.RequestStatus = 'Cancelled';
            update request;
        }
        return request;
    }
        
    global class Request{    
        @InvocableVariable(required=true)
        global String operation;
        
        @InvocableVariable(required=true)
        global String templateApiName;

        @InvocableVariable(required=false)
        global String appLabel;     
        
        @InvocableVariable(required=false)
        global Boolean deleteOnFailure;        
        
    }
    
    global class Response{
        @InvocableVariable
        global WaveAutoInstallRequest response;
    }
    
    private final Request request;
    public GenericAirInvocable(Request request){
        this.request = request;
        if (null != this.request){
            String msg = 'Operation: ' + this.request.operation + ', ' +
                'TemplateApiName: ' + this.request.templateApiName + ', ' + 
                'App Label: ' + this.request.appLabel + ', ' + 
                'deleteOnFalure: ' + this.request.deleteOnFailure + '.';
            System.debug(msg);
        }
    }

    public GenericAirInvocable(){
        this(null);
    }
    
    public List<Response> doAutoInvoke(){
        if (null == this.request){
            Exception e = new NullPointerException();
            e.setMessage('Invocable request not set.');
            throw e;
        }
        AutoInstallOperations.Operation operation = 
            AutoInstallOperations.resolveOperation(request.operation);
        if (null == operation){
            Exception e = new NoDataFoundException();
            e.setMessage('Unknown operation: ' + request.operation);
            throw e;           
        }
        switch on operation {
            when OP_CREATE {
                return this.doCreate(this.request.templateApiName, 
                    request.appLabel, null);
            }   
            when OP_CREATE_OR_UPDATE{
                    return this.doCreateOrUpdate(this.request.templateApiName, 
                    request.appLabel, null);
            }
            when OP_UPDATE {
                return this.doUpdate(this.request.templateApiName, 
                    request.appLabel, null);
            }
            when OP_DELETE {
                return this.doDelete(this.request.templateApiName, request.appLabel);
            }
            when OP_CLEAN_OLD_REQUESTS {
                return this.cleanOldAirRequests(request.templateApiName);
            }
        }
        return new List<Response>();
    
    }
    
    public List<Response> doCreateOrUpdate(String templateApiName, String appLabel, Map<String, Object> configuration){
        String criteria = '%' + appLabel + '%';
        List<WaveAutoInstallRequest> airs = [SELECT Id, FolderId, Folder.Name, Configuration FROM WaveAutoInstallRequest WHERE 
            TemplateApiName = :templateApiName AND 
            Folder.Name LIKE :criteria AND 
            Folder.Type = 'Insights' 
            ORDER BY LastModifiedDate DESC LIMIT 1];
            if (airs.isEmpty()){
                return doCreateInternal(templateApiName, appLabel, configuration);
            }
            return doUpdateInternal(templateApiName, airs.get(0).FolderId, appLabel, configuration);
    }
    
    public List<Response> doCreate(String templateApiName, String appLabel, Map<String, Object> configuration){
        String configString = null != configuration ?
            JSON.serialize(configuration) : JSON.serialize(getDefaultConfiguration());
            
        String criteria = '%' + appLabel + '%';
        List<AggregateResult> airs = [SELECT TemplateApiName, FolderId, Folder.Name FROM WaveAutoInstallRequest WHERE 
            TemplateApiName = :templateApiName AND 
            Folder.Name LIKE :criteria AND 
            Folder.Type = 'Insights' 
            GROUP BY TemplateApiName, FolderId, Folder.Name];
        if (!airs.isEmpty()){
            Exception e = new DmlException();
            e.setMessage('App already exists by template ' + templateApiName + ', ' + appLabel);
            throw e;                   
        }
        return doCreateInternal(templateApiName, appLabel, configuration);
    }
    
    public List<Response> doDelete(String templateApiName, String appLabel){
        if (null == appLabel){
            Exception e = new NullPointerException();
            e.setMessage('No app name specified');
            throw e;
        }
        String criteria = '%' + appLabel + '%';
        List<AggregateResult> airs = [SELECT TemplateApiName, FolderId, Folder.Name FROM WaveAutoInstallRequest WHERE 
            TemplateApiName = :templateApiName AND 
            Folder.Name LIKE :criteria AND 
            Folder.Type = 'Insights' 
            GROUP BY TemplateApiName, FolderId, Folder.Name];
        if (null == airs || airs.isEmpty()){
            Exception e = new NoDataFoundException();
            e.setMessage('No app named ' + appLabel + ' found based on request template ' + templateApiName + '.');
            throw e;                   
        }
        if (airs.size() > 1){
            List<Object> labels = new List<String>();
            for (AggregateResult air: airs){
                labels.add(air.getSobject('Folder').get('Name'));
            }
            Exception e = new NoDataFoundException();
            e.setMessage('Multiple apps found: ' + templateApiName + ':' + labels);
            throw e;                   
        }
        WaveAutoInstallRequest request = new WaveAutoInstallRequest();
        request.put('Name', getRequestName('Deleting', appLabel));
        request.put('TemplateApiName', templateApiName);
        request.put('RequestStatus', 'Enqueued');
        request.put('FolderId', airs.get(0).get('FolderId'));
        request.put('RequestType', 'WaveAppDelete');
        insert request;
        Response response = new Response();
        response.response = request;
        List<Response> rv = new List<Response>();
        rv.add(response);
        return rv;
    }

    public List<Response> doUpdate(String templateApiName, String appLabel, Map<String, Object> configuration){
        if (null == appLabel){
            Exception e = new NullPointerException();
            e.setMessage('No app name specified');
            throw e;
        }
        String criteria = '%' + appLabel + '%';
        List<WaveAutoInstallRequest> airs = [SELECT Id, FolderId, Folder.Name, Configuration FROM WaveAutoInstallRequest WHERE 
            TemplateApiName = :templateApiName AND 
            Folder.Name LIKE :criteria AND 
            Folder.Type = 'Insights' 
            ORDER BY LastModifiedDate DESC LIMIT 1];
        if (null == airs || airs.isEmpty()){
            Exception e = new NoDataFoundException();
            e.setMessage('No app named ' + appLabel + ' found based on request template ' + templateApiName + '.');
            throw e;                   
        }
        if (airs.size() > 1){
            List<String> labels = new List<String>();
            for (WaveAutoInstallRequest air: airs){
                labels.add(air.Folder.Name);
            }
            Exception e = new NoDataFoundException();
            e.setMessage('Multiple apps found: ' + templateApiName + ':' + labels);
            throw e;                   
        }
        Map<String, Object> airConfig = (airs.size() == 1 ? 
                    (Map<String, Object>)JSON.deserializeUntyped(airs.get(0).Configuration) :
                    null);
        
        configuration = null != configuration  ?
                configuration :
                airConfig;
                
        return doUpdateInternal(templateApiName, airs.get(0).FolderId, appLabel, configuration);
    }
    
    public List<Response> cleanOldAirRequests(String templateApiName){    
        List<WaveAutoInstallRequest> airs = [SELECT Id, TemplateApiName, FolderId FROM 
            WaveAutoInstallRequest WHERE Folder.Name = NULL];  
        System.Debug('Deleting ' + airs.size() + ' requests.');          
        delete airs;
        return new List<Response>();
    }
    
    private Map<String, Object> getDefaultConfiguration(){
        Boolean deleteOnFailure = null != this.request && null != this.request.deleteOnFailure ?
            this.request.deleteOnFailure : true;
        Map<String, Object> configuration = new Map<String, Object>();
        Map<String, Object> values = new Map<String, Object>();
        Map<String, Object> appConfiguration = new Map<String,Object>();
        appConfiguration.put('deleteAppOnConstructionFailure', deleteOnFailure);
        appConfiguration.put('values', values);
        configuration.put('appConfiguration', appConfiguration);
        return configuration;
    }

    private List<Response> doCreateInternal(String templateApiName, String appLabel, Map<String, Object> configuration){
        String configString = null == configuration ?
            '{}' : 
            JSON.serialize(configuration);
        WaveAutoInstallRequest request = new WaveAutoInstallRequest();
        request.put('Name', getRequestName('Creating', appLabel));
        request.put('TemplateApiName', templateApiName);
        request.put('RequestStatus', 'Enqueued');
        request.put('RequestType', 'WaveAppCreate');
        request.put('Configuration', configString);        
        insert request;
        Response response = new Response();
        response.response = request;
        List<Response> rv = new List<Response>();
        rv.add(response);
        return rv;
    }
    
    private List<Response> doUpdateInternal(String templateApiName, String folderId, String appLabel, Map<String, Object> configuration){
        String configString = null == configuration ?
            '{}' : 
            JSON.serialize(configuration);
        WaveAutoInstallRequest request = new WaveAutoInstallRequest();
        request.put('Name', getRequestName('Updating', appLabel));
        request.put('TemplateApiName', templateApiName);
        request.put('RequestStatus', 'Enqueued');
        request.put('FolderId', folderId);
        request.put('RequestType', 'WaveAppUpdate');
        request.put('Configuration', configString);        
        insert request;
        Response response = new Response();
        response.response = request;
        List<Response> rv = new List<Response>();
        rv.add(response);
        return rv;
            
    }
    
    private String getRequestName(String action, String appLabel){
        return action + ' application ' + appLabel;
    }
    
}