({
    getAnalysis: function(component, callback) {
        let self = this;
        
        //console.warn('getAnalysis');

        let proxy = component.find('proxy');

        if (proxy.get('v.ready') !== true) {
            //console.warn('calling setTimeout');
            setTimeout(function() {
                self.getAnalysis(component, callback);
            }, 500);
        } else {
        
            let analysisId = component.get('v.analysisId');
            //console.warn('analysisId: ', analysisId);
            
            let baseUrl = component.get('v.baseUrl');
            
            var url = baseUrl + '/services/data/v47.0/smartdatadiscovery/analyses/' + analysisId;
    
            console.warn('getAnalysis url: ', url);
            
            //console.warn('url: ', url);
            
            var config = {};
                
            proxy.exec(url, 'GET', config, function(response) {
                let details = response.body || null;
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(null, details);
                } else {
                    return null;
                }            
            });
        }
    },

    getAnalysisDetails: function(component, callback) {
        let self = this;
        
        //console.warn('getAnalysisDetails');

        let proxy = component.find('proxy');
            
        if (proxy.get('v.ready') !== true) {
            //console.warn('calling setTimeout');
            setTimeout(function() {
                self.getAnalysisDetails(component, callback);
            }, 500);
        } else {
            
            let analysisId = component.get('v.analysisId');
            //console.warn('analysisId: ', analysisId);
            let analysis = component.get('v.analysis');
            //console.warn('analysis: ', analysis);
            
            let url = analysis.url;
            
            console.warn('getAnalysisDetails url: ', url);
            
            var config = {};
            
            proxy.exec(url, 'GET', config, function(response) {
                let details = response.body || null;
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(null, details);
                } else {
                    return null;
                }
            });
        }
    },

	getInputProfile: function(component, callback) {		
        let self = this;

        //console.warn('getInputProfile');
        
        let proxy = component.find('proxy');
        
        if (proxy.get('v.ready') !== true) {
            //console.warn('calling setTimeout');
            setTimeout(function() {
                self.getInputProfile(component, callback);
            }, 500);
        } else {
            
            let analysisId = component.get('v.analysisId');
            //console.warn('analysisId: ', analysisId);
            let analysisDetails = component.get('v.analysisDetails');
            //console.warn('analysisDetails: ', analysisDetails);
            
            
            let url = analysisDetails.inputProfile.url;
            
            console.warn('getInputProfile url: ', url);
            
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
	},
    
    generateStory: function(component, callback) {
        let self = this;
        
        //console.warn('generateStory');
        
        let proxy = component.find('proxy');
            
        
        if (proxy.get('v.ready') !== true) {
            //console.warn('calling setTimeout');
            setTimeout(function() {
                self.generateStory(component, callback);
            }, 500);
        } else {
        
            let analysisId = component.get('v.analysisId');
            //console.warn('analysisId: ', analysisId);
            let analysis = component.get('v.analysis');
            //console.warn('analysis: ', analysis);
            let analysisDetails = component.get('v.analysisDetails');
            //console.warn('analysisDetails: ', analysisDetails);        
            let inputProfile = component.get('v.inputProfile');
            //console.warn('inputProfile: ', inputProfile);
            
            // /services/data/v47.0/smartdatadiscovery/proxy
            // 
            let baseUrl = component.get('v.baseUrl');
            



            // /services/data/v47.0/smartdatadiscovery/proxy
            let url = baseUrl + '/services/data/v47.0/smartdatadiscovery/proxy';
            
            console.warn('generateStory url: ' + url);
            
            var body = {
                analysisId: analysisId,
                payload: {
                    url: '/v47.0/discovery/analyses/' + analysisId,
                    body: {
                        analysisConfiguration: analysisDetails.setup
                    }
                }
            };            
            
            
            let config = JSON.stringify(body);
            console.warn('calling post with config: ', config);

            proxy.exec(url, 'POST', config, function(response) {
                //console.warn('generate story returned: ', response);
                let body = response.body || null;
                let story = typeof body === 'object' ? body : JSON.parse(body);
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(null, story);
                } else {
                    return null;
                }            
            });
        }
    }
    
})