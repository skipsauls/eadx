public class QueuedQuery implements Queueable, Database.AllowsCallouts {
    Integer index = 0;
    Integer offset = 0;
    Integer max = 0;
    public QueuedQuery(Integer index, Integer offset, Integer max) {
        this.index = index;
        this.offset = offset;
        this.max = max;
    }
    
    public void execute(QueueableContext context) {
        // Your processing logic here
        String baseQuery = Wave.QueryBuilder.loadByDeveloperName('eadx__cleaned_winemag_data_130k_v2').build('q') + '\n';
        baseQuery += 'q = foreach q generate \'country\' as \'country\';';
        String query = baseQuery;
        query += 'q = offset q ' + this.index + ';\n';
        query += 'q = limit q ' + this.offset + ';\n';
        ConnectApi.LiteralJson result =  ConnectApi.Wave.executeQuery(query);
        Map<String, Object> response = (Map<String, Object>) JSON.deserializeUntyped(result.json);
        Map<String, Object> results = (Map<String, Object>) response.get('results');
        List<Object> records = (List<Object>) results.get('records');
        System.debug('records: ' + records);
        System.debug('records count: ' + records.size());

        // Chain this job to next job by submitting the next job
        Integer i = this.index + offset;
        if (i < this.max) {
    	    System.enqueueJob(new QueuedQuery(i, this.offset, this.max));
        }
    }
}