global with sharing class DashboardStateController {

    @AuraEnabled
    global static String getDashboardState(String userId) {
        
        
        User theUser = [Select Id, ProfileId from User where Id=: userId];
 
		String baseUrl = URL.getSalesforceBaseUrl().toExternalForm();

        String url = baseUrl + '/services/data/v49.0/wave/dashboards/0FKB0000000L3cTOAS/savedviews?type=user';
        
        HttpRequest request = new HttpRequest();        
        Http http = new Http();
        request.setEndpoint(url);
        request.setMethod('GET');
        
        HTTPResponse response = null;
        
        system.RunAs(theUser) {

            response = http.send(request);
        }
        
        System.debug('response.body: ' + response.getBody());
        
        return response.getBody();
    }
}