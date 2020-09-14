public class Rank{
    public final Decimal matching;
    public final Decimal order;
    public final Decimal overall;
    
    public Rank(Decimal matching, Decimal order){
        this.matching = matching;
        this.order = order;
        Decimal overallRank = ((matching + order)/200)*100;
        this.overall = overallRank.setScale(2);
    }

}