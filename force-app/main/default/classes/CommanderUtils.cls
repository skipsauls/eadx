global with sharing class CommanderUtils {
    
    @AuraEnabled
    global static List<List<SObject>> getInvocableActions() {
        List<List<sObject>> searchList = [FIND '{@InvocableMethod}' IN ALL FIELDS RETURNING ApexClass(Id,Name,NamespacePrefix)];
        return searchList;
    }   
    
    @AuraEnabled 
    public static user fetchUser(){
        // query current user information  
        User oUser = [select id, Name, SmallPhotoURL, Username, Alias, Country, Email, FirstName, LastName, IsActive
                      FROM User Where id =: userInfo.getUserId()];
        return oUser;
    }
}