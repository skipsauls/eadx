global with sharing class CmpMethodApexController {
    @AuraEnabled
    global static String echo(String text) {
        return text;
    }
}