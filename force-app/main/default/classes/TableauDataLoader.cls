global with sharing class TableauDataLoader {
    
    global class DataLoaderField {
        public String name;
        public String fullyQualifiedName;
        public String label;
        public String description;
		public Boolean isSystemField;
		public Boolean isUniqueId;
        public Boolean isMultiValue;
        public Integer precision;
        public Integer scale;
        public Double defaultValue;
        public String format;
        public String type;
    }
    
    global class DataLoaderObject {
        public String connector;
        public String description;
        public String fullyQualifiedName;
        public String label;
        public String name;
        public List<DataLoaderField> fields;
    }
    
    global class DataLoaderFileFormat {
        public String charsetName;
        public String fieldsEnclosedBy;
        public String fieldsDelimitedBy;
        public Integer numberOfLinesToIgnore;
    }
    
    global class DataLoaderSchema {
    	public DataLoaderFileFormat fileFormat;
        public List<DataLoaderObject> objects;
    }    
    
    public static String getDataType(String t) {
        System.debug('getDataType: ' + t);
        String type = 'Text';
        try {
            Double.valueOf(t);
            type = 'Numeric';
        } catch (Exception e) {    
        }
        
        try {
            Integer.valueOf(t);
            type = 'Numeric';
        } catch (Exception e) {    
        }
        
        try {
            if (t.toLowerCase() == 'true') {
                type = 'Text';
            } else if (t.toLowerCase() == 'false') {
                type = 'Text';
            }
        } catch (Exception e) {    
        }
        
        try {
            Date.valueOf(t);
            type = 'Date';
        } catch (Exception e) {    
        }
        
        if (t.indexOf('%') >= 0) {
            //type = 'Numeric';
            type = 'Text';
        }
        
        System.debug('returning type: ' + type);
        
        return type;
    }

    public static String getDataFormat(String t) {
        System.debug('getDataFormat: ' + t);
        String format = '#,##0.00';
        if (t.indexOf('%') >= 0) {
            format = '##.00%';
        } else if (t.indexOf('$') >= 0) {
            format = '$#,##0.00';
        }
		System.debug('returning format: ' + format);
        return format;
    }
    
    public static void createDatasetFromTableauView(String folderDeveloperName, String datasetName, String csvViewData) {

        System.debug('createDatasetFromTableauView: ' + folderDeveloperName + ', ' + datasetName);
        
        //System.debug('csvViewData: ' + csvViewData);


        
        // Sanitize the datasetName
		datasetName = datasetName.replaceAll('[^a-zA-Z0-9]', '_');
        
        List<String> csvRowData = csvViewData.split('\\n');
        System.debug('csvRowData: ' + csvRowData);
        
        
        csvViewData = csvViewData.substring(csvViewData.indexOf('\n') + 1);
        //System.debug('csvViewData: ' + csvViewData);
        
/*        
      	csvViewData = '';
        for (Integer i = 0; i < 3; i++) {
            System.debug('row ' + i + ': ' + csvRowData.get(i));
            csvViewData += csvRowData.get(i) + '\n';
        }

        
        System.debug('csvViewData: \n' + csvViewData);
*/
        
        System.debug('csvRowData.size(): ' + csvRowData.size());
        
        String labelRow = csvRowData.get(0);
        
        //labelRow = 'a,b,c,d,e,f,g';
        
        List<String> labels = labelRow.split(',');
        System.debug('labels: ' + labels);
        
        String firstRow = csvRowData.get(1).trim();
        firstRow = firstRow.replace(',(?=(?:(?:[^"]*"){2})*[^"]*$)', '');
        
        //String firstRow = csvRowData.get(1).replace('"', '');
        
        System.debug('firstRow: ' + firstRow);
        List<String> firstRowData = firstRow.split(',');
        System.debug('firstRowData: ' + firstRowData);
     

        DataLoaderObject dlo = new DataLoaderObject();
        dlo.connector = 'TableauViewConector';
        dlo.name = 'TableauViewConnector';
        dlo.fullyQualifiedName = 'eadx__TableauViewConnector';
        dlo.label = 'Tableau View Connector';
        dlo.description = 'Data loader connector for Tableau View data';
        dlo.fields = new List<DataLoaderField>();
        
        DataLoaderField field = null;
        
        Integer i = 0;
        String name = null;
        for (String label: labels) {
            
            System.debug('label: ' + label);
            
            name = label.trim().replaceAll('[^a-zA-Z0-9]', ' ');
            name = name.trim().replaceAll('\\s+', '_');
            
            try {
                Integer.valueOf(name.substring(0));
                name = 'n_' + name;
            } catch (Exception e) {}
            
            System.debug('name: ' + name);
            
            field = new DataLoaderField();
            field.name = name;
            System.debug('field.name: ' + field.name);
            field.fullyQualifiedName = datasetName + '.' + name;
            field.label = label;
            field.description = label;
            field.isSystemField = false;
            field.isUniqueId = false;
            field.isMultiValue = false;
            
            System.debug('firstRowData: ' + firstRowData[i]);
            
            field.type = getDataType(firstRowData[i]);
        
            System.debug('field.type: ' + field.type);
            
            if (field.type == 'Numeric') {
                field.precision = 18;
                field.scale = 2;
                field.defaultValue = 0;
	            field.format = getDataFormat(firstRowData[i]);
            } else if (field.type == 'Date') {
                field.format = 'dd-MM-yy HH:mm:ss';
            }
            
            System.debug('field.format: ' + field.format);
            System.debug('field: ' + field);
            
	        dlo.fields.add(field);
            
            i++;
    	}
        
        //System.debug('dlo: ' + JSON.serializePretty(dlo));
        
        DataLoaderSchema dls = new DataLoaderSchema();
        dls.fileFormat = new DataLoaderFileFormat();
        dls.fileFormat.charsetName = 'UTF-8';
        dls.fileFormat.fieldsEnclosedBy = '"';
        dls.fileFormat.fieldsDelimitedBy = ',';
        dls.fileFormat.numberOfLinesToIgnore = 1;
        
        dls.objects = new List<DataLoaderObject>();        
		dls.objects.add(dlo);

        //System.debug('dls: ' + JSON.serializePretty(dls));
        
        String jsonSchema = JSON.serialize(dls);
        //System.debug('jsonSchema: ' + jsonSchema);        
        
        String userEmail = 'ssauls@salesforce.com';

        InsightsExternalData ied = new InsightsExternalData(
            EdgemartAlias=datasetName,
            EdgemartContainer=folderDeveloperName,
            format='csv',
            operation='Overwrite',
            NotificationEmail=userEmail,
            NotificationSent='Always',
            MetadataJson=Blob.valueOf(jsonSchema),
            Status='New');

        //System.debug('ied: ' + JSON.serializePretty(ied));
        
        INSERT ied;
        Id iedId = ied.Id; 
                
        Blob blobCsv = Blob.valueOf(csvViewData);
        String stringCsv = EncodingUtil.base64Encode(blobCsv);
        Blob theCsv = EncodingUtil.base64Decode(stringCsv);
        
        InsightsExternalDataPart iedp = new InsightsExternalDataPart();
        iedp.insightsExternalDataId = iedId;
        iedp.DataFile = theCsv;
        iedp.PartNumber = 1;
        INSERT iedp;
        
        InsightsExternalData ied2 = new InsightsExternalData(id=iedId,action='Process');
        UPDATE ied2;          

    }
    
    public static void test2() {
        String csvViewData = 'Category,Product Name,Segment,Sub-Category,Profit Ratio,Profit,Sales\n';
        csvViewData += 'Furniture,3M Hangers With Command Adhesive,Consumer,Furnishings,35.9%,$12,$34\n';
        csvViewData += 'Technology,Xerox WorkCentre 6505DN Laser Multifunction Printer,Corporate,Machines,-10.0%,($252),"$2,520"\n';
        System.debug('csvViewData');
        System.debug(csvViewData);
        
        createDatasetFromTableauView('SharedApp', 'Product', csvViewData);
    }
    
    public static void test() {
        
        DataLoaderObject dlo = new DataLoaderObject();
        dlo.connector = 'DemoDemo';
        dlo.name = 'DemoDemo';
        dlo.fullyQualifiedName = 'eadx__DemoDemo';
        dlo.label = 'Demo Connector';
        dlo.description = 'Demo connector';
        dlo.fields = new List<DataLoaderField>();
        
        DataLoaderField field = new DataLoaderField();
        field.name = 'Name';
        field.fullyQualifiedName = 'Name';
        field.label = 'Name';
        field.description = 'The name';
        field.isSystemField = false;
        field.isUniqueId = false;
        field.isMultiValue = false;
        field.type = 'Text';
        
        dlo.fields.add(field);

        field = new DataLoaderField();
        field.name = 'Value';
        field.fullyQualifiedName = 'Value';
        field.label = 'Value';
        field.description = 'The value';
        field.isSystemField = false;
        field.isUniqueId = false;
        field.isMultiValue = false;
        field.type = 'Numeric';
        field.precision = 10;
        field.scale = 2;
        field.defaultValue = 0;
        field.format = '$#,##0.00';

        dlo.fields.add(field);

        field = new DataLoaderField();
        field.name = 'Color';
        field.fullyQualifiedName = 'Color';
        field.label = 'Color';
        field.description = 'The color';
        field.isSystemField = false;
        field.isUniqueId = false;
        field.isMultiValue = false;
        field.type = 'Text';

        dlo.fields.add(field);
        
        DataLoaderSchema dls = new DataLoaderSchema();
        dls.fileFormat = new DataLoaderFileFormat();
        dls.fileFormat.charsetName = 'UTF-8';
        dls.fileFormat.fieldsEnclosedBy = '"';
        dls.fileFormat.fieldsDelimitedBy = ',';
        dls.fileFormat.numberOfLinesToIgnore = 1;
        
        dls.objects = new List<DataLoaderObject>();
        
		dls.objects.add(dlo);
    
        System.debug('dls: ' + JSON.serializePretty(dls));
        
        String jsonSchema = JSON.serialize(dls);
        System.debug('jsonSchema: ' + jsonSchema);
        
        
        String csvString = '';
        csvString += 'Name,Value,Color\n';
        csvString += 'John Doe,1234,Red\n';
        csvString += 'Bob Smith,4445,Green\n';        
        
        System.debug('csvString: \n' + csvString);        
        
        String userEmail = 'ssauls@salesforce.com';
        
        InsightsExternalData ied = new InsightsExternalData(
            EdgemartAlias='new_test',
            format='csv',
            operation='Overwrite',
            NotificationEmail=userEmail,
            NotificationSent='Always',
            MetadataJson= Blob.valueOf(jsonSchema),
            Status='New');

        
        System.debug('ied: ' + JSON.serializePretty(ied));
        
        
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
    }    
}