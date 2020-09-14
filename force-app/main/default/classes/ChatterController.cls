global with sharing class ChatterController {

    @AuraEnabled
    global static String test(String communityId, String subjectId, String text) {
    
        ConnectApi.FeedElement feedElement = ConnectApi.ChatterFeeds.postFeedElement(communityId, subjectId, ConnectApi.FeedElementType.FeedItem, text);

        return feedElement.id;
    }


}