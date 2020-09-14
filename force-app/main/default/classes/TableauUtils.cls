global with sharing class TableauUtils {
    
    
    global class Usage {
        public Integer numUsers;
        public Integer storage;
    }

    global class Site {
        public String id;
        public String name;
        public String contentUrl;
        public String adminMode;
        public Integer userQuota;
        public Integer storageQuota;
		public Integer tierCreatorCapacity;
		public Integer tierExplorerCapacity;
		public Integer tierViewerCapacity;
        public Boolean disableSubscriptions;
        public String state;
        public Boolean revisionHistoryEnabled;
        public Integer revisionLimit;        
        public String subscribeOthersEnabled;
        public Boolean allowSubscriptionAttachments;
        public Boolean guestAccessEnabled;
        public Boolean cacheWarmupEnabled;
        public Boolean commentingEnabled;
        public Boolean flowsEnabled;

		//public String materializedViewsMode;
		public Boolean loginBasedLicenseManagementEnabled;
        public Boolean catalogingEnabled;
        public Boolean derivedPermissionsEnabled;
		public Boolean webExtractionEnabled;
    }
 
    global class Credentials {
        public String name;
        public String password;
        public Site site;
    }
    
    global class UsernamePasswordAuth {
        public Credentials credentials;
    }

    global class ResponseUser {
        String id;
    }
    
    global class ResponseCredentials {
    	public Site site;
        public ResponseUser user;
        public String token;
    }
    
    global class TableauAuthResponse {
        public ResponseCredentials credentials;
    }
    
    global class SiteDetails {
        public Site site;
    }

    global class Sites {
        public List<Site> sites;
        public Pagination pagination;
    }
    
    global class Project {
        public String id;
        public String name;
    }
    
    global class Owner {
        public String id;
        public String name;
    }
    
    global class Tags {
        
    }
    
    global class MaterializedViewsEnablementConfig {
        public Boolean materializedViewsEnabled;
    }
    
    global class Workbook {
        public Project project;
        public Owner owner;
        public Tags tags;
        //public MaterializedViewsEnablementConfig materializedViewsEnablementConfig;
        public String id;
        public String name;
        public String contentUrl;
        public String webpageUrl;
        //public Boolean showTabs;
        public Integer size;
        public String createdAt;
        public String updatedAt;
        public String encryptExtracts;
        public String defaultViewId;
    }

    global class WorkbookDetail {
        Workbook workbook;
    }
    
    global class Workbooks {
        public Workbook[] workbook;
    }
    
    global class Pagination {
        public Integer pageNumber;
		public Integer pageSize;
        public Integer totalAvailable;
    }
    
    global class WorkbookDetails {
        public Pagination pagination;
        public Workbooks workbooks;
    }

    global class View {
        public Workbook workbook;
        public Owner owner;
        public Project project;
        public Tags tags;
        public String id;
        public String name;
        public String contentUrl;
        public String createdAt;
        public String updatedAt;
        public String viewUrlName;
    }

    global class Views {
        public View[] view;
    }
    
    global class ViewDetails {
        public Views views;
    }
    
    global class Datasource {
        public Project project;
        public Owner owner;
        public Tags tags;
        public String id;
        public String name;
        public String contentUrl;
        public String webpageUrl;
        public String createdAt;
        public String updatedAt;
		public String type;
		public String encryptExtracts;
        public Boolean isCertified;
        public Boolean useRemoteQueryAgent;
    }

    global class Datasources {
        public Datasource[] datasource;
    }
    
    global class DatasourceDetails {
        public Pagination pagination;
        public Datasources datasources;
    }
    
    global class Table {
        public String id;
        public String name;
        public Boolean isEmbedded;
        public Boolean isCertified;
       	public Site site;
    }

    global class Tables {
        public Table[] table;
    }
    
    global class TableDetails {
        public Tables tables;
    }
    
    global class Column {
        public String id;
        public String name;
        public String remoteType;
        public String parentTableId;
        public Site site;
    }
    
    global class Columns {
        public Column[] column;
    }
    
    global class ColumnDetails {
        public Columns columns;
    }
    
    global static TableauAuthResponse authorize(String serverUrl, String name, String password, String site, Boolean refresh) {
        
        System.debug('authorize: ' + serverUrl + ', ' + name + ', ' + password + ', ' + site + ', ' + refresh);
        
        TableauAuth__c tableauAuth = null;
        
        try {
			Datetime d = datetime.now().addhours(-1);
            
			System.debug(d);
            
            tableauAuth = [SELECT Id,LastModifiedDate,UserName__c,UserId__c,SiteName__c,SiteId__c,Token__c FROM TableauAuth__c WHERE UserName__c =: name AND SiteName__c =: site AND LastModifiedDate > :d];
            
        } catch (Exception e) {
            
        }
        
        if (tableauAuth != null && tableauAuth.Token__c != null && refresh != true) {
            
            TableauAuthResponse authResponse = new TableauAuthResponse();
            authResponse.credentials = new ResponseCredentials();
            authResponse.credentials.user = new ResponseUser();
            authResponse.credentials.user.id = tableauAuth.UserId__c;
            authResponse.credentials.site = new Site();
            authResponse.credentials.site.id = tableauAuth.SiteId__c;
            authResponse.credentials.site.name = tableauAuth.SiteName__c;
            authResponse.credentials.token = tableauAuth.Token__c;
            return authResponse;
            
        } else {

            TableauUtils.UsernamePasswordAuth auth = new TableauUtils.UsernamePasswordAuth();
            
            auth.credentials = new TableauUtils.Credentials();
            
            auth.credentials.name = name;
            
            auth.credentials.password = password;
            
            auth.credentials.site = new TableauUtils.Site();
            
            auth.credentials.site.contentUrl = site;
            
            String authJson = JSON.serialize(auth);
            
            System.debug('auth json: ' + authJson);            
            
            String url = 'https://' + serverUrl + '/api/3.6/auth/signin';
            
            HttpRequest request = new HttpRequest();        
            Http http = new Http();
            request.setEndpoint(url);
            request.setMethod('POST');
            request.setHeader('Content-type', 'application/json');
            request.setHeader('Accept', 'application/json');
            request.setBody(authJson);
            
            HTTPResponse response = http.send(request);
            
            String body = response.getBody();
            
            System.debug('response body: ' + body);
    
            TableauAuthResponse authResponse = (TableauAuthResponse) JSON.deserialize(body, TableauAuthResponse.class);

            System.debug('authResponse: ' + authResponse);
            
            String accessToken = (String) authResponse.credentials.token;

            
            tableauAuth = new TableauAuth__c();
            tableauAuth.UserName__c = name;
            tableauAuth.UserId__c = authResponse.credentials.user.id;
            tableauAuth.SiteName__c = site;
            tableauAuth.SiteId__c = authResponse.credentials.site.id;
            tableauAuth.Token__c = authResponse.credentials.token;

            System.debug('tableauAuth: ' + tableauAuth);

          	upsert tableauAuth;
            
            return authResponse;
        }    	
        
    }

    global static Sites getSites(String serverUrl, String authToken) {
        
        String url = 'https://' + serverUrl + '/api/3.6/sites';
        
        System.debug('url: ' + url);
        
        HttpRequest request = new HttpRequest();        
        Http http = new Http();
        request.setEndpoint(url);
        request.setMethod('GET');
        request.setHeader('Content-type', 'application/json');
        request.setHeader('Accept', 'application/json');
        request.setHeader('X-Tableau-Auth', authToken);
        
        HTTPResponse response = http.send(request);
        
        String body = response.getBody();
        
        System.debug('response body: ' + body);

      	Sites sites = (Sites) JSON.deserialize(body, Sites.class);

		return sites;        
    }

    global static SiteDetails getSiteDetails(String serverUrl, String siteName, String authToken) {
        
        String url = 'https://' + serverUrl + '/api/3.6/sites/' + siteName + '?key=name';
        
        System.debug('url: ' + url);
        
        HttpRequest request = new HttpRequest();        
        Http http = new Http();
        request.setEndpoint(url);
        request.setMethod('GET');
        request.setHeader('Content-type', 'application/json');
        request.setHeader('Accept', 'application/json');
        request.setHeader('X-Tableau-Auth', authToken);
        
        HTTPResponse response = http.send(request);
        
        String body = response.getBody();
        
        System.debug('response body: ' + body);

      	SiteDetails details = (SiteDetails) JSON.deserialize(body, SiteDetails.class);

		return details;        
    }

    global static WorkbookDetail getWorkbook(String serverUrl, String siteId, String workbookId, String authToken) {
        
        String url = 'https://' + serverUrl + '/api/3.6/sites/' + siteId + '/workbooks/' + workbookId;
        
        System.debug('---------------------------------------------------------------------> url: ' + url);
        
        HttpRequest request = new HttpRequest();        
        Http http = new Http();
        request.setEndpoint(url);
        request.setMethod('GET');
        request.setHeader('Content-type', 'application/json');
        request.setHeader('Accept', 'application/json');
        request.setHeader('X-Tableau-Auth', authToken);
        
        HTTPResponse response = http.send(request);
        
        String body = response.getBody();
        
        System.debug('response body: ' + body);
        
        WorkbookDetail workbookDetail = (WorkbookDetail) JSON.deserialize(body, WorkbookDetail.class);

		return workbookDetail;
    }
    
    global static WorkbookDetails getWorkbooksForSite(String serverUrl, String siteId, String authToken) {
        
        String url = 'https://' + serverUrl + '/api/3.6/sites/' + siteId + '/workbooks';
        
        System.debug('url: ' + url);
        
        HttpRequest request = new HttpRequest();        
        Http http = new Http();
        request.setEndpoint(url);
        request.setMethod('GET');
        request.setHeader('Content-type', 'application/json');
        request.setHeader('Accept', 'application/json');
        request.setHeader('X-Tableau-Auth', authToken);
        
        HTTPResponse response = http.send(request);
        
        String body = response.getBody();
        
        System.debug('response body: ' + body);
        
        WorkbookDetails details = (WorkbookDetails) JSON.deserialize(body, WorkbookDetails.class);

		return details;
    }

    global static ViewDetails getViewDetailsBySite(String serverUrl, String siteId, String authToken) {
        
        String url = 'https://' + serverUrl + '/api/3.6/sites/' + siteId + '/views';
        
        System.debug('url: ' + url);
        
        HttpRequest request = new HttpRequest();        
        Http http = new Http();
        request.setEndpoint(url);
        request.setMethod('GET');
        request.setHeader('Content-type', 'application/json');
        request.setHeader('Accept', 'application/json');
        request.setHeader('X-Tableau-Auth', authToken);
        
        HTTPResponse response = http.send(request);
        
        String body = response.getBody();
        
        System.debug('response body: ' + body);

        ViewDetails details = (ViewDetails) JSON.deserialize(body, ViewDetails.class);

		return details;
    }

    global static ViewDetails getViewDetailsByWorkbook(String serverUrl, String siteId, String workbookId, String authToken) {
        
        String url = 'https://' + serverUrl + '/api/3.6/sites/' + siteId + '/workbooks/' + workbookId + '/views';
        
        System.debug('url: ' + url);
        
        HttpRequest request = new HttpRequest();        
        Http http = new Http();
        request.setEndpoint(url);
        request.setMethod('GET');
        request.setHeader('Content-type', 'application/json');
        request.setHeader('Accept', 'application/json');
        request.setHeader('X-Tableau-Auth', authToken);
        
        HTTPResponse response = http.send(request);
        
        String body = response.getBody();
        
        System.debug('response body: ' + body);

        ViewDetails details = (ViewDetails) JSON.deserialize(body, ViewDetails.class);

		return details;
    }

    global static String getViewData(String serverUrl, String siteId, String viewId, String filter, String authToken) {
        
        String url = 'https://' + serverUrl + '/api/3.6/sites/' + siteId + '/views/' + viewId + '/data';
        
        System.debug('---------------------> filter: ' + filter);
        	
        if (filter != null) {
	        List<String> filters = filter.split(':');
            System.debug('filters: ' + filters);
            String delim = '?';
            filter = '';
    	    for (String f: filters) {
                System.debug('f: ' + f);
                if (f != null && f.length() > 0) {
                    List<String> pairs = f.split(',');
                    for (String pair: pairs) {
                        filter += delim + pair;
                        delim = '&';
                    }
            	}
            }
            
	        System.debug('filter: ' + filter);
            
            filter = filter.replace(' ', '+');
	        System.debug('filter: ' + filter);
            
            url += filter;    
    	    System.debug('url: ' + url);
        }
        
        HttpRequest request = new HttpRequest();        
        Http http = new Http();
        request.setEndpoint(url);
        request.setMethod('GET');
        request.setHeader('Content-type', 'application/json');
        request.setHeader('Accept', 'application/json');
        request.setHeader('X-Tableau-Auth', authToken);
        
        
        HTTPResponse response = http.send(request);
        
        String body = response.getBody();
        
        //System.debug('response body: ' + body);

		return body;        
    }
    
    global static DatasourceDetails getDatasourceDetails(String serverUrl, String siteId, String authToken) {
        
        String url = 'https://' + serverUrl + '/api/3.6/sites/' + siteId + '/datasources';
        
        System.debug('url: ' + url);
        
        HttpRequest request = new HttpRequest();        
        Http http = new Http();
        request.setEndpoint(url);
        request.setMethod('GET');
        request.setHeader('Content-type', 'application/json');
        request.setHeader('Accept', 'application/json');
        request.setHeader('X-Tableau-Auth', authToken);
        
        HTTPResponse response = http.send(request);
        
        String body = response.getBody();
        
        System.debug('response body: ' + body);

        DatasourceDetails details = (DatasourceDetails) JSON.deserialize(body, DatasourceDetails.class);

		return details;
    }
    
    global static TableDetails getTableDetails(String serverUrl, String siteId, String authToken) {
        
        String url = 'https://' + serverUrl + '/api/3.6/sites/' + siteId + '/tables';
        
        System.debug('url: ' + url);
        
        HttpRequest request = new HttpRequest();        
        Http http = new Http();
        request.setEndpoint(url);
        request.setMethod('GET');
        request.setHeader('Content-type', 'application/json');
        request.setHeader('Accept', 'application/json');
        request.setHeader('X-Tableau-Auth', authToken);
        
        HTTPResponse response = http.send(request);
        
        String body = response.getBody();
        
        System.debug('response body: ' + body);

        TableDetails details = (TableDetails) JSON.deserialize(body, TableDetails.class);

		return details;
    }

    global static ColumnDetails getTableColumns(String serverUrl, String siteId, String tableId, String authToken) {
        
        String url = 'https://' + serverUrl + '/api/3.6/sites/' + siteId + '/tables/' + tableId + '/columns';
        
        System.debug('url: ' + url);
        
        HttpRequest request = new HttpRequest();        
        Http http = new Http();
        request.setEndpoint(url);
        request.setMethod('GET');
        request.setHeader('Content-type', 'application/json');
        request.setHeader('Accept', 'application/json');
        request.setHeader('X-Tableau-Auth', authToken);
        
        HTTPResponse response = http.send(request);
        
        String body = response.getBody();
        
        System.debug('response body: ' + body);

        ColumnDetails details = (ColumnDetails) JSON.deserialize(body, ColumnDetails.class);

		return details;
    }
    
    // Convenience methods

    global static WorkbookDetail getWorkbookBySiteName(String serverUrl, String siteName, String workbookId, String authToken) {
        System.debug('getWorkbookBySiteName: ' + siteName + ', ' + workbookId);
   		SiteDetails siteDetails = getSiteDetails(serverUrl, siteName, authToken);
        WorkbookDetail workbookDetail = getWorkbook(serverUrl, siteDetails.site.id, workbookId, authToken);
        return workbookDetail;
    }

    
    global static List<Workbook> getWorkbooksBySiteName(String serverUrl, String siteName, String authToken) {
        System.debug('getWorkbooksBySiteName: ' + siteName);
   		SiteDetails siteDetails = getSiteDetails(serverUrl, siteName, authToken);
        WorkbookDetails workbookDetails = getWorkbooksForSite(serverUrl, siteDetails.site.id, authToken);
        List<Workbook> workbooks = new List<Workbook>();
        for (Workbook workbook: workbookDetails.workbooks.workbook) {
            workbooks.add(workbook);
        }
        return workbooks;
    }

    global static List<View> getViewsBySiteName(String serverUrl, String siteName, String authToken) {
   		SiteDetails siteDetails = getSiteDetails(serverUrl, siteName, authToken);
        ViewDetails viewDetails = getViewDetailsBySite(serverUrl, siteDetails.site.id, authToken);
        List<View> views = new List<View>();
        for (View view: viewDetails.views.view) {
            views.add(view);
        }
        return views;
    }
    
    global static List<Table> getTablesBySiteName(String serverUrl, String siteName, String authToken) {
   		SiteDetails siteDetails = getSiteDetails(serverUrl, siteName, authToken);
        TableDetails tableDetails = getTableDetails(serverUrl, siteDetails.site.id, authToken);
        List<Table> tables = new List<Table>();
        for (Table table: tableDetails.tables.table) {
            tables.add(table);
        }
        return tables;
    }

    global static ColumnDetails getColumnsByTable(String serverUrl, String siteName, String tableName, String authToken) {
   		SiteDetails siteDetails = getSiteDetails(serverUrl, siteName, authToken);
        TableDetails tableDetails = getTableDetails(serverUrl, siteDetails.site.id, authToken);
        List<Table> tables = new List<Table>();        
        ColumnDetails columnDetails = null;
        String tableId = null;
        for (Table table: tableDetails.tables.table) {
            if (table.name == tableName) {
              	tableId = table.id;
            }
        }
        if (tableId != null) {
            columnDetails = getTableColumns(serverUrl, siteDetails.site.id, tableId, authToken);
        }
        
        return columnDetails;
    }

    global static List<Datasource> getDatasourcesBySiteName(String serverUrl, String siteName, String authToken) {
   		SiteDetails siteDetails = getSiteDetails(serverUrl, siteName, authToken);
        DatasourceDetails datasourceDetails = getDatasourceDetails(serverUrl, siteDetails.site.id, authToken);
        List<Datasource> datasources = new List<Datasource>();
        for (Datasource datasource: datasourceDetails.datasources.datasource) {
            datasources.add(datasource);
        }
        return datasources;
    }

    global class RecordData {
        public List<String> labels;
        public List<Object> records;
    }

    @future(callout=true)
    global static void uploadViewDataToDataset(String serverUrl, String siteName, String viewName, String filter, String folderDeveloperName, String datasetName, String authToken) {
        System.debug('viewName: ' + viewName);
        System.debug('filter: ' + filter);
   		SiteDetails siteDetails = getSiteDetails(serverUrl, siteName, authToken);
        ViewDetails viewDetails = getViewDetailsBySite(serverUrl, siteDetails.site.id, authToken);
        View currentView = null;
        for (View view: viewDetails.views.view) {
            //System.debug('view: ' + view);
            //System.debug('view.name: ' + view.name);
            if (view.name == viewName) {
                currentView = view;
            }
        }

        System.debug('currentView: ' + currentView);
        
		String csvViewData = null;
    
        if (currentView != null) {
            csvViewData = getViewData(serverUrl, siteDetails.site.id, currentView.id, filter, authToken);
            //System.debug('csvViewData: ' + csvViewData);
        }

       	TableauDataLoader.createDatasetFromTableauView(folderDeveloperName, datasetName, csvViewData);
    }

    
    global static String getViewDataByNameAsCSV(String serverUrl, String siteName, String viewName, String filter, String authToken) {
        System.debug('viewName: ' + viewName);
        System.debug('filter: ' + filter);
   		SiteDetails siteDetails = getSiteDetails(serverUrl, siteName, authToken);
        ViewDetails viewDetails = getViewDetailsBySite(serverUrl, siteDetails.site.id, authToken);
        View currentView = null;
        for (View view: viewDetails.views.view) {
            //System.debug('view: ' + view);
            //System.debug('view.name: ' + view.name);
            if (view.name == viewName) {
                currentView = view;
            }
        }

        System.debug('currentView: ' + currentView);
        
		String csvViewData = null;
    
        if (currentView != null) {
            csvViewData = getViewData(serverUrl, siteDetails.site.id, currentView.id, filter, authToken);
            //System.debug('csvViewData: ' + csvViewData);
        }
        return csvViewData;
    }
    
    global static RecordData getViewDataByName(String serverUrl, String siteName, String viewName, String filter, String authToken) {
        System.debug('viewName: ' + viewName);
        System.debug('filter: ' + filter);
   		SiteDetails siteDetails = getSiteDetails(serverUrl, siteName, authToken);
        ViewDetails viewDetails = getViewDetailsBySite(serverUrl, siteDetails.site.id, authToken);
        View currentView = null;
        for (View view: viewDetails.views.view) {
            //System.debug('view: ' + view);
            //System.debug('view.name: ' + view.name);
            if (view.name == viewName) {
                currentView = view;
            }
        }

        System.debug('currentView: ' + currentView);
        
        List<Object> records = new List<Object>();
        List<String> labels = null;

        if (currentView != null) {
            String csvViewData = getViewData(serverUrl, siteDetails.site.id, currentView.id, filter, authToken);
            System.debug('csvViewData: ' + csvViewData);
            
            List<String> csvRowData = csvViewData.split('\\n');
            System.debug('csvRowData: ' + csvRowData);

            System.debug('csvRowData.size(): ' + csvRowData.size());
            
            String labelRow = csvRowData.get(0);
            labels = labelRow.split(',');

            String row = null;
			List<String> record = null;
            Map<String, String> recordMap = null;
            String value = null;
            Integer max = csvRowData.size();
            for (Integer i = 1; i < max; i++) {
            	row = csvRowData.get(i);
                //System.debug('row: ' + row);
                record = row.split(',');
                //System.debug('record: ' + record);
                Integer j = 0;
                recordMap = new Map<String, String>();
                for (String key: labels) {
                    value = record.get(j);
                    System.debug('key: ' + key + ', value: ' + value);
                    recordMap.put(key, value);
                    j++;
                }
                records.add(recordMap);
            }

        }
        
        //System.debug('records: ' + records);
        
        RecordData recordData = new RecordData();
        recordData.labels = labels;
        recordData.records = records;
            
        return recordData;
    }
    
    
    /*    
    global static View getView(String serverUrl, String siteName, String viewName, String authToken) {
        
    }
*/
    

    
}