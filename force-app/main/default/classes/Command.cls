public class Command
implements Comparable{
    
    public String id{get;set;}
    public String name{get;set;}
    public String target{get;set;}
    public MatchingPhrase rankingPhrase{get;set;}
    public CommandAction action{get;set;}
    
    public Integer compareTo(Object otherCommandObject){
        Command that = (Command) otherCommandObject;
        return this.rankingPhrase.rank.overall > that.rankingPhrase.rank.overall ? -1 :
            this.rankingPhrase.rank.overall < that.rankingPhrase.rank.overall ? 1 : 0;
    }
}