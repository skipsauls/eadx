({
    uploadViewData: function(component, callback) {
        console.warn('uploadViewData');
        let self = this;
        let view = component.get('v.asset');
        console.warn('view: ', view);
        
        var closeAction = component.getReference('v.closeAction');
        
        component.set('v.datasetName', view.name);
        component.set('v.folderDeveloperName', 'SharedApp');
        
        var datasetName = component.getReference('v.datasetName');
        var folderDeveloperName = component.getReference('v.folderDeveloperName');
        
        $A.createComponents([
            ["c:tableauUploadModal", {asset: view, datasetName: view.name, folderDeveloperName: 'SharedApp'}],
            ["c:tableauUploadModalFooter", {closeAction: closeAction}]
        ], function(components, status, err) {
            if (status === "SUCCESS") {
                let modalBody = components[0];
                let modalFooter = components[1];
                modalBody.set('v.datasetName', datasetName);
                modalBody.set('v.folderDeveloperName', folderDeveloperName);
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
        
	performUpload: function(component, folderDeveloperName, datasetName, callback) {   
        
        let self = this;
        
        //let pageSize = component.get('v.pageSize');
        let methodName = 'upload_view_data_to_dataset';
        
        let view = component.get('v.asset');
        
        var proxy = component.find('proxy');
        
        let serverUrl = 'us-west-2b.online.tableau.com';
        let name = 'ssauls@salesforce.com';
        //let siteName = 'einsteinsandbox';
        let siteName = 'eadx';
        
        // Construct/generate this!!!!!!!!!!!!!!!!
        let url = '/services/apexrest/eadx/tableau?methodName=' + methodName;
        url += '&viewName=' + view.viewUrlName;
        url += '&folderDeveloperName=' + folderDeveloperName;
        url += '&datasetName=' + datasetName;
        url += '&serverUrl=' + serverUrl;
        url += '&siteName=' + siteName;  
        url += '&name=' + name;        
        
        console.warn('url: ', url);
        
        var config = null;
        
        if (proxy.get('v.ready') !== true) {
            setTimeout(function() {
                self.performUpload(component, folderDeveloperName, datasetName, callback);
            }, 500);
        } else {
        
            let spinner = component.find('result_spinner');
            $A.util.toggleClass(spinner, 'slds-hide');
            proxy.exec(url, 'GET', config, function(response) {
	            $A.util.toggleClass(spinner, 'slds-hide');
                let val = JSON.parse(response.body);
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(null, val);
                } else {
                    return null;
                }            
            });
        }        

	},
    
    createShareURL: function(component, workbook, callback) {

        console.warn('createShareURL');

        console.warn('workbook: ', JSON.stringify(workbook, null, 2));
        
        let view = component.get('v.asset');
        console.warn('view: ', JSON.stringify(view, null, 2));
        
       	let self = this;

        let serverUrl = 'us-west-2b.online.tableau.com';
        let name = 'ssauls@salesforce.com';
        //let siteName = 'einsteinsandbox';
        let siteName = 'eadx';
        
         /*
         https://us-west-2b.online.tableau.com/t/eadx/views/Superstore/Overview?:showAppBanner=false&amp;:display_count=n&amp;:showVizHome=n&amp;:origin=viz_share_link
         */
        
        let url = 'https://' + serverUrl + '/t/' + siteName + '/views/' + workbook.contentUrl + '/' + view.viewUrlName + '?:retry=yes&amp;:showAppBanner=false&amp;:display_count=n&amp;:showVizHome=namp;:origin=viz_share_link';        

        console.warn('url: ', url);
        
        component.set('v.vizUrl', url);

        let spinner = component.find('result_spinner');
        
        $A.util.toggleClass(spinner, 'slds-hide');

        
        return;
        

        let config = {
            "vizURL": url,
            "height": "600",
            "hideTabs": "false",
            "hideToolbar": "true"
        };

        $A.createComponent("c:tableauViz", config, function(cmp, msg, err) {
            console.warn('c:tableauViz createComponent returned: ', cmp, msg, err);
            var viz = component.find("viz");
            console.warn('viz: ', viz);
            if (err) {
                console.warn("error: ", err);
            } else {
                cmp.set('v.hideToolbar', true);
               	let body = [];
                console.warn('pushing cmp to body');
                body.push(cmp);
                
                viz.set("v.body", body);
                
                /*
                console.warn('setting attributes');
                cmp.set('v.vizURL', url);
                cmp.set('v.height', 600);
                cmp.set('v.hideTabs', false);
                cmp.set('v.hideToolbar', true);
               	let body = [];
                console.warn('pushing cmp to body');
                body.push(cmp);
                console.warn('setting viz v.body');
                viz.set("v.body", body);
                */
            }            
        });        
        
        
    },
    
	getWorkbookData: function(component, callback) {
        let view = component.get('v.asset');
        
        console.warn('view: ', JSON.stringify(view, null, 2));
        
       	let self = this;
        //let pageSize = component.get('v.pageSize');
        let methodName = 'query_workbook';
        
        var proxy = component.find('proxy');

/*        
        // Construct/generate this!!!!!!!!!!!!!!!!
        var url = '/services/apexrest/eadx/tableau?methodName=' + methodName;
        url += '&viewName=' + view.viewUrlName;
*/        
        
        let serverUrl = 'us-west-2b.online.tableau.com';
        let name = 'ssauls@salesforce.com';
        //let siteName = 'einsteinsandbox';
        let siteName = 'eadx';
        
        let url = '/services/apexrest/eadx/tableau?methodName=' + methodName;
        
        url += '&viewName=' + view.viewUrlName;
        url += '&serverUrl=' + serverUrl;
        url += '&siteName=' + siteName;
        url += '&workbookId=' + view.workbook.id,
        url += '&name=' + name;
        
        console.warn('url: ', url);
        
        var config = null;
        
        if (proxy.get('v.ready') !== true) {
            setTimeout(function() {
                self.getViewData(component, callback);
            }, 500);
        } else {
        
            /*
             
             https://us-west-2b.online.tableau.com/t/eadx/views/Superstore/Overview?:showAppBanner=false&amp;:display_count=n&amp;:showVizHome=n&amp;:origin=viz_share_link
             
             */ 
            
            let spinner = component.find('result_spinner');
            $A.util.toggleClass(spinner, 'slds-hide');
            proxy.exec(url, 'GET', config, function(response) {
                console.warn('raw response: ', response);
                let val = JSON.parse(response.body);
                console.warn('response: ', JSON.stringify(val, null, 2));
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(null, val.workbook);
                } else {
                    return null;
                }            
            });
        }        

	},
    
	getViewData: function(component, callback) {
        let view = component.get('v.asset');
        
        console.warn('view: ', JSON.stringify(view, null, 2));
        
       	let self = this;
        //let pageSize = component.get('v.pageSize');
        let methodName = 'get_view_data';
        
        var proxy = component.find('proxy');

/*        
        // Construct/generate this!!!!!!!!!!!!!!!!
        var url = '/services/apexrest/eadx/tableau?methodName=' + methodName;
        url += '&viewName=' + view.viewUrlName;
*/        
        
        let serverUrl = 'us-west-2b.online.tableau.com';
        let name = 'ssauls@salesforce.com';
        //let siteName = 'einsteinsandbox';
        let siteName = 'eadx';
        
        let url = '/services/apexrest/eadx/tableau?methodName=' + methodName;
        
        url += '&viewName=' + view.viewUrlName;
        url += '&serverUrl=' + serverUrl;
        url += '&siteName=' + siteName;  
        url += '&name=' + name;
        
        console.warn('url: ', url);
        
        var config = null;
        
        if (proxy.get('v.ready') !== true) {
            setTimeout(function() {
                self.getViewData(component, callback);
            }, 500);
        } else {
        
            /*
             
             https://us-west-2b.online.tableau.com/t/eadx/views/Superstore/Overview?:showAppBanner=false&amp;:display_count=n&amp;:showVizHome=n&amp;:origin=viz_share_link
             
             */ 
            
            let spinner = component.find('result_spinner');
            $A.util.toggleClass(spinner, 'slds-hide');
            proxy.exec(url, 'GET', config, function(response) {
                console.warn('raw response: ', response);
	            $A.util.toggleClass(spinner, 'slds-hide');
                let val = response; //JSON.parse(response.body);
                console.warn('response: ', JSON.stringify(val, null, 2));
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(null, val);
                } else {
                    return null;
                }            
            });
        }        

	}
    
})