@isTest
private class ListViewControllerTest {

    static testMethod void testGetRecords(){
    
        String query = 'SELECT Id,Leadsource,StageName FROM Opportunity';
        List<SObject> results1 = ListViewController.getRecords(query);
        List<SObject> results2 = [SELECT Id,Leadsource,StageName FROM Opportunity];
        System.assertEquals(results1.size(), results2.size());
    }
}