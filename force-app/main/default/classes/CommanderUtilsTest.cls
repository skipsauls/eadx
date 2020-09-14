@isTest
private class CommanderUtilsTest {
    static testMethod void validateGetInvocableActions() {
        List<List<sObject>> expected = [FIND '{@InvocableMethod}' IN ALL FIELDS RETURNING ApexClass(Name,NamespacePrefix)];
        List<List<sObject>> actual = CommanderUtils.getInvocableActions();
        System.assertEquals(expected, actual);
    }
}