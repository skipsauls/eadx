({
    requestStatusMessages: {
        'WaveAppDelete':{
            'Enqueued': 'Your request has been submitted. Waiting for workers to free up.',
            'InProgress': 'Starting to work on the application.  Please be patient.', 
            'AppInProgress': 'N/A',
            'Success': 'Your application was deleted successfully.',
            'Failed': 'Your application was not deleted.',
            'Cancelled': 'Your application delete was cancelled.'            
        }, 
        'WaveAppCreate': {
            'Enqueued': 'Your request has been submitted. Waiting for workers to free up.',
            'InProgress': 'Starting to work on the application.  Please be patient.', 
            'AppInProgress': 'Your application is in progress.  Won\'t be long now.',
            'Success': 'Your new application completed successfully.',
            'Failed': 'Your new application was not completed successfully.',
            'Cancelled': 'Your new application was cancelled.'
        },
        'WaveAppUpdate': {
            'Enqueued': 'Your request has been submitted. Waiting for workers to free up.',
            'InProgress': 'Starting to work on the application.  Please be patient.', 
            'AppInProgress': 'Your updated application is in progress.  Won\'t be long now.',
            'Success': 'Your application update completed successfully.',
            'Failed': 'Your application update was not completed successfully.',
            'Cancelled': 'Your application update was cancelled.'            
        },
        'StartDataflow': {
            'Enqueued': 'Your request has been submitted. Waiting for workers to free up.',
            'InProgress': 'Starting the dataflow.  Please be patient.', 
            'AppInProgress': 'N/A',
            'Success': 'Your dataflow completed successfully.',
            'Failed': 'Your dataflow was not completed successfully.',
            'Cancelled': 'Your dataflow was cancelled.'            
        }
    },
    actionableAssetEvents: {
        "WaveAppCreate": {
            'ExternalData': 'External CSV data',
            'Dataset': 'Datasets',
            'Connector': 'Connectors',
            'Lens': 'Lenses',
            'Dashboard': 'Dashboards',
            'StoredQuery': 'Queries',
            'AssetPruning': 'Pruning',
            'Dataflow': 'Dataflows',
            'UserDataflowInstance': 'User Dataflow Nodes',
            'UserXmd': 'User/Asset XMDs',
            'ExtendedType': 'Extended Types',
            'Application': 'Application'            
        },
        "WaveAppUpdate": {
            'ExternalData': 'External CSV data',
            'Dataset': 'Datasets',
            'Connector': 'Connectors',
            'Lens': 'Lenses',
            'Dashboard': 'Dashboards',
            'StoredQuery': 'Queries',
            'AssetPruning': 'Pruning',
            'Dataflow': 'Dataflows',
            'UserDataflowInstance': 'User Dataflow Nodes',
            'UserXmd': 'User/Asset XMDs',
            'ExtendedType': 'Extended Types',
            'Application': 'Application'            
        },
        "StartDataflow": {
            'Dataflow': 'Dataflows',
            'UserDataflowInstance': 'User Dataflow Nodes',            
        }
	 },
    inProgressStatuses: ['Enqueued', 'InProgress', 'AppInProgress'],
    
    inProgress: function(requestStatus){
      	return this.inProgressStatuses.indexOf(requestStatus) >= 0;  
    },

    cancelRequest: function(cmp){
        cmp.set('v.busy', true);
        var wairApi = cmp.find('wairApi');
        wairApi.cancelInstallRequest(cmp.get('v.internalWair').id, null, function(request, error){
            if (request){
                $A.log('waveAutoInstallMonitor.cancelRequest: Success!');
                cmp.set('v.internalWair', request);                
            } else {
                $A.log('waveAutoInstallMonitor.cancelRequest:' + error);
            }
        });
    },  
    
    cleanupMonitorApi: function(cmp){
        var monitorApi = cmp.find('monitorApi');        
        monitorApi.stop();
        cmp.set('v.busy', false);
    },
    
    updateProgress: function(cmp, waveAssetEvent){
        var progress = cmp.get('v.progress');
        var waeProgress = cmp.find('waeProgress');
        if (!progress.visible){
            progress.visible = true;
            cmp.set('v.progress', progress);
        }
        if (null != waeProgress){
            waeProgress.updateProgress(waveAssetEvent.EventType,
                waveAssetEvent.ItemId, waveAssetEvent.ItemName,
                waveAssetEvent.ItemLabel, waveAssetEvent.Index,
                waveAssetEvent.Total, waveAssetEvent.Status, waveAssetEvent.Message);    
        }
    },
    
	fireStatusUpdate : function(cmp, statusMessage) {
        cmp.set('v.statusMessage', statusMessage);
	}
    
})