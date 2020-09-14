@RestResource(urlMapping='/ea/platformevents/*') 
global with sharing class eaPlatformEventController {

/*               
    global static String doPost(String type, String target, String payload) {
    
        String ret = 'foo';
        return ret;    
    }
*/    
    @HttpPost        
    @AuraEnabled
    global static String fireEvent(String type, String target, String payload) {

        EinsteinAnalyticsEvent__e event = new EinsteinAnalyticsEvent__e();
        event.type__c = type;
        event.target__c = target;
        event.payload__c = payload;
        
        EventBus.publish(event);
        
        String ret = 'foo';
        return ret;    
    }
    
}