public class ShowListViewProcessor
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
    
        System.debug('ShowListViewProcessor.getCommandAction - requestedPhrase: ' + requestedPhrase);

        List<Object> results = new List<Object>();
        Map<String, String> result = null;

        if ((requestedPhrase.toLowerCase().indexOf('list view') >= 0 || requestedPhrase.toLowerCase().indexOf('listview') >= 0) && (requestedPhrase.toLowerCase().indexOf('list views') <= 0 && requestedPhrase.toLowerCase().indexOf('listviews') <= 0)) {
            String criteria = getPhraseAfterKeyword(requestedPhrase, 'show');
    
            System.debug('criteria: ' + criteria);
            
            // Cheap fuzzy matching
            String phrase = replaceIgnoreCase('list view', 'listview', criteria);
     
            System.debug('phrase: ' + phrase);
            
            String target = phrase.substring(0, phrase.toLowerCase().indexOf('listview')).trim();
            //String target = phrase.substringBefore('listviews').trim();
            
            System.debug('target: ' + target);
    
            actionType = 'ShowListView';
            List<ListView> listViews = [SELECT Id,Name,NamespacePrefix,DeveloperName,SObjectType FROM ListView WHERE Name =: target];
            ListView listView = listViews[0];    
            result = new Map<String, String>();
            result.put('id', listView.Id);
            result.put('name', listView.Name);
            result.put('namespacePrefix', listView.NamespacePrefix);
            result.put('developerName', listView.DeveloperName);
            result.put('sObjectType', listView.SObjectType);
            results.add(result);                
        }
                    
        return new CommandAction(CommandAction.ResultStatus.SUCCESS, actionType, results);
    }
}