public class CommandGrammarIndexer{
/*
    public void reindexCommand(Command__c command){
        // First, let's delete any grammar records for this command
        List<CommandGrammar__c> existingCommandGrammar = [SELECT Id FROM CommandGrammar__c
            where Command__c = :command.Id];
        delete existingCommandGrammar;
            
        // Now, let's rebuild the grammar for the command
        List<ActionablePhrase__c> phrases = [SELECT Id, PhraseText__c FROM ActionablePhrase__c 
            WHERE Actionable__r.Id = :command.CommandActionable__c];
        for (ActionablePhrase__c actionablePhrase : phrases){
            String phraseText = actionablePhrase.PhraseText__c;
            if (null != phraseText){
                List<String> phraseContents = phraseText.split('\\s');
                // Add the command target into the grammar
                String commandTarget = command.CommandTarget__c;
                if (null != commandTarget){
                    phraseContents.add(commandTarget);
                }
                Map<String, Grammar__c> existingGrammar = insertOrGetExistingGrammar(phraseContents);
                List<CommandGrammar__c> commandGrammars = new List<CommandGrammar__c>();
                for (Integer i = 0; i < phraseContents.size(); i++) {
                    String grammarSegment = phraseContents.get(i);
                    Grammar__c grammar = existingGrammar.get(grammarSegment.toUpperCase());
                    CommandGrammar__c commandGrammar = new CommandGrammar__c(Command__c = command.Id,
                        Grammar__c = grammar.Id, ActionablePhrase__c = actionablePhrase.Id,
                        PhraseIndex__c = i);
                    commandGrammars.add(commandGrammar);
                }
                insert commandGrammars;
            }
        }
    }

    public void reindexActionable(String actionableId){
        List<Command__c> commands = [SELECT Id, CommandActionable__c, CommandTarget__c FROM Command__c 
            WHERE CommandActionable__c = :actionableId];
        for (Command__c command : commands){
            reindexCommand(command);
        }
    }
    
    public void reindexAllCommands(){
        // Delete grammar first
        List<Grammar__c> grammar = [SELECT Id, Name FROM Grammar__c];
        delete grammar;
        List<Command__c> commands = [SELECT Id, CommandActionable__c, CommandTarget__c FROM Command__c];
        for (Command__c command : commands){
            reindexCommand(command);
        }
    }
        
    private Map<String, Grammar__c> insertOrGetExistingGrammar(List<String> originalGrammars){
        System.debug('Finding/inserting grammare that is not in: [' + String.join(originalGrammars, ', ') + ']');
        List<Grammar__c> existingGrammar = [SELECT Id, Name FROM Grammar__c WHERE Name IN :originalGrammars];
        Map<String, Grammar__c> rv = new Map<String, Grammar__c>();
        for (Grammar__c grammar : existingGrammar){
            rv.put(grammar.Name.toUpperCase(), grammar);
        }
        List<Grammar__c> missing = new List<Grammar__c>();
        for (String word: originalGrammars){
            if (!rv.containsKey(word.toUpperCase())){
                missing.add(new Grammar__c(Name=word));
            }
        }
        if (!missing.isEmpty()){
            insert missing;
            for (Grammar__c inserted: missing){
                rv.put(inserted.Name.toUpperCase(), inserted);
            }
        }
        System.Debug('Created ' + missing.size() + ' missing words/grammar');
        System.Debug('Returning ' + rv.size() + ' words/grammar');
        
        return rv;
    }
*/    
}