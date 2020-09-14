({
	doInit: function(component, event, helper) {
        
        var userIds = component.get("v.userIds");

		helper.getUsers(component, userIds, function(err, res) {
            if (err) {
                console.warn('getUsers error: ', err);
            } else {
                if (res.shared_folder_ids) {
                    helper.getFolders(component, res.shared_folder_ids, function(err, res) {
                        var folders = [];
                        var folder = null;
                        for (var folderId in res) {
							folder = res[folderId];
                            folders.push(folder);
                        }
                        component.set("v.folders", folders);
                    });
                }
            }
        });
        
        /*
        var workspaceAPI = component.find("workspace");
        
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            var focusedTabId = response.tabId;
            component.set("v.tabId", response.tabId);
            workspaceAPI.setTabLabel({
                tabId: focusedTabId,
                label: "Quip"
            });
            workspaceAPI.setTabIcon({
                tabId: focusedTabId,
                icon: "standard:quip",
                iconAlt: "Quip"
            });            
        })
        .catch(function(error) {
            console.log(error);
        });
        */
        
        // For testing
        /*
        var threadId = "HZBAAA4B0JO";
        var blobId = "mVgPNQP8XqtvXXizEzT7JA";
        
        helper.getBlob(component, threadId, blobId, function(err, res) {
            //console.warn("getBlob returned: ", err, res);
        });
        */
	},
    
    showQuipThread: function(component, event, helper) {
        var params = event.getParams();
        console.warn('showQuipThread: ', params);
        var threadId = params.threadId;
        var tabId = params.dashboardId;
        //component.set("v.dashboardId", dashboardId);
        //component.set("v.developerName", developerName);
        console.warn('threadId: ', threadId);
        console.warn('tabId: ', tabId);

		// Move to helper!!!!!!!!!!!!!!!!!!!!!
		//         
        var threads = component.get("v.threads");
        
        console.warn('threads: ', JSON.stringify(threads, null, 2));
        
        var thread = null;
        threads.forEach(function(t) {
            console.warn('thread.id: ', t.thread.id);
            if (t.thread.id === threadId) {
                thread = t;
            } 
        });
        console.warn("thread: ", thread);
    	component.set("v.selectedThreadId", thread.thread.id);
        
        var crumbs = component.get("v.crumbs") || [];
        var crumb = {
            id: thread.thread.id,
            title: thread.thread.title,
            type: "thread"
        };
        crumbs.push(crumb);
        component.set("v.crumbs", crumbs);
        component.set("v.currentCrumb", crumb);
        
	},
    
    selectFolder: function(component, event, helper) {
        var target = event.target;
        var folderId = target.getAttribute("data-folder-id");
                
        var folders = component.get("v.folders");
        var folder = null;
        folders.forEach(function(f) {
            if (f.folder.id === folderId) {
                folder = f;
            } 
        });
        
        if (folder) {
            console.warn("folder: ", folder);
	        var crumbs = component.get("v.crumbs") || [];
            var crumb = {
                id: folder.folder.id,
                title: folder.folder.title,
                type: "folder"
            };
            crumbs.push(crumb);
            component.set("v.crumbs", crumbs);
	        component.set("v.currentCrumb", crumb);
            
            var threadIds = [];
            var folderIds = [];
            folder.children.forEach(function(child) {
                console.warn("child: ", child);
                if (child.thread_id) {
	                threadIds.push(child.thread_id); 
                } else if (child.folder_id) {
                    folderIds.push(child.folder_id);
                }
            });
            
            helper.getThreads(component, threadIds, function(err, res) {
                if (res) {
                    var threads = [];
                    if (res.thread) {
                        threads.push(res);
                    } else {
                        var thread = null;
                        for (var threadId in res) {
                            thread = res[threadId];
                            threads.push(thread);
                        }
                    }
                    //console.warn("threads: ", threads);
                    component.set("v.threads", threads);
                }
            });
            
            helper.getFolders(component, folderIds, function(err, res) {
                if (res) {
                    var folders = [];
                    if (res.folder) {
                        folders.push(res);
                    } else {
                        var folder = null;
                        for (var folderId in res) {
                            folder = res[folderId];
                            folders.push(folder);
                        }
                    }
                    //console.warn("folders: ", folders);
                    //component.set("v.folders", folders);
                }
            });
        }
    },

    selectThread: function(component, event, helper) {
        var target = event.target;
        var threadId = target.getAttribute("data-thread-id");
        //console.warn("threadId: ", threadId);
        
        var threads = component.get("v.threads");
        var thread = null;
        threads.forEach(function(t) {
            if (t.thread.id === threadId) {
                thread = t;
            } 
        });
        console.warn("thread: ", thread);
    	component.set("v.selectedThreadId", thread.thread.id);
        
        var crumbs = component.get("v.crumbs") || [];
        var crumb = {
            id: thread.thread.id,
            title: thread.thread.title,
            type: "thread"
        };
        crumbs.push(crumb);
        component.set("v.crumbs", crumbs);
        component.set("v.currentCrumb", crumb);
        
    },

    showUpdates: function(component, event, helper) {
        helper.getRecentThreads(component, function(err, res) {
            if (res) {
                var threads = [];
                if (res.thread) {
                    threads.push(res);
                } else {
                    var thread = null;
                    for (var threadId in res) {
                        thread = res[threadId];
                        threads.push(thread);
                    }
                }
                //console.warn("threads: ", threads);
                component.set("v.threads", threads);
            }
        });
        
    },
    
    showFolders: function(component, event, helper) {
        
    },
    
    showHistory: function(component, event, helper) {
        
    },
    
    selectCrumb: function(component, event, helper) {
        var target = event.target;
        var type = target.getAttribute("data-crumb-type");
        var id = target.getAttribute("data-crumb-id");
        console.warn("type", type);
        console.warn("id: ", id);
    },

    previousCrumb: function(component, event, helper) {
        console.warn("previousCrumb");
        var crumbs = component.get("v.crumbs") || [];
        console.warn("crumbs length: ", crumbs.length);
        if (crumbs.length > 1) {
            crumbs.pop();
            var crumb = crumbs.pop(); //crumbs[crumbs.length - 2];
            console.warn("crumb: ", crumb);
            if (crumb) {
                console.warn("crumb.type: ", crumb.type);
                console.warn("crumb.id: ", crumb.id);
                component.set("v.currentCrumb", crumb);
                if (crumb.type === "thread") {
                    var threads = component.get("v.threads");
                    var thead = null;
                    threads.forEach(function(thread) {
                        console.warn("thread: ", thread);
                        if (thread.thread.id === crumb.id) {
                            component.set("v.selectedThreadId", thread.thread.id);
                        }
                    });
                } else if (crumb.type === "folder") {
                    var folders = component.get("v.folders");
                    var thead = null;
                    folders.forEach(function(folder) {
                        console.warn("folder: ", folder);
                        if (folder.folder.id === crumb.id) {
                            component.set("v.folder", folder);
                        }
                    });
                }
            }
            component.set("v.crumbs", crumbs);
        }
    },

    nextCrumb: function(component, event, helper) {
        /* Need to rethink this one
        var crumbs = component.get("v.crumbs") || [];
        var crumb = crumbs[crumbs.length]
        if (crumb) {
	        component.set("v.currentCrumb", crumb);
        }
        component.set("v.crumbs", crumbs);
    	*/
    },
    
    handleChange: function(component, event, helper) {
		helper.getUsers(component);
	}

})