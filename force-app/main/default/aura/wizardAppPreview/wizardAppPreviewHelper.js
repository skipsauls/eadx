({
    getTemplate: function(component, callback) {
        var proxy = component.find('proxy');
        var templateId = component.get('v.templateId');
        var selectedType = component.get('v.selectedType');
        var ready = proxy.get('v.ready');
        var self = this;
        if (ready === false) {
            setTimeout(function() {
                self.getTemplate(component, callback);
            }, 100);
        } else {
            var url = '/services/data/v42.0/wave/templates/' + templateId;
            var method = 'GET';
            
            proxy.exec(url, method, null, function(response) {
                response = JSON.parse(JSON.stringify(response));
                if (response && response.body) {
                    if (typeof callback === 'function') {
                        callback(response.body);
                    }
                }
            });
        }		
        
    },
    
	setup: function(component) {
        var self = this;
        self.getTemplate(component, function(template) {
            
            template.tags = [];
            template.tags.push('sales');
            template.tags.push('analytics');
            template.tags.push('finance');
            
            template.features = [];
            template.features.push({
                label: 'Custom Objects',
                iconName: 'utility:check'
            });
            template.features.push({
                label: 'Standard Objects',
                iconName: 'utility:check'
            });

			template.contents = [];
            template.contents.push({
                label: '8 Datasets' 
            });
            template.contents.push({
                label: '12 Dashboards' 
            });
            
            template.publisher = 'Salesforce Einstein Analytics';
            
            template.images = [];
            template.images.push({
                url: $A.get('$Resource.sales_analytics_assets') + '/sales_leaderboard.png',
                label: 'Leaderboard',
                description: 'The leaderboard shows leaders, some of whom have epic hair.'
            });
            template.images.push({
                url: $A.get('$Resource.sales_analytics_assets') + '/sales_team_activities.png',
                label: 'Team Activities',
                description: 'What activities have your team been up to lately? Lots of shenanigans!'
            });
            template.images.push({
                url: $A.get('$Resource.sales_analytics_assets') + '/sales_forecast.png',
                label: 'Forecast',
                description: 'Despite the name, this dashboard is not about the weather.'
            });
            template.images.push({
                url: $A.get('$Resource.sales_analytics_assets') + '/sales_whitespace.png',
                label: 'Whitespace',
                description: 'Whitespace? This likely is not about the CSS white-space property.'
            });
            template.images.push({
                url: $A.get('$Resource.sales_analytics_assets') + '/sales_benchmark.png',
                label: 'Benchmark',
                description: 'I once got a benchmark from sitting too long on a hard, concrete park bench.'
            });
            template.images.push({
                url: $A.get('$Resource.sales_analytics_assets') + '/sales_company_overview.png',
                label: 'Company Overview',
                description: 'If this dashboard could speak, it would sound like an old-timey radio announcer.'
            });
            
            console.warn('template.images: ', template.images);
            
           	component.set('v.template', template); 
        });
	}
})