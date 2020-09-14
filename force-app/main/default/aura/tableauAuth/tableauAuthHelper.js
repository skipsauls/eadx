({
    _authenticate: function(component, refresh) {
        console.warn('authenticate');
        let self = this;
        
        var closeAction = component.getReference('v.closeAction');
        var serverUrl = component.getReference('v.serverUrl');
        var siteName = component.getReference('v.siteName');
        var username = component.getReference('v.username');
        var tableauAuth = component.getReference('v.tableauAuth');
        
        $A.createComponents([
            ["c:tableauAuthModal", {closeAction: closeAction}],
            ["c:tableauAuthModalFooter", {closeAction: closeAction}]
        ], function(components, status, err) {
            if (status === "SUCCESS") {
                console.warn('comopnents: ', components);
                let modalBody = components[0];
                let modalFooter = components[1];
                modalBody.set('v.serverUrl', serverUrl);
                modalBody.set('v.siteName', siteName);
                modalBody.set('v.username', username);
                modalBody.set('v.tableauAuth', tableauAuth);
                component.find('overlayLib').showCustomModal({
                    header: "Login to Tableau",
                    body: modalBody,
                    footer: modalFooter,
                    showCloseButton: true,
                    cssClass: "mymodal",
                    closeCallback: function() {
                        closeAction = component.get('v.closeAction');
                        console.warn('closeAction: ', closeAction);
                        tableauAuth = component.get('v.tableauAuth');
                        console.warn('tableauAuth: ', tableauAuth);
                        if (tableauAuth !== null && typeof tableauAuth !== 'undefined') {
                            
                        } else {
                            // Do nothing
                        }
                    }
                })
            }
        });
    },
    
    authenticate: function(component, callback) {
        console.warn('uploadViewData');
        let self = this;
        //let view = component.get('v.asset');
        //console.warn('view: ', view);
        
        var closeAction = component.getReference('v.closeAction');
        
        //component.set('v.datasetName', view.name);
        //component.set('v.folderDeveloperName', 'SharedApp');
        
        //var datasetName = component.getReference('v.datasetName');
        //var folderDeveloperName = component.getReference('v.folderDeveloperName');
        
        $A.createComponents([
            ["c:tableauUploadModal", {folderDeveloperName: 'SharedApp'}],
            ["c:tableauUploadModalFooter", {closeAction: closeAction}]
        ], function(components, status, err) {
            if (status === "SUCCESS") {
                let modalBody = components[0];
                let modalFooter = components[1];
                //modalBody.set('v.datasetName', datasetName);
                //modalBody.set('v.folderDeveloperName', folderDeveloperName);
                component.find('overlayLib').showCustomModal({
                    header: "Upload View to Dataset",
                    body: modalBody,
                    footer: modalFooter,
                    showCloseButton: true,
                    cssClass: "mymodal",
                    closeCallback: function() {
                        closeAction = component.get('v.closeAction');
                        console.warn('closeAction: ', closeAction);
                        datasetName = component.get('v.datasetName');
                        console.warn('datasetName: ', datasetName);
                        folderDeveloperName = component.get('v.folderDeveloperName');
                        console.warn('folderDeveloperName: ', folderDeveloperName);
                        if (closeAction === 'okay') {
                            self.performUpload(component, folderDeveloperName, datasetName, function() {
                                window.setTimeout(function() {
                                    let dataManagerUrl = window.location.origin + '/wave/wave.app#dataManager';
                                    var win = window.open(dataManagerUrl, '_blank');
                                    win.focus();                            
                                }, 1000);
                            });
                        } else {
                            // Do nothing
                        }
                    }
                })
            }
        });
        
    },
})