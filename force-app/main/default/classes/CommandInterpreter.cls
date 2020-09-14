public class CommandInterpreter{
/*
    public CommandResponse interpretPhrase(String phrase, CommandAction.ResultStatus requestedStatus, Integer responseLimit){
        List<String> phraseGrammar = new List<String>();
        for (String segment : phrase.split('\\s')){
            if (!phraseGrammar.contains(segment)){
                phraseGrammar.add(segment.toUpperCase());
            }
        }
        String inClause = '\'' + String.join(phraseGrammar,'\', \'') + '\'';
        // I really wish I didn't have to run dynamic soql, but there's a bug in apex where
        // child queries can't use binding variables.
        String soql = 'SELECT Id, ' +
                        'CommandActionable__r.ActionType__c, ' + 
                        'CommandTarget__c, ' + 
                        'Name, ' +
                        '(SELECT Grammar__r.Name, PhraseIndex__c, ActionablePhrase__r.PhraseText__c '+
                          'FROM GrammarCommands__r ' + 
                          'WHERE Grammar__r.Name IN (' + inClause + ') ' + 
                          'ORDER BY ActionablePhrase__c, PhraseIndex__c) '+
                    'FROM Command__c '+
                    'WHERE Id IN (SELECT Command__c FROM CommandGrammar__c ' + 
                          'WHERE (Grammar__r.Name IN ('+ inClause + ')))';
        List<Command__c> matchingCommands = Database.query(soql);    
        
        List<Command> responseCommands = new List<Command>();
        for (Command__c commandRecord : matchingCommands){
            Command command = new Command(); 
            String actionType = commandRecord.CommandActionable__r.ActionType__c;
            command.Id = commandRecord.Id;
            command.Name = commandRecord.Name;
            command.Target = commandRecord.CommandTarget__c;
            Set<String> missingGrammar = new Set<String>();
            Set<String> matchingGrammar = new Set<String>();
            List<MatchingPhrase> matchingPhrases = new List<MatchingPhrase>();
            for (CommandGrammar__c grammar : commandRecord.GrammarCommands__r){
                String matchingPhrase = grammar.ActionablePhrase__r.PhraseText__c + (null == commandRecord.CommandTarget__c ?
                    '' : ' ' + commandRecord.CommandTarget__c);
                matchingPhrases.add(new MatchingPhrase(phrase, matchingPhrase));                
            }
            matchingPhrases.sort();
            command.RankingPhrase = matchingPhrases.get(0);          
            ActionProcessor actionProcessor = getActionProcessor(actionType);
            CommandAction commandAction = actionProcessor.getCommandAction(phrase, actionType, command, responseLimit);
            if (null == requestedStatus || requestedStatus.equals(commandAction.Status)){
                command.Action = commandAction;
                responseCommands.add(command);     
            }
        }            
        responseCommands.sort();
        CommandResponse response = new CommandResponse();
        response.Command = phrase;
        response.ResponseLimit = responseLimit;
        response.Commands = responseCommands;
        return response;
    }
    
    public CommandReferenceResponse getCommandReference(Integer minIndex, Integer maxIndex, String requestedHint){
        Map<Integer, Set<String>> results = new Map<Integer, Set<String>>();
    
        List<CommandGrammar__c> commandGrammars = 
            [SELECT PhraseIndex__c, Grammar__r.Name, ActionablePhrase__r.PhraseText__c
                FROM CommandGrammar__c
                WHERE PhraseIndex__c >= :minIndex AND PhraseIndex__c <= :maxIndex
                ORDER BY PhraseIndex__c];
        
        for (CommandGrammar__c commandGrammar: commandGrammars){
            Integer currentIndex = Integer.valueOf(commandGrammar.PhraseIndex__c);
            String grammar = commandGrammar.Grammar__r.Name;
            String phrase = commandGrammar.ActionablePhrase__r.PhraseText__c;
            Set<String> grammarAtIndex = results.containsKey(currentIndex) ? 
                results.get(currentIndex) : new Set<String>();
            if (requestedHint == null || phrase.toUpperCase().startsWith(requestedHint.toUpperCase())){
                grammarAtIndex.add(grammar);                    
            }
            if (!grammarAtIndex.isEmpty()){
                results.put(currentIndex, grammarAtIndex);
            }
        }
        
        return new CommandReferenceResponse(minIndex, maxIndex, results, requestedHint);
    }
    
    
    private ActionProcessor getActionProcessor(String actionType){
        System.debug('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ actionType: ' + actionType);
        if ('ViewSObject'.equals(actionType) || 'EditSObject'.equals(actionType)){
            return new ViewEditSObjectProcessor();
        }
        else if ('ViewAnalyticsDashboard'.equals(actionType)){
            return new ViewAnalyticsDashboardProcessor();
        }
        else if ('FilterAnalyticsDashboard'.equals(actionType)){
            return new FilterAnalyticsDashboardProcessor();
        }
        else if ('ResetAnalyticsFilter'.equals(actionType)){
            return new ResetAnalyticsFilterProcessor();
        }
        else if ('SelectAnalyticsDashboard'.equals(actionType)){
            return new SelectAnalyticsDashboardProcessor();
        }
        else if ('ClearAnalyticsSelection'.equals(actionType)){
            return new ClearAnalyticsSelectionProcessor();
        }
        else if ('OpenLightningFlow'.equals(actionType)){
            return new ShowLightningFlowProcessor();
        }
        else if ('ListActiveDashboards'.equals(actionType)){
            return new ListActiveDashboardsProcessor();
        }
        else if ('ListFilterFields'.equals(actionType)){
            return new ListFilterFieldsProcessor();
        }
        else if ('ListSelectionFields'.equals(actionType)){
            return new ListSelectionFieldsProcessor();
        }
        else if ('ListFilterFieldValues'.equals(actionType)){
            return new ListFilterFieldValuesProcessor();
        }
        else if ('ListSelectionFieldValues'.equals(actionType)){
            return new ListSelectionFieldValuesProcessor();
        }
        
        else if ('GoToPage'.equals(actionType)){
            return new SelectAnalyticsDashboardPageProcessor();
        }

        else if ('NLQ'.equals(actionType)){
            return new NLQProcessor();
        }


        else if ('ListQuipFolders'.equals(actionType)){
            return new ListQuipFoldersProcessor();
        }
        
        else if ('OpenQuipFolder'.equals(actionType)){
            return new OpenQuipFolderProcessor();
        }
        
        else if ('ListAllListViews'.equals(actionType) || 'ListListViews'.equals(actionType)){
            return new ListListViewsProcessor();
        }
        else if ('ShowListView'.equals(actionType)){
            return new ShowListViewProcessor();
        }
        else if ('NavigateToDashboardPage'.equals(actionType)){
            return new NavigateToDashboardPageProcessor();
        } else {
        
            return new UnknownActionProcessor();
        }
    }
*/

}