/*
*	Utility class for the management of Sales Wave quotas.
*	References: https://resources.docs.salesforce.com/sfdc/pdf/bi_dev_guide_ext_data.pdf
*
*/
public with sharing class SalesWaveQuotas {
	
	public SalesWaveQuotas() {
		
	}

	// Returns all users in CSV format, that are owners of any SalesWaveScripted Opportunity.
	private static List<String> getOpportunitiesUserLines(){
        
        List<String> userLines = new List<String>();
        
        // Retrieve record type
        //RecordType recType = [SELECT Id FROM RecordType WHERE Name = 'SalesWaveScripted' AND SobjectType = 'Opportunity'];
        
        // Retrieve User Ids
        List<Id> lstUserIds = new List<Id>();
        List<AggregateResult> lstOpps = [SELECT OwnerId FROM Opportunity GROUP BY OwnerId];

        for(AggregateResult op : lstOpps){
        	lstUserIds.add((Id)op.get('OwnerId'));
        }

        List<User> lstUsers = [SELECT Name, Username FROM User WHERE Id IN :lstUserIds];
        for(User u : lstUsers){
        	userLines.add(String.format('{0},{1}', new String[]{u.Name, u.Username}));
        }

        // Retrieved users and generated one line per each: <Name>,<Username>

        return userLines;
    }

    // Updates the Quota dataset identified by datasetName, within the Sales Wave application identified by appName.
    // Example usage: SalesWaveQuotas.updateQuotaDataset(2016,2017 1, 12, 6000000, 'Vandelay_Sales', 'plain_quota4');
    public static void updateQuotaDataset(Integer startYear,Integer endYear, Integer startMonth, Integer endMonth, Integer quotaAmount, String datasetName){

    	// Generate header line of the CSV to upload
    	List<String> csvLines = new String[]{'QuotaAmount,StartDate,OwnerName,Username\n'};

    	// Get user lines to merge in quota data
    	List<String> userLines = SalesWaveQuotas.getOpportunitiesUserLines();

    	// For each user we do the merge
    	for(String userLn : userLines){
    		for(Integer year=startYear;year<=endYear;year++){
            for(Integer i=startMonth;i<=endMonth;i++){
    			String month = i < 10 ? '0' + String.valueOf(i) : String.valueOf(i);
				String startDate = String.format('{0}-{1}-01', new String[]{String.valueOf(year), month});
				csvLines.add(String.format('{0},{1},{2}', new String[]{String.valueOf(quotaAmount), startDate, userLn}));
    		}
            }
    	}

    	// Get the JSON from the Static Resource
    	StaticResource srJson = [SELECT Body FROM StaticResource WHERE Name = 'SalesWaveScriptedQuotaJson'];

    	// Configure the Upload
    	InsightsExternalData iedObj = new InsightsExternalData();
        iedObj.Format = 'Csv';
        iedObj.EdgemartAlias = datasetName;
       // iedObj.EdgemartContainer = appName;
        iedObj.Operation = 'Overwrite';
        iedObj.Action = 'None';
        iedObj.MetadataJson = EncodingUtil.base64Decode(EncodingUtil.base64Encode(srJson.Body));

        insert iedObj;        

        // Add the Data
        InsightsExternalDataPart dataPart = new InsightsExternalDataPart();
        dataPart.InsightsExternalDataId = iedObj.Id;
        dataPart.PartNumber = 1;
        Blob csvBlob = Blob.valueof(String.join(csvLines, '\n'));
		Integer size = csvBlob.size();
        dataPart.dataFile = csvBlob;
        dataPart.DataLength = size;
        
        insert dataPart;

        System.debug(String.format('Method updateQuotaDataset finished successfully. InsightsExternalData Id: {0}, InsightsExternalDataPart Id: {1}.', new String[]{iedObj.Id, dataPart.Id}));

        // Final Step: Manage the Upload
        iedObj.Action = 'Process';
        update iedObj;
    }
	
}