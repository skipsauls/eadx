({
    getAnalysisDetails: function(component, callback) {
        let self = this;
        
        console.warn('getAnalysisDetails');
        
        let analysisId = component.get('v.analysisId');
        console.warn('analysisId: ', analysisId);
        let analysis = component.get('v.analysis');
        console.warn('analysis: ', analysis);
        
        let proxy = component.find('proxy');
        
        let url = analysis.url;
        
        var config = {};
            
        proxy.exec(url, 'GET', config, function(response) {
            let details = response.body || null;
            if (callback !== null && typeof callback !== 'undefined') {
                callback(null, details);
            } else {
                return null;
            }            
        });          
    },

	getInputProfile: function(component, callback) {		
        let self = this;

        console.warn('getInputProfile');

        let analysisId = component.get('v.analysisId');
        console.warn('analysisId: ', analysisId);
        let analysisDetails = component.get('v.analysisDetails');
        console.warn('analysisDetails: ', analysisDetails);

        let proxy = component.find('proxy');
        
        let url = analysisDetails.inputProfile.url;
        
        var config = null;
        
        proxy.exec(url, 'GET', config, function(response) {
            let details = response.body || null;
            if (callback !== null && typeof callback !== 'undefined') {
                callback(null, details);
            } else {
                return null;
            }            
        });          
	},
    
    generateStory: function(component, callback) {
        let self = this;
        
        console.warn('generateStory');
        
        let analysisId = component.get('v.analysisId');
        console.warn('analysisId: ', analysisId);
        let analysis = component.get('v.analysis');
        console.warn('analysis: ', analysis);
        let analysisDetails = component.get('v.analysisDetails');
        console.warn('analysisDetails: ', analysisDetails);        
        let inputProfile = component.get('v.inputProfile');
        console.warn('inputProfile: ', inputProfile);
        
        let proxy = component.find('proxy');
        
        // /services/data/v47.0/smartdatadiscovery/proxy
        let url = '/services/data/v47.0/smartdatadiscovery/proxy';

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
            let body = response.body || null;
            let story = typeof body === 'object' ? body : JSON.parse(body);
            if (callback !== null && typeof callback !== 'undefined') {
                callback(null, story);
            } else {
                return null;
            }            
        });          
    },
    
    typeMap: {
        'insights': 'insight',
        'metadata': 'metadata',
        'improvments': 'improvement',
        'fields': 'field'
    },
        
    createStoryDetailItem: function(component, key, label, value, type, story) {
        var self = this;
        let itemMap = component.get('v.itemMap') || {};
        if (typeof value === "object") {
            //var label = key + (typeof value !== 'object' ? ': ' + value : '');
            var item = { 
                label: label + (typeof value !== 'object' ? ': ' + value : ''),
                name: key,
                type: type,
                value: value,
                story: story,
                expanded: false,
                disabled: false,
                items: []
            };
            
            itemMap[key] = item;

            var child = null;
            var childType = self.typeMap[type] || null;

            if (value instanceof Array) {
                for (var i  = 0; i < value.length; i++) {
                    child = self.createStoryDetailItem(component, key + ".items[" + i + "]", '' + i, value[i], childType, story);
                    itemMap[key + "[" + i + "]"] = child;
                    item.items.push(child);
                }                    
            } else {
                for (var k in value) {
                    child = self.createStoryDetailItem(component, key + "." + k, k, value[k], childType, story);
                    itemMap[key + ".items." + k] = child;
                    item.items.push(child);
                }                    
            }
            
            component.set('v.itemMap', itemMap);
            return item;
        } else {
            //var label = key + (typeof value !== 'object' ? ': ' + value : '');
            var item = {
                label: label + (typeof value !== 'object' ? ': ' + value : ''),
                name: key,
                type: type,
                value: value,
                story: story,
                expanded: false,
                disabled: false,
                items: []
            };
            itemMap[item.name] = item;
            component.set('v.itemMap', itemMap);
            return item;   
        }
    },    
    
    createStoryTree: function(component) {
        let self = this;
        
        let items = [];
        let itemMap = {};
        
        component.set('v.itemMap', itemMap);
        
        let story = component.get('v.story');
        
        let body = story.Body; // Why caps?
        
        let insights = body.insights;

        var value = null;
        var item = null;
        var type = null;
        for (var key in story.Body) {
            value = story.Body[key];
            type = key;
            item = self.createStoryDetailItem(component, key, key, value, type, story);
            items.push(item);
            itemMap[key] = item;
        }
        
        component.set('v.itemMap', itemMap);
        
/*        
        
        // each insight has narrative, metdata, and chart
        
        var metadata = null;
        var narrative = null;
        var chart = null;
        var insightItem = null;
        var item = null;
        var name = null;
        insights.forEach(function(insight, i) {
            console.warn('insight: ', insight);
           	narrative = insight.narrative;
            metadata = insight.metadata;
            chart = insight.chart;
            name = 'insight_' + i;
           	insightItem = { 
                label: metadata.type,
                name: name,
                story: story,
                expanded: false,
                disabled: false,
                items: []
            };
            
            var value = null;
            var item = null;
            var elements = narrative.body.elements;
            for (var key in elements) {
                value = elements[key];
                console.warn(key, value);
                item = self.createStoryDetailItem(component, name + '.' + key, key, value, story);
                insightItem.items.push(item);
            }
            
            items.push(insightItem);
        });
*/        
		//story.Body.insights[0].narrative.body.elements[1].elements[0].elements[0].value        
        
        console.warn('items: ', items);
        
        component.set('v.items', items);
        component.set('v.itemMap', itemMap);
    }
    
})