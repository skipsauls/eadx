global with sharing class AmazonOrderAction {

    @InvocableMethod(label='Amazon Order' description='Orders a product from Amazon.')
    public static List<Id> reorder(List<Case> cases) {

        List<Id> ids = new List<Id>();
        
        System.debug('AmazonOrderAction.reorder');
        try {
            for (Case c : cases) {
                System.debug('Case: ' + c);
            }
            
            ids = new List<Id>();
            
            ids.add(Id.valueOf('1234567890'));
        } catch (Exception e) {
            System.debug('Exception: ' + e);
        }
                    
        
        return ids;
    }
}