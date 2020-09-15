global with sharing class ApexDataLoader {

	@AuraEnabled
    global static List<Fortnite_Player_Data__c> getFortnitePlayers(String platform, String window) {
		platform = (platform == null || platform == '*') ? '%' : platform;
        window = window == null ? 'alltime' : window;
        
        //System.debug('getFortnitePlayers - platform: ' + platform + ', window: ' + window);
   		List<Fortnite_Player_Data__c> players = null; //[SELECT Id, Name, Fortnite_Player__r.uid__c, Fortnite_Player__r.username__c, platform__c, window__c, totals__c, stats__c, LastModifiedDate FROM Fortnite_Player_Data__c WHERE platform__c LIKE : platform AND window__c =: window];
        
        /*
        for (Fortnite_Player_Data__c player : players) {
            System.debug('player: ' + player);
        }
		*/
        
        return players;
    }    
    

    @AuraEnabled
    global static Map<String, Object> getFortnitePlayersCsv(String platform, String window) {
		platform = (platform == null || platform == '*') ? '%' : platform;
        window = window == null ? 'alltime' : window;

        //System.debug('getFortnitePlayersCsv- platform: ' + platform + ', window: ' + window);
        
        //List<Fortnite_API_Cache__c> players = [SELECT Id, Name, Cache_Key__c, url__c, body__c, Type__c, LastModifiedDate FROM Fortnite_API_Cache__c WHERE Type__c = 'UserData'];
        
        List<Fortnite_Player_Data__c> playerList = getFortnitePlayers(platform, window);
        
        //System.debug('playerList.size(): ' + playerList.size());

        Map<String, Object> playerData = null;
        String csvLine = null;
        String csv = '';
        String csvHeader = '';
        String delim = '';
		Integer count = 0;
        
        List<String> strings = new List<String>();
        List<String> numbers = new List<String>();
        List<String> groups = new List<String>();
        
        for (Fortnite_Player_Data__c player: playerList) {
			//System.debug('player: ' + player);
            csvHeader = '';
            csvLine = '';
            delim = '';
            
            //csvLine += delim + player.Fortnite_Player__r.username__c;
            delim = ',';            
            //csvLine += delim + player.Fortnite_Player__r.uid__c;
            csvLine += delim + player.platform__c;
            csvLine += delim + player.window__c; 

            if (count < 1) {
                csvHeader = 'username,uid,platform,window';
                
                strings.add('username');
                strings.add('uid');
                strings.add('platform');
                strings.add('window');
            }            
          
            Map<String, Object> totals = (Map<String, Object>) JSON.deserializeUntyped(player.totals__c);
            Map<String, Object> total = null;
            for (String key: totals.keySet()) {
                if (count < 1) {
	                csvHeader += delim + key;
                    numbers.add(key);
                }
                csvLine += delim + (Decimal) totals.get(key);
            }
            Map<String, Object> stats = (Map<String, Object>) JSON.deserializeUntyped(player.stats__c);
            Map<String, Object> stat = null;
            for (String key: stats.keySet()) {
                if (count < 1) {
	                csvHeader += delim + key;
                    numbers.add(key);
                }
                csvLine += delim + (Decimal) stats.get(key);
            }
           
            if (count < 1) {
       			csv += csvHeader += '\n';                
            }
            
            csv += csvLine + '\n';
            
            count++;
        }

        // Ugh
        String jsonSchema = '';
        jsonSchema += '{';
        jsonSchema += '  "fileFormat": {';
        jsonSchema += '    "charsetName": "UTF-8",';
        jsonSchema += '    "fieldsEnclosedBy": "\\"",';
        jsonSchema += '    "fieldsDelimitedBy": ",",';
        jsonSchema += '    "numberOfLinesToIgnore": 1';
        jsonSchema += '  },';
        jsonSchema += '  "objects": [';
        jsonSchema += '     {';
        jsonSchema += '        "connector": "FortniteCSVConnector",';
        jsonSchema += '        "description": "",';
        jsonSchema += '        "fullyQualifiedName": "eadx__fortnite_players",';
        jsonSchema += '        "label": "Fortnite Players",';
        jsonSchema += '        "name": "fortnite_players",';
        jsonSchema += '        "fields": [';
        
        
        Integer size = strings.size();
        Integer index = 0;
        for (String s: strings) {
            jsonSchema += '        {';
            jsonSchema += '            "description": "",';
            jsonSchema += '            "fullyQualifiedName": "' + s + '",';
            jsonSchema += '            "label": "' + s + '",';
            jsonSchema += '            "name": "' + s + '",';
            jsonSchema += '            "isSystemField": false,';
            jsonSchema += '            "isUniqueId": false,';
            jsonSchema += '            "isMultiValue": false,';
            jsonSchema += '            "type": "Text"';
            jsonSchema += '        },';
            /*
            if (index < size - 1) {
                jsonSchema += ',';
            }
*/
            index++;
        }

        size = numbers.size();
        index = 0;
        for (String s: numbers) {
            jsonSchema += '        {';
            jsonSchema += '            "description": "",';
            jsonSchema += '            "fullyQualifiedName": "' + s + '",';
            jsonSchema += '            "label": "' + s + '",';
            jsonSchema += '            "name": "' + s + '",';
            jsonSchema += '            "isSystemField": false,';
            jsonSchema += '            "isUniqueId": false,';
            jsonSchema += '            "isMultiValue": false,';
			jsonSchema += '            "type": "Numeric",';
			jsonSchema += '            "precision": 18,';
            jsonSchema += '            "scale": 2,';
            jsonSchema += '            "defaultValue": 0';
            jsonSchema += '        }';
            if (index < size - 1) {
                jsonSchema += ',';
            }
            index++;
        }

		jsonSchema += '        ]';
        jsonSchema += '     }';
        jsonSchema += '   ]';
        jsonSchema += '}';        

        //System.debug('csv: ' + csv);

        Map<String, Object> retValue = new Map<String, Object>();
        retValue.put('schema', jsonSchema);
        retValue.put('csv', csv);
        return retValue;
        //return '{"schema":' + jsonSchema + ',"csv":"\'' + csv + '\'"}';
    }

    @AuraEnabled
    global static String loadFortnitePlayers(String platform, String window) {

        //System.debug('loadFortnitePlayers - platform: ' + platform + ', window: ' + window);
        String userEmail = 'ssauls@salesforce.com';
        
		// Set the defaults
		platform = platform == null ? '*' : platform;
        window = window == null ? 'alltime' : window;
        
        //System.debug('loadFortnitePlayers - platform: ' + platform + ', window: ' + window);

        
		Map<String, Object> fortnitePlayersCsv = getFortnitePlayersCsv(platform, window);
        String jsonSchema = (String) fortnitePlayersCsv.get('schema');
        String csvString = (String) fortnitePlayersCsv.get('csv');
        
        //System.debug('csvString: ' + csvString);
        
        //System.debug('loadFortnitePlayers');
        //System.debug('jsonSchema: ' + jsonSchema);
        //System.debug('csvString: ' + csvString);
        InsightsExternalData ied = new InsightsExternalData(
            EdgemartAlias='fortnite_players',
            EdgemartContainer='Demo_App',
            format='csv',
            operation='Overwrite',
            NotificationEmail=userEmail,
            NotificationSent='Always',
            MetadataJson= Blob.valueOf(jsonSchema),
            Status='New');

        INSERT ied;
        Id iedId = ied.Id; 
                
        Blob blobCsv = Blob.valueOf(csvString);
        String stringCsv = EncodingUtil.base64Encode(blobCsv);
        Blob theCsv = EncodingUtil.base64Decode(stringCsv);
        
        InsightsExternalDataPart iedp = new InsightsExternalDataPart();
        iedp.insightsExternalDataId = iedId;
        iedp.DataFile = theCsv;
        iedp.PartNumber = 1;
        INSERT iedp;
        
        InsightsExternalData ied2 = new InsightsExternalData(id=iedId,action='Process');
        UPDATE ied2;
        
        return null;
    }

    
    @AuraEnabled
    global static String testLoad() {

        String userEmail = 'ssauls@salesforce.com';
        
        
        String csvString = '';
        csvString += 'Name,Value,Color\n';
        csvString += 'John Doe,1234,Red\n';
        csvString += 'Bob Smith,4445,Green\n';
                
        String jsonSchema = '';
        
        jsonSchema += '{';
        jsonSchema += '    "fileFormat": {';
        jsonSchema += '    "charsetName": "UTF-8",';
        jsonSchema += '    "fieldsEnclosedBy": "\\"",';
        jsonSchema += '    "fieldsDelimitedBy": ",",';
        jsonSchema += '    "numberOfLinesToIgnore": 1';
        jsonSchema += '  },';
        jsonSchema += '  "objects": [';
        jsonSchema += '  {';
        jsonSchema += '        "connector": "AcmeCSVConnector",';
        jsonSchema += '        "description": "",';
        jsonSchema += '        "fullyQualifiedName": "eadx__test1234",';
        jsonSchema += '        "label": "Test 1234",';
        jsonSchema += '        "name": "test1234",';
        jsonSchema += '        "fields": [';
        jsonSchema += '        {';
        jsonSchema += '            "description": "",';
        jsonSchema += '            "fullyQualifiedName": "Name",';
        jsonSchema += '            "label": "Name",';
        jsonSchema += '            "name": "Name",';
        jsonSchema += '            "isSystemField": false,';
        jsonSchema += '            "isUniqueId": false,';
        jsonSchema += '            "isMultiValue": false,';
        jsonSchema += '            "type": "Text"';
        jsonSchema += '        },';
        jsonSchema += '        {';
        jsonSchema += '            "description": "",';
        jsonSchema += '            "fullyQualifiedName": "Value",';
        jsonSchema += '            "label": "Value",';
        jsonSchema += '            "name": "Value",';
        jsonSchema += '            "isSystemField": false,';
        jsonSchema += '            "defaultValue": "0",';
        jsonSchema += '            "isUniqueId": false,';
        jsonSchema += '            "type": "Numeric",';
        jsonSchema += '            "precision": 10,';
        jsonSchema += '            "scale": 2,';
        jsonSchema += '            "format": "$#,##0.00"';
        jsonSchema += '        },';
        jsonSchema += '        {';
        jsonSchema += '            "description": "",';
        jsonSchema += '            "fullyQualifiedName": "Color",';
        jsonSchema += '            "label": "Color",';
        jsonSchema += '            "name": "Color",';
        jsonSchema += '            "isSystemField": false,';
        jsonSchema += '            "isUniqueId": false,';
        jsonSchema += '            "isMultiValue": false,';
        jsonSchema += '            "type": "Text"';
        jsonSchema += '        }';
        jsonSchema += '     ]';
        jsonSchema += '    }';
        jsonSchema += '  ]';
        jsonSchema += '}';    
        
        System.debug(jsonSchema);
        
        InsightsExternalData ied = new InsightsExternalData(
            EdgemartAlias='test1234',
            format='csv',
            operation='Overwrite',
            NotificationEmail=userEmail,
            NotificationSent='Always',
            MetadataJson= Blob.valueOf(jsonSchema),
            Status='New');

        INSERT ied;
        Id iedId = ied.Id; 
                
        Blob blobCsv = Blob.valueOf(csvString);
        String stringCsv = EncodingUtil.base64Encode(blobCsv);
        Blob theCsv = EncodingUtil.base64Decode(stringCsv);
        
        InsightsExternalDataPart iedp = new InsightsExternalDataPart();
        iedp.insightsExternalDataId = iedId;
        iedp.DataFile = theCsv;
        iedp.PartNumber = 1;
        INSERT iedp;
        
        InsightsExternalData ied2 = new InsightsExternalData(id=iedId,action='Process');
        UPDATE ied2;
        
        return null;
    }
}