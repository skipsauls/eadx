({
    handleFolderIdChange: function(component, event, helper) {
        var folderId = component.get('v.folderId');
        //console.warn('getFolder: ', folderId);
        if (folderId !== null && typeof folderId !== 'undefined') {
	        helper.showFolder(component, folderId);
        }
	}
})