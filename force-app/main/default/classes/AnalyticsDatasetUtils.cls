global class AnalyticsDatasetUtils {
    
    
    global String getDataset(String id, String currentVersionId) {
        
		String sfdcURL = URL.getSalesforceBaseUrl().toExternalForm();

		String url = sfdcURL + '/services/data/v45.0/wave/datasets/' + id + '/versions/' + currentVersionId; 
        
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(url);
        request.setMethod('GET');
        request.setHeader('Content-Type', 'application/json;charset=UTF-8');
        request.setHeader('Authorization', 'Bearer ' + UserInfo.getSessionID()); 
        HttpResponse response = http.send(request);
        String details = '';
        if (response.getStatusCode() == 200) {
            details = response.getBody();
        }
        
        return details;
    }

    global String getDatasetVersions(String id) {
        
		String sfdcURL = URL.getSalesforceBaseUrl().toExternalForm();

		String url = sfdcURL + '/services/data/v45.0/wave/datasets/' + id + '/versions'; 
        
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(url);
        request.setMethod('GET');
        request.setHeader('Content-Type', 'application/json;charset=UTF-8');
        request.setHeader('Authorization', 'Bearer ' + UserInfo.getSessionID()); 
        HttpResponse response = http.send(request);
        String details = '';
        if (response.getStatusCode() == 200) {
            details = response.getBody();
        }
        
        return details;
    }
    
    global Integer getDatasetRows(String id) {
        Integer totalRows = 0;
        String details = getDatasetVersions(id);
        Map<String, Object> results = (Map<String, Object>) JSON.deserializeUntyped(details);
        List<Object> versions = (List<Object>) results.get('versions');
        Map<String, Object> version = null;
        for (Object versionObj: versions) {
            version = (Map<String, Object>) versionObj;
            totalRows += (Integer) version.get('totalRows');
        }
        return totalRows;
    }
    
    global List<Object> listDatasets() {
		String sfdcURL = URL.getSalesforceBaseUrl().toExternalForm();

		String url = sfdcURL + '/services/data/v45.0/wave/datasets?pageSize=200'; 
        
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(url);
        request.setMethod('GET');
        request.setHeader('Content-Type', 'application/json;charset=UTF-8');
        request.setHeader('Authorization', 'Bearer ' + UserInfo.getSessionID()); 
        HttpResponse response = http.send(request);
        String details = '';
        List<Object> datasets = null;
        if (response.getStatusCode() == 200) {
            details = response.getBody();
            Map<String, Object> results = (Map<String, Object>) JSON.deserializeUntyped(details);
        	datasets = (List<Object>) results.get('datasets');
        }
        return datasets;        
    }
    
    global Integer getDatasetsTotalRows() {
        Integer totalRows = 0;
        List<Object> datasets = listDatasets();
        System.debug('datasets size: ' + datasets.size());
        String id = null;
        Integer rows = 0;
        Map<String, Object> dataset = null;
        Integer count = 0;
        while (count < datasets.size()) {
            for (Integer i = 0; i < 10; i++) {
                
                dataset = (Map<String, Object>) datasets.get(count + i);
                id = (String) dataset.get('id');
                if (id != null) {
                    rows = getDatasetRows(id);
                    System.debug('dataset ' + id + ' has ' + rows + ' rows');
                    totalRows += rows;
                    System.debug('totalRows: ' + totalRows);
                }
            }
            count += 10;
        }
        /*
        for (Object datasetObj: datasets) {
            dataset = (Map<String, Object>) datasetObj;
            id = (String) dataset.get('id');
            if (id != null) {
	            rows = getDatasetRows(id);
                System.debug('dataset ' + id + ' has ' + rows + ' rows');
    	        totalRows += rows;
                System.debug('totalRows: ' + totalRows);
            }
        }
		*/
        return totalRows;
    }
}