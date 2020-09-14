global with sharing class MizuhoDashboardStateController {

    @AuraEnabled
    global static Boolean saveState(String userId, String state) {
        
        Mizuho_Dashboard_State__c dashboardState = null;
        
        try {
            dashboardState = [SELECT Id,Name,DashboardState__c,UserId__c FROM Mizuho_Dashboard_State__c WHERE UserId__c =: userId];
        } catch (Exception e) {
        	dashboardState = new Mizuho_Dashboard_State__c();
        }
        
        dashboardState.DashboardState__c = state;
        dashboardState.UserId__c = userId;
        
        upsert dashboardState;
        
        return true;
    }
}