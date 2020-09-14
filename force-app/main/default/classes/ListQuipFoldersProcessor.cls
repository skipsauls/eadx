global class ListQuipFoldersProcessor
extends ActionProcessor {

/*
    static String accessToken = 'XXXXXXXXXXXXXX';

    global static String getURL(String url) {
        System.debug('getURL: ' + url);
        
        HttpRequest request = new HttpRequest();        
        Http http = new Http();
        request.setEndpoint(url);
        request.setMethod('GET');
        request.setHeader('Content-type', 'application/json');
        request.setHeader('Authorization', 'Bearer ' + accessToken);
        
        HTTPResponse response = http.send(request);

        String body = response.getBody();
        
        System.debug('body: ' + JSON.serialize(body));

        return body;    
    }
        
    global static String getList(String type, List<String> ids) {
        System.debug('getList');
        System.debug('type: ' + type);
        System.debug('ids: ' + ids);
        
        String url = 'https://platform.quip.com/1/' + type;
        
        if (ids != null) {
            url += '/';
            if (ids.size() == 1) {
                url += ids.get(0);
            } else if (ids.size() > 1) {
                url += '?ids=';
                String delim = '';
                for (String id : ids) {
                    url += delim + id;
                    delim = ',';
                }
            }
        }

        return getURL(url);                            
    }


    global static String getUsers(List<String> ids) {    
        return getList('users', ids);
    }
    
    global static String getFolders(List<String> ids) {
        return getList('folders', ids);    
    }

    global static String getThreads(List<String> ids) {
        return getList('threads', ids);    
    }

    global static String getBlob(String threadId, String blobId) {
        String url = 'https://platform.quip.com/1/blob/' + threadId + '/';// + blobId;
        return getURL(url);
    }
    
    global static String getRecentThreads() {
    
        String url = 'https://platform.quip.com/1/threads/recent';
        System.debug('url: ' + url);
        
        HttpRequest request = new HttpRequest();        
        Http http = new Http();
        request.setEndpoint(url);
        request.setMethod('GET');
        request.setHeader('Content-type', 'application/json');
        request.setHeader('Authorization', 'Bearer ' + accessToken);
        
        HTTPResponse response = http.send(request);

        String body = response.getBody();                    

        return body;
    } 
*/
    
    public override CommandAction getCommandAction(String requestedPhrase, String actionType, Command command, Integer resultLimit){
        /*
        String criteria = getPhraseAfterKeyword(requestedPhrase, 'Folder');
         if (null == criteria){
            return new CommandAction(CommandAction.ResultStatus.FAIL_NOT_ENOUGH_INFO, actionType, null);
        }
        */
        
        try {
            List<String> userIds = new List<String>();
            userIds.add('ssauls@salesforce.com');
            
            String usersJson = QuipUtils.getUsers(userIds);
            System.debug('usersJson: ' + usersJson);
    
            Map<String, Object> response = (Map<String, Object>)JSON.deserializeUntyped(usersJson);
            System.debug('response: ' + response);
            
            List<Object> sharedFolderIds = (List<Object>) response.get('shared_folder_ids');
            System.debug('------------------------------------------------------------------------------------------------');
            System.debug('sharedFolderIds: ' + sharedFolderIds);
            List<String> folderIds = new List<String>();
            for (Object folderId : sharedFolderIds) {
                folderIds.add((String) folderId);
            }
            
            String foldersJson = QuipUtils.getFolders(folderIds);        
            System.debug('foldersJson: ' + foldersJson);
            
            response = (Map<String, Object>)JSON.deserializeUntyped(foldersJson);
            System.debug('response: ' + response);
            
            List<Object> folders = new List<Object>();
            Object folder = null;
            for (String folderId: response.keySet()) {
                folder = response.get(folderId);
                folders.add(folder);
            }
            
            return new CommandAction(CommandAction.ResultStatus.SUCCESS, actionType, folders);
        } catch (Exception e) {
            System.debug('Exception: ' + e);
        }
        
        return null;
    }
}