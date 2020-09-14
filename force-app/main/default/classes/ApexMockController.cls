@RestResource(urlMapping='/apexmock/*') 
global with sharing class ApexMockController {
     
    // Wrapper classes
    global class MockObj {
        public String name;
        public String body;
        
        public MockObj(String n, String b) {
            this.name = n;
            this.body = b;
        }
        
        public MockObj(Mock__c mock) {
            this.name = mock.Name;
            this.body = mock.Body__c;
        }
    }

    @HttpPost            
    global static String doPost(String name, String dummy) {
        Mock__c mock = null;
        String body = null;
        
        try {
            mock = [SELECT Id, Name, Body__c FROM Mock__c WHERE name =: name];
            body = mock.Body__c;
        } catch (Exception e) {
        }
                
        return body;
    }

    global static MockObj updateMock(String name, String body) {
        Mock__c mock = null;
        
        try {
            mock = [SELECT Id, Name, Body__c FROM Mock__c WHERE name =: name];
        } catch (Exception e) {
            mock = new Mock__c();
            mock.Name = name;        
        }
        
        mock.Body__c = body;
        
       
        UPSERT mock;
        
        
        
        /* FOR TESTING ONLY */
        EinsteinAnalyticsEvent__e event = new EinsteinAnalyticsEvent__e();
        event.type__c = 'refresh';
        event.target__c = '0FKB000000092VyOAI';
        event.payload__c = null;
        
        EventBus.publish(event);
        
               
        
        
        return new MockObj(name, body);
    }

    @HttpPut           
    global static String doPut() {
        RestRequest req = RestContext.request;
        RestResponse res = RestContext.response;
        String name = req.requestURI.substring(req.requestURI.lastIndexOf('/') + 1);

        MockObj mock = null;
        
        if (name != 'apexmock') {
            String body = req.requestBody.toString();
            mock = updateMock(name, body);
        }
        return JSON.serialize(mock);
    }

    @AuraEnabled
    global static String putMock(String name, String body) {
        MockObj mock = updateMock(name, body);
        return JSON.serialize(mock);
    }
            
    global static Map<String, MockObj> getMocks(String name) {
        Map<String, MockObj> mockObjs = new Map<String, MockObj>();
        if (name != null && name != 'apexmock') {
            Mock__c mock = [SELECT Id, Name, Body__c FROM Mock__c WHERE name =: name];
            mockObjs.put(mock.Name, new MockObj(mock.Name, mock.Body__c));
        } else {
            List<Mock__c> mocks = [SELECT Id, Name, Body__c FROM Mock__c ORDER BY Name];
            for (Mock__c mock : mocks) {
                mockObjs.put(mock.Name, new MockObj(mock.Name, mock.Body__c));
            }
        }
        
        return mockObjs;
    }

    @HttpGet
    global static Map<String, MockObj> doGet() {
        RestRequest req = RestContext.request;
        RestResponse res = RestContext.response;
        String name = req.requestURI.substring(req.requestURI.lastIndexOf('/') + 1);
        return getMocks(name);
    }

    @AuraEnabled
    global static String listMocks(String name) {
        Map<String, MockObj> mocks = getMocks(name);
        return JSON.serialize(mocks);
    }
    
    @HttpDelete
    global static String doDelete() {
        RestRequest req = RestContext.request;
        RestResponse res = RestContext.response;
        String name = req.requestURI.substring(req.requestURI.lastIndexOf('/') + 1);
        String msg = null;
        if (name != 'apexmock') {
            try {
                Mock__c mock = [SELECT Id, Name, Body__c FROM Mock__c WHERE name =: name];
                DELETE mock;
                msg = 'Successfully deleted ' + mock.Name;
            } catch (Exception e) {
                msg = 'Exception: ' + e.getMessage();            
            }
        } else {
            msg = 'DELETE not applicable to list endpoint';
        }
        
        return '{"msg": "' + msg + '"}';
    }
    
}