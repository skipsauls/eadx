public abstract class ActionProcessor{
   public abstract CommandAction getCommandAction(String requestedPhrase, String actionType, Command command, Integer resultLimit);
   
   protected String getPhraseAfterKeyword(String phrase, String keyword){
       String rv = null;
       if (null != phrase && null != keyword){
           Integer index = phrase.indexOfIgnoreCase(keyword);
           if (index >= 0){
               index+=keyword.length()+1;
               while (index < phrase.length() && ' '.equals(phrase.charAt(index))){
                   index++;
               }
               rv = index < phrase.length() ? phrase.substring(index) : null;
           }
       }
       return rv;
   }
}