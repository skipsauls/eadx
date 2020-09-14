public class ListListViewsProcessor
extends ActionProcessor{

    public String replaceIgnoreCase(String replace, String with, String inText) {
        String replaceLower = replace.toLowerCase();
        String inTextLower = inText.toLowerCase();
        Integer indexOfTag = inTextLower.indexOf(replaceLower);
        if(indexOfTag > -1) {
            String replaceAsInText = inText.substring(indexOfTag, (indexOfTag+replace.length()));
            inText = inText.replace(replaceAsInText, with);
            inText = replaceIgnoreCase(replace, with, inText);
        }
        return inText;
    }
    
    public override CommandAction getCommandAction(String requestedPhrase, String actionType, Command command, Integer resultLimit){
    
        System.debug('ListListViewsProcessor.getCommandAction - requestedPhrase: ' + requestedPhrase);
        
        List<Object> results = new List<Object>();
        Map<String, String> result = null;
                        
        if (requestedPhrase.toLowerCase().indexOf('list views') >= 0 || requestedPhrase.toLowerCase().indexOf('listviews') >= 0) {
            
            String criteria = getPhraseAfterKeyword(requestedPhrase, 'list');
    
            System.debug('criteria: ' + criteria);
            
            // Cheap fuzzy matching
            String phrase = replaceIgnoreCase('list views', 'listviews', criteria);
     
            System.debug('phrase: ' + phrase);
            
            String target = phrase.substring(0, phrase.toLowerCase().indexOf('listviews')).trim();
            //String target = phrase.substringBefore('listviews').trim();
            
            System.debug('target: ' + target);
    
            if (target.toLowerCase() == 'all') {            
                actionType = 'ListListViews';
                List<ListView> listViews = [SELECT Id,Name,NamespacePrefix,DeveloperName,SObjectType FROM ListView WHERE IsSoqlCompatible = true ORDER BY SObjectType];    
                Map<String, String> sObjectTypes = new Map<String, String>();
                for (ListView listView : listViews) {
                    if (sObjectTypes.get(listView.SObjectType) == null) {
                        result = new Map<String, String>();
                        result.put('name', listView.SObjectType);
                        result.put('sObjectType', listView.SObjectType);                            
                        results.add(result);                
                        sObjectTypes.put(listView.SObjectType, listView.SObjectType);
                    }
                }
            } else {
                actionType = 'ShowListView';
                List<ListView> listViews = [SELECT Id,Name,NamespacePrefix,DeveloperName,SObjectType FROM ListView WHERE SObjectType =: target ORDER BY Name];
        
                for (ListView listView : listViews) {
                    result = new Map<String, String>();
                    result.put('id', listView.Id);
                    result.put('name', listView.Name);
                    result.put('namespacePrefix', listView.NamespacePrefix);
                    result.put('developerName', listView.DeveloperName);
                    result.put('sObjectType', listView.SObjectType);
                    results.add(result);                
                }
            }
        }
                    
        return new CommandAction(CommandAction.ResultStatus.SUCCESS, actionType, results);
    }
}