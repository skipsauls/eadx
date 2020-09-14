global class OpenQuipFolderProcessor
extends ActionProcessor {

     
    public override CommandAction getCommandAction(String requestedPhrase, String actionType, Command command, Integer resultLimit){
        String criteria = getPhraseAfterKeyword(requestedPhrase, 'Folder');
         if (null == criteria){
            return new CommandAction(CommandAction.ResultStatus.FAIL_NOT_ENOUGH_INFO, actionType, null);
        }
        
        System.debug('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ criteria: ' + criteria);
        
        String lcCriteria = criteria.toLowerCase();

        System.debug('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ lcCriteria: ' + lcCriteria);
        
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
            Map<String, Object> folder = null;
            Map<String, Object> folderDetails = null;
            String folderTitle = null;
            String lcTitle = null;
            Map<String, Object> targetFolder = null;
            for (String folderId: response.keySet()) {
                System.debug('folderId: ' + folderId);
                folder = (Map<String, Object>) response.get(folderId);
                System.debug('folder: ' + folder);
                folders.add(folder);
                folderDetails = (Map<String, Object>) folder.get('folder');
                folderTitle = (String) folderDetails.get('title');
                System.debug('folderTitle: ' + folderTitle);
                lcTitle = folderTitle != null ? folderTitle.toLowerCase() : null;
                System.debug('lcTitle: ' + lcTitle);
                if (lcTitle == lcCriteria) {
                    targetFolder = folder;
                }
            }

            System.debug('targetFolder: ' + targetFolder);
            
            List<Object> childDocuments = new List<Object>();
            
            if (targetFolder != null) {
                List<Object> children = (List<Object>) targetFolder.get('children');
                System.debug('children: ' + children);
                String childFolderId = null;
                String childThreadId = null;
                List<String> childFolderIds = new List<String>();
                List<String> childThreadIds = new List<String>();
                for (Object c : children) {
                    System.debug('c: ' + c);
                    Map<String, Object> child = (Map<String, Object>) c;
                    System.debug('child: ' + child);
                    childFolderId = (String) child.get('folder_id');
                    childThreadId = (String) child.get('thread_id');
                    if (childFolderId != null) {
                        childFolderIds.add(childFolderId);
                    } else if (childThreadId != null) {
                        childThreadIds.add(childThreadId);
                    }
                }
                
                System.debug('childFolderIds: ' + childFolderIds);
                System.debug('childThreadIds: ' + childThreadIds);
                
                if (childFolderIds != null && childFolderIds.size() > 0) {
                
                    String childFoldersJson = QuipUtils.getFolders(childFolderIds);
                    Map<String, Object> childFolders = (Map<String, Object>)JSON.deserializeUntyped(childFoldersJson);
                    System.debug('childFolders: ' + childFolders);
                    for (String cfid: childFolders.keySet()) {
                        childDocuments.add(childFolders.get(cfid));
                    }
                }
                
                if (childThreadIds != null && childThreadIds.size() > 0) {                        
                    String childThreadsJson = QuipUtils.getThreads(childThreadIds);
                    Map<String, Object> childThreads = (Map<String, Object>)JSON.deserializeUntyped(childThreadsJson);
                    System.debug('childThreads: ' + childThreads);
                    for (String ctid: childThreads.keySet()) {
                        childDocuments.add(childThreads.get(ctid));
                    }
                }
                                    
                System.debug('childDocuments: ' + childDocuments);
            }
            
            return new CommandAction(CommandAction.ResultStatus.SUCCESS, actionType, childDocuments);
        } catch (Exception e) {
            System.debug('Exception: ' + e);
        }
        
        return null;
    }
}