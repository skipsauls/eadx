trigger EventfulDashboards on Opportunity (after update, after insert) {
    
    List<Eventful_Dashboard__e> events = new List<Eventful_Dashboard__e>();
    events.add(new Eventful_Dashboard__e());
    
    // Call method to publish events
    List<Database.SaveResult> results = EventBus.publish(events);
    
    // Inspect publishing result for each event
    for (Database.SaveResult sr : results) {
        if (sr.isSuccess()) {
            System.debug('Successfully published event.');
        } else {
            for(Database.Error err : sr.getErrors()) {
                System.debug('Error returned: ' +
                             err.getStatusCode() +
                             ' - ' +
                             err.getMessage());
            }
        }       
    }
}