global with sharing class CheckController {

    public Boolean hasEinsteinAnalytics = false;
    
    public PageReference checkLicense() {
    
        try {
            String userId = UserInfo.getUserId();
            SObject check = [SELECT PermissionSet.Id FROM PermissionSetAssignment WHERE Assignee.Id =: userId AND PermissionSet.Label = 'Einstein Analytics Platform Admin'];

            if (check != null) {
                hasEinsteinAnalytics = true;
            }        
        } catch (Exception e) {
        }
                
        return null;
    }
    
    public Boolean getHasEinsteinAnalytics() {
        return hasEinsteinAnalytics;
    }
    
}