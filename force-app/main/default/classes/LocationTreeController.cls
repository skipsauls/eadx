public with sharing class LocationTreeController {

    public static Integer defaultLim = 10000;
    
    @AuraEnabled
    public static List<User> getUserAddresses(Integer lim) {
        lim = lim == null ? defaultLim : lim;
        return [SELECT Name, Street, City, State, PostalCode, Country, Latitude, Longitude FROM User ORDER BY Country, State, City, Street LIMIT :lim];    
    }

    @AuraEnabled
    public static List<Lead> getLeadAddresses(Integer lim) {
        lim = lim == null ? defaultLim : lim;
        return [SELECT Name, Street, City, State, PostalCode, Country, Latitude, Longitude FROM Lead ORDER BY Country, State, City, Street LIMIT :lim];    
    }

    @AuraEnabled
    public static List<Contact> getContactAddresses(Integer lim) {
        lim = lim == null ? defaultLim : lim;
        return [SELECT Name, MailingStreet, MailingCity, MailingState, MailingPostalCode, MailingCountry, MailingLatitude, MailingLongitude FROM Contact ORDER BY MailingCountry, MailingState, MailingCity, MailingStreet LIMIT :lim];    
    }

    @AuraEnabled
    public static List<Account> getAccountShippingAddresses(Integer lim) {
        lim = lim == null ? defaultLim : lim;
        return [SELECT Name, ShippingStreet, ShippingCity, ShippingState, ShippingPostalCode, ShippingCountry, ShippingLatitude, ShippingLongitude FROM Account ORDER BY ShippingCountry, ShippingState, ShippingCity, ShippingStreet LIMIT :lim];    
    }

    @AuraEnabled
    public static List<Account> getAccountBillingAddresses(Integer lim) {
        lim = lim == null ? defaultLim : lim;
        return [SELECT Name, BillingStreet, BillingCity, BillingState, BillingPostalCode, BillingCountry, BillingLatitude, BillingLongitude FROM Account ORDER BY BillingCountry, BillingState, BillingCity, BillingStreet LIMIT :lim];    
    }


        
}