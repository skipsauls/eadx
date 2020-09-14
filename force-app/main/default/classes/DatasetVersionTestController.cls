global with sharing class DatasetVersionTestController {
    @AuraEnabled
	global static Map<String, String> getDatasetVersionIds(String datasetName) {
        Wave.ProjectionNode[] projs = new Wave.ProjectionNode[]{Wave.QueryBuilder.count().alias('c')};
        String query = Wave.QueryBuilder.loadByDeveloperName(datasetName).build('q');
        String[] datasetVersion = query.split('"', 0);
        String[] ids = datasetVersion[1].split('/', 0);
        
        Map<String, String> datasetVersionIds = new Map<String, String>();
        datasetVersionIds.put('datasetId', ids[0]);
        datasetVersionIds.put('versionId', ids[1]);            
        return datasetVersionIds;
	}
}