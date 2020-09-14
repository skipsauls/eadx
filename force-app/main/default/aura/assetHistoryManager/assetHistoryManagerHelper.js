({
    assetHistoryColumns: [
        {label: 'Label', fieldName: 'label', type: 'text'},
        {label: 'Name', fieldName: 'name', type: 'text'},
        {label: 'Created By', fieldName: 'createdByName', type: 'string'},
        {label: 'Created Date', fieldName: 'createdDateFormatted', type: 'text'},
        {label: 'Id', fieldName: 'id', type: 'text'},
        {type: 'action',
         typeAttributes: {
             rowActions: [
                 {label: 'Revert', name: 'revert'},
                 {label: 'Delete', name: 'delete'}/*,
                 {label: 'Preview', name: 'preview'}*/
             ]
         }
        }
    ],
    
    doRefresh: function(component) {
        let self = this;
        self.getHistory(component, function(err, assetHistory) {
            if (assetHistory) {
                var assetHistoryData = [];
                var data = null;
                assetHistory.forEach(function(history) {
                    data = history;
                    data.createdById = history.createdBy.id;
                    data.createdByName = history.createdBy.name;
                    data.createdByProfilePhotoUrl = history.createdBy.profilePhotoUrl;
                    data.createdDateFormatted = new Date(history.createdDate).toLocaleString();
                });
                component.set('v.assetHistory', assetHistory);
                component.set('v.assetHistoryData', assetHistoryData);
            } else {
                component.set('v.assetHistory', null);
            }            
        });        
    },
    
    getHistory: function(component, callback) {
        var self = this;
        var proxy = component.find('proxy');
        var asset = component.get('v.asset');
        if (asset === null || typeof asset === 'undefined') {
            if (callback !== null && typeof callback !== 'undefined') {
                callback(null, null);
            } else {
                return null;
            }                        
        } else {
            if (asset.historiesUrl) {
                proxy.getAssetHistory(asset.historiesUrl, function(history) {
                    if (callback !== null && typeof callback !== 'undefined') {
                        callback(null, history);
                    } else {
                        return null;
                    }            
                });
            } else {
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(null, null);
                } else {
                    return null;
                }            
            }
        }
    },
    
    doDelete: function(component, history) {
        var self = this;
        
        let answer = confirm('Are you sure you want to delete history ' + (history.label || history.name) + '?');
        
        if (answer === true) {
            let proxy = component.find('proxy');
            
            proxy.deleteAssetHistory(history.historyUrl, function(result) {
                self.doRefresh(component);
            });
        }        
    },
    
    doRevert: function(component, history) {
        var self = this;
        
        let answer = confirm('Are you sure you want to revert to history ' + (history.label || history.name) + '?');
        
        if (answer === true) {
            
            let label = 'Reverted from ' + (history.label || history.name) + ' ' + history.createdDateFormatted;
            label = prompt("Please enter a label for the reverted asset", label);

            if (label !== null) {
                let proxy = component.find('proxy');
               	let asset = component.get('v.asset');
                let assetHistory = component.get('v.assetHistory');
                
                proxy.revertAssetHistory(history.revertUrl, history.id, label, function(res) {
					setTimeout($A.getCallback(function() {                    
                    	self.doRefresh(component);
                    }), 1000);
                });
            }
        }        
    },

    doPreview: function(component, history) {
        var self = this;
    
        // TBD
    },
    
    getVersionDetails: function(component, history, callback) {
        let self = this;
        let proxy = component.find('proxy');
        
        let url = history.previewUrl; //history.privatePreviewUrl || history.previewUrl;
        
        var config = null;
        
        proxy.exec(url, 'GET', config, function(response) {
            let details = response.body || null;
            if (callback !== null && typeof callback !== 'undefined') {
                callback(null, details);
            } else {
                return null;
            }            
        });
    }   
})