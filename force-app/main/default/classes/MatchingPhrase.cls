public class MatchingPhrase
implements System.Comparable{

    public final Rank rank;
    public final String phrase;
    public final Set<String> missing;
    public final Set<String> matching;
    
    public MatchingPhrase(String targetPhrase, String matchingPhrase){
        this.phrase = matchingPhrase;
        Map<String, String> targetSegments = new Map<String, String>();
        for (String segment: targetPhrase.split('\\s')){
            targetSegments.put(segment.toUpperCase(), segment);
        }

        List<String> matchingSegmentsUpper = new List<String>();
        for (String segment: matchingPhrase.split('\\s')){
            matchingSegmentsUpper.add(segment.toUpperCase());
        }
        
        Set<String> missingSegmentsUpper = new Set<String>(targetSegments.keySet());
        this.matching = new Set<String>(targetSegments.values());
        missingSegmentsUpper.removeAll(matchingSegmentsUpper);
        this.missing = new Set<String>();
        for (String missingSegmentUpper: missingSegmentsUpper){
            String missingSegment = targetSegments.get(missingSegmentUpper);
            this.missing.add(missingSegment);
            this.matching.remove(missingSegment);
        }
        // Calculate matching grammar stats
        Decimal matchingCount = this.matching.size();
        Decimal totalCount = targetSegments.size();
        Decimal matchingPerc = (matchingCount/totalCount) * 100;
        
        // Now, let's calculate order rank
        Decimal orderSequence = 0;
        Decimal orderRank = 0;
        Integer currentSequence = -1;
/*        
        System.Debug('*** Requested phrase \'' + String.join(new List<String>(targetSegments.keySet()), ' ') + 
            '\' matching \'' + String.join(matchingSegmentsUpper, ' ') + '\'');
*/            
        for (String target: targetSegments.keySet()){
            Integer matchIndex = matchingSegmentsUpper.indexOf(target);
//            System.Debug('  --- Match index ' + matchIndex + ' word ' + target);
            if (matchIndex >= 0){
                if (matchIndex > currentSequence){
//                    System.Debug('  --- Incrementing order sequence from ' + orderSequence + ' to ' + (orderSequence+1));
                    orderSequence++;
                    currentSequence = matchIndex;
                }
            }
        }
//        System.Debug('*** Order sequence ' + orderSequence + ' of ' + targetSegments.size());
        orderRank = (orderSequence / targetSegments.size()) * 100;
    
        this.rank = new Rank(matchingPerc.setScale(2), orderRank.setScale(2));        
    }

    public Integer compareTo(Object otherPhraseObject){
        MatchingPhrase that = (MatchingPhrase) otherPhraseObject;
        return this.rank.overall > that.rank.overall ? -1 :
            this.rank.overall < that.rank.overall ? 1 : 0;
    }
}