public class UsageStatistic{

    public final String commandId {get;set;}
    public final String phraseId {get;set;}
    public final String phrase{get;set;}
    public final Integer count {get;set;}
    public final Rank averageRank {get;set;}
    public final Decimal averageResultCount {get;set;}
    
    public UsageStatistic(Integer count, String commandId, String phraseId, String phrase, Rank averageRank, Decimal averageResultCount){
        this.count = count;
        this.commandId = commandId;
        this.phraseId = phraseId;
        this.phrase = phrase;
        this.averageRank = averageRank;
        this.averageResultCount = averageResultCount;
    }
}