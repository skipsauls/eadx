@RestResource(urlMapping='/tableau/*') 
global with sharing class TableauController {

    public static List<Object> listWorkbooks(String siteName) {
 		//TableauUtils.SiteDetails 
 		//
 		return null;
    }
    
    @AuraEnabled
    public static List<Folder> listAnalyticsApps() {
        List<Folder> folders = [SELECT Id,DeveloperName,Name,AccessType,CreatedDate,Type FROM Folder where Type = 'Insights' ORDER BY Name];
        
        return folders;
    }
    
    @HttpGet           
    global static String query() {
        
		String methodName = RestContext.request.params.get('methodName');
        System.debug('methodName: ' + methodName);
        
		String params = RestContext.request.params.get('params');
        System.debug('params: ' + params);
        
        if (params == null || params == '') {
            params = '{}';
        }
        
        Map<String, Object> paramMap = (Map<String, Object>) JSON.deserializeUntyped(params);

        String response = null;
        
        String serverUrl = RestContext.request.params.get('serverUrl');
        System.debug('serverUrl: ' + serverUrl);
        String siteName = RestContext.request.params.get('siteName'); 
        System.debug('siteName: ' + siteName);
        String name = RestContext.request.params.get('name'); 
        System.debug('name: ' + name);

        if (methodName == 'authenticate') {
            String password = RestContext.request.params.get('password'); 
            System.debug('password: ' + password);
            String refreshParam = RestContext.request.params.get('refresh');
            Boolean refresh = false;
            if (refreshParam != null) {
                
                try {
	                refresh = Boolean.valueOf(refreshParam);
                } catch (Exception e) {}
            }
            
            System.debug('refresh: ' + refresh);
            
            TableauUtils.TableauAuthResponse authResponse = TableauUtils.authorize(serverUrl, name, password, siteName, refresh);
            
            response = JSON.serialize(authResponse);
            
        } else {
            
            TableauUtils.TableauAuthResponse authResponse = TableauUtils.authorize(serverUrl, name, null, siteName, false);
    
            System.debug('authResponse: ' + authResponse);
            
            String authToken = (String) authResponse.credentials.token;
    
            System.debug('authToken: ' + authToken);
            
            List<Object> records = null;
            
            switch on methodName {
                when 'list_sites' {
                    TableauUtils.Sites sites = TableauUtils.getSites(serverUrl, authToken);
                    records = sites.sites;
                    response = JSON.serialize(records);
                }
                when 'list_workbooks' {
                    records = TableauUtils.getWorkbooksBySiteName(serverUrl, siteName, authToken);
                    response = JSON.serialize(records);
                }
                when 'list_views' {
                    records = TableauUtils.getViewsBySiteName(serverUrl, siteName, authToken);
                    response = JSON.serialize(records);
                }
                when 'list_tables' {                    
                    records = TableauUtils.getTablesBySiteName(serverUrl, siteName, authToken);
                    response = JSON.serialize(records);
                }
                 when 'get_table_columns' {
                    String tableName = RestContext.request.params.get('tableName'); 
                    System.debug('tableName: ' + tableName);
                    TableauUtils.ColumnDetails details = TableauUtils.getColumnsByTable(serverUrl, siteName, tableName, authToken);
                    System.debug('details: ' + details);                     
                    System.debug('details.columns: ' + details.columns);                     
                    System.debug('details.columns.column: ' + details.columns.column);                     
                    response = JSON.serialize(details.columns.column);
                }
                when 'list_datasources' {
                    records = TableauUtils.getDatasourcesBySiteName(serverUrl, siteName, authToken);
                    response = JSON.serialize(records);
                }
                when 'get_view_data' {
                    String viewName = RestContext.request.params.get('viewName'); 
                    System.debug('viewName: ' + viewName);
                    String filter = RestContext.request.params.get('filter');
                    System.debug('filter: ' + filter);
    
                    //TableauUtils.RecordData recordData = TableauUtils.getViewDataByName(serverUrl, siteName, viewName, filter, authToken);
                    //records = recordData.records;
                    //response = JSON.serialize(records);
                   
                    response = TableauUtils.getViewDataByNameAsCSV(serverUrl, siteName, viewName, filter, authToken);
                }
                when 'query_workbook' {
                    
                    //String siteName = RestContext.request.params.get('siteName'); 
                    //System.debug('siteName: ' + siteName);
                    //
                    String workbookId = RestContext.request.params.get('workbookId'); 
                    System.debug('workbookId: ' + workbookId);
                    String filter = RestContext.request.params.get('filter');
                    System.debug('filter: ' + filter);
                   
                    TableauUtils.WorkbookDetail workbookDetail = TableauUtils.getWorkbookBySiteName(serverUrl, siteName, workbookId, authToken);
                    response = JSON.serialize(workbookDetail);
                }
                when 'upload_view_data_to_dataset' {
                    String viewName = RestContext.request.params.get('viewName'); 
                    System.debug('viewName: ' + viewName);
                    String filter = RestContext.request.params.get('filter');
                    System.debug('filter: ' + filter);
   
                    String folderDeveloperName = RestContext.request.params.get('folderDeveloperName');
                    System.debug('folderDeveloperName: ' + folderDeveloperName);
    
                    String datasetName = RestContext.request.params.get('datasetName');
                    System.debug('datasetName: ' + datasetName);
                    
                    TableauUtils.uploadViewDataToDataset(serverUrl, siteName, viewName, filter, folderDeveloperName, datasetName, authToken);
                    //String csvViewData = '';//TableauUtils.getViewDataByNameAsCSV(serverUrl, siteName, viewName, filter, authToken);
                    //System.debug('csvViewData: ' + csvViewData);
                    
                    //TableauDataLoader.createDatasetFromTableauView(viewName, csvViewData);
    
                    //TableauDataLoader.test2();
                }
                when else {
                    
                }
            }
        }
        
        System.debug('response: ' + response);
            
        return response;
    }
    
    @HttpPost            
    global static String queryForDashboard(String methodName, String params) {
        
        System.debug('query: ' + methodName + ', ' + params);
        
        if (params == null || params == '') {
            params = '{}';
        }
        
        Map<String, Object> paramMap = (Map<String, Object>) JSON.deserializeUntyped(params);
        
        /* Hard-coded for now!!!!! */
        String serverUrl = 'XXXXXXXX';
        String name = 'XXXXXXXX';
        String password = 'XXXXXXXX';
        String siteName = 'XXXXXXXX';

        List<String> strings = new List<String>(); 
        List<String> numbers = new List<String>(); 
        List<Object> groupings = new List<String>();
                
		TableauUtils.TableauAuthResponse authResponse = TableauUtils.authorize(serverUrl, name, password, siteName, false);

		String authToken = (String) authResponse.credentials.token;

		System.debug('authToken: ' + authToken);
        
        List<Object> records = null;
        
        switch on methodName {
            when 'list_workbooks' {
               	records = TableauUtils.getWorkbooksBySiteName(serverUrl, siteName, authToken);
                strings.add('name');
                strings.add('id');
            }
            when 'list_views' {
               	records = TableauUtils.getViewsBySiteName(serverUrl, siteName, authToken);
                strings.add('name');
                strings.add('id');
            }
            when 'get_view_data' {
                String viewName = (String) paramMap.get('viewName'); 
                System.debug('viewName: ' + viewName);
                String filter = (String) paramMap.get('filter');
                System.debug('filter: ' + filter);
                
               	TableauUtils.RecordData recordData = TableauUtils.getViewDataByName(serverUrl, siteName, viewName, filter, authToken);
                records = recordData.records;
              	strings = recordData.labels;
            }
            when else {
                
            }
        }
                
        ReturnMetadata rm = new ReturnMetadata(strings, numbers, groupings); 
        
        System.debug('return metadata: ' + rm);
        
     	PackagedReturnItem returnItem = new PackagedReturnItem(records, rm);

        System.debug('return item: ' + returnItem);
            
        return JSON.serialize(returnItem); 
    }
    
    private class ReturnMetadata { 
    
        public final List<String> strings; 
        public final List<String> numbers; 
        public final List<Object> groupings; 
        
        public ReturnMetadata(List<String> strings, List<String> numbers, List<Object> groupings) { 
            this.strings = strings; 
            this.numbers = numbers; 
            this.groupings = groupings; 
        } 
    } 
    
    private class PackagedReturnItem { 
    
        public final List<Object> data; 
        public final ReturnMetadata metadata; 
        
        public PackagedReturnItem(List<Object> data, ReturnMetadata metadata) { 
            this.data = data; 
            this.metadata = metadata; 
        } 
    }     
}