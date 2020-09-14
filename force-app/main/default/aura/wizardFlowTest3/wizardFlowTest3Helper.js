({
    typeList: [
        {label: 'Analytics App Templates', value: 'app'},
        {label: 'Analytics Dashboard Templates', value: 'dashboard'}        
    ],
    
    filterByList: [
        {label: 'All', value: 'All'},
        {group: 'Industry', label: 'Industry', value: 'Industry', items: [
            {label: 'Finance', value: 'Finance'},
            {label: 'Healthcare', value: 'Healthcare'},
            {label: 'Manufacturing', value: 'Manufacturing'}
        ]},
        {group: 'Goal', label: 'Goal', value: 'Goal', items: [
            {label: 'Trending', value: 'Trending'},
            {label: 'Performance', value: 'Performance'},
            {label: 'Management', value: 'Management'}
        ]},
        {group: 'Role', label: 'Role', value: 'Role', items: [
            {label: 'CEO', value: 'CEO'},
            {label: 'CMO', value: 'CMO'},
            {label: 'Sales VP', value: 'Sales VP'},
            {label: 'Sales Manager', value: 'Sales Manager'}
        ]}
    ],
    
    tags: {
        sfdc_internal__Service_Analytics_Flex: {
            'Service': 1,
            'Trending': 1,
            'Management': 1,
            'Sales Manager': 1,
            'Sales VP': 1
        },
        sfdc_internal__Sales_Analytics_Flex: {
            'Sales': 1,
            'Trending': 1,
            'Performance': 1,
            'CEO': 1,
            'Sales VP': 1                        
    	},
	    df17eadx__Demo44: {
            'Finance': 1,
            'Trending': 1,
            'Management': 1,
            'CMO': 1            
        }
    },
    
    ORIGINAL_templateList: [
        {
            label: 'Analytics for Sales',
            name: 'AnalyticsForSales1',
            icon: {
                name: 'standard:account'
            },
            description: 'The latest version of the app, which helps your entire sales team unlock the full power of Sales Cloud data. With clear visibility into pipeline and historical trends, it’s never been easier to build a winning sales team.',
            tags: {
                'Sales': 1,
                'Trending': 1,
                'Performance': 1,
                'CEO': 1,
                'Sales VP': 1
            }
        },
        {
            label: 'Analytics for Field Service',
            name: 'AnalyticsForFieldService',
            icon: {
                name: 'standard:service_appointment'
            },
            description: 'Only for orgs with Field Service Lightning enabled. Field Service Analytics empowers service managers to help their technicians deliver personalized, actionable customer service.',
            tags: {
                'Service': 1,
                'Trending': 1,
                'Management': 1,
                'Sales Manager': 1,
                'Sales VP': 1
            }
        },
        {
            label: 'Analytics for Hillbillies',
            name: 'AnalyticsForHillbillies',
            icon: {
                name: 'utility:moneybag'
            },
            description: 'Come and listen to my story about a man named Jed, a poor mountaineer, barely kept his family fed. And then one day he was shootin at some food, and up through the ground come a bubblin crude. Oil that is, black gold, Texas tea. Well the first thing you know ol Jed\'s a millionaire, the kinfolk said "Jed move away from there" Said "Californy is the place you ought to be," so they loaded up the truck and they moved to Beverly. Hills, that is. Swimmin pools, movie stars.',
            tags: {
                'Finance': 1,
                'Trending': 1,
                'Management': 1,
                'CMO': 1
            }
        },
        {
            label: 'Analytics for HR',
            name: 'AnalyticsForHR',
            icon: {
                name: 'standard:people'
            },
            description: 'Is your company a complete and total mess? Sort of like Dunder Mifflin? Before you turn into Holly Flax and lose your mind, check out our awesome HR analytics components and get your company in order!',
            tags: {
                'Healthcare': 1,
                'Management': 1,
                'Performance': 1,
                'CEO': 1
            }
        },
        {
            label: 'Lead Intelligence',
            name: 'LeadIntelligence',
            icon: {
                name: 'standard:lead'
            },
            description: 'Lorem ipsum dolor sit amet, vim et nullam suscipit principes, pro ne vidisse delectus signiferumque, vel ex mentitum volutpat. Ad lorem dicit molestie mel, in sed errem bonorum. Ei accusam eligendi maluisset nec. Esse libris alienum ne cum, eum ei nihil corrumpit.',
            tags: {
                'Manufacturing': 1,
                'Trending': 1,
                'Performance': 1,
                'CMO': 1,
                'Sales Manager': 1
            }
        },
        {
            label: 'Analytics for Robot Overlords',
            name: 'AnalyticsForRobotOverlords',
            icon: {
                name: 'standard:bot'
            },
            description: 'You know that AI is coming for your job, and those creepy dog robot things are going to hunt us all down, right? Sure, you will not be able to stop the inevitable, but you can better understand how we screwed things up using our amazing analytics pack. Even better, use our predictive dashboards and embedded KPIs to tell you when you can relax and have another double-shot mocha soy-latte, and when you need to run like hell.',
            tags: {
                'Finance': 1,
                'Trending': 1,
                'Management': 1,
                'CEO': 1,
                'Sales VP': 1
            }
        },
        {
            label: 'Racecar Intelligence',
            name: 'RacecarIntelligence',
            icon: {
                name: 'standard:goals'
            },
            description: 'Vroom-vroom! You are awesome at your job, and you want everyone else to know it! Our Racecar Intelligence doesn\'t actually do much, but it looks cool as hell and will impress your shallow friends, family, co-workers, and especially the execs you suck up to. With simple clicks and swipes you can look like you\'re the most productive d̶o̶u̶c̶h̶e̶b̶a̶g̶ dude in the office. We have the sweetest charts with lots of bars, graphics, and an amazing color palette, all of which shout that you are truly the man.',
            tags: {
                'Healthcare': 1,
                'Trending': 1,
                'Performance': 1,
                'CEO': 1,
                'Sales VP': 1
            }
        },
        {
            label: 'Analytics for Analytics',
            name: 'AnalyticsForAnalytics',
            icon: {
                name: 'standard:metrics'
            },
            description: 'Gauchely wherever and masochistically less laughed urchin then saluted bled lusciously sewed hare because labrador radiant cuckoo crud constitutional added one aside hello moth far breathlessly this excepting on moral knew this overdid where desirably sloth dachshund following alongside far drew forthrightly yet when some impassively.',
            tags: {
                'Manufacturing': 1,
                'Trending': 1,
                'Performance': 1,
                'CEO': 1,
                'Sales VP': 1
            }
        }
        
        
    ],
    
    ORIGINAL_setup: function(component) {
        component.set('v.filterByList', this.filterByList);
        component.set('v.filterBySelected: ', this.filterByList[0].value);
        component.set('v.typeList', this.typeList);
        
        this.templateList.forEach(function(template) {
            template.shown = true; 
        });
        
        component.set('v.templateList', this.templateList);
    },
    
    listTemplates: function(component, callback) {
        var proxy = component.find('proxy');
        var selectedType = component.get('v.selectedType');
        var ready = proxy.get('v.ready');
        var self = this;
        if (ready === false) {
            setTimeout(function() {
                self.listTemplates(component, callback);
            }, 100);
        } else {
            var url = '/services/data/v42.0/wave/templates?type=' + selectedType;
            var method = 'GET';
            
            proxy.exec(url, method, null, function(response) {
                response = JSON.parse(JSON.stringify(response));
                if (response && response.body && response.body.templates) {
                    if (typeof callback === 'function') {
                        callback(response.body.templates);
                    }
                }
            });
        }
    },
    
    setup: function(component) {
        
        var featuredTemplateNames = component.get('v.featuredTemplateNames');
        var featuredTemplateMap = {};
        featuredTemplateNames.forEach(function(n) {
            featuredTemplateMap[n] = 1; 
        });
        
        var self = this;
        self.listTemplates(component, function(templates) {
            var templateList = [];
            var fullname = null;
            
            // Add featured templates in order            
            featuredTemplateNames.forEach(function(name) {
                templates.forEach(function(template) {
                    fullname = template.namespace + '__' + template.name;
                    if (fullname === name) {
                        template.featured = true;
                        templateList.push(template);				
                    }
                });
            });
            
            // Add the rest
            templates.forEach(function(template) {
                if (template.featured !== true) {
                    template.featured = false;
                    templateList.push(template);				
                }
            });
            
            // Add some additional metadata
            templates.forEach(function(template) {
                template.shown = true;
                
                // Add the tags manually
                fullname = template.namespace + '__' + template.name;
                template.tags = self.tags[fullname] || [];
            });
            
            //console.warn('templates: ', templates);
            
            component.set('v.templateList', templateList);
        });      
        
        component.set('v.filterByList', this.filterByList);
        component.set('v.filterBySelected: ', this.filterByList[0].value);
        component.set('v.typeList', this.typeList);
        
    },
    
    filterTemplates: function(component) {    
        var selectedFilter = component.get('v.selectedFilter');
        console.warn('selectedFilter: ', selectedFilter);
        
        var templateList = component.get('v.templateList');
        
        templateList.forEach(function(template) {
            template.shown = (template.tags[selectedFilter] === 1) || selectedFilter === 'All';
        });
        
        component.set('v.templateList', templateList);        
    },
    
    searchTemplates: function(component) {    
        var searchTerm = component.get('v.searchTerm');
        //console.warn('searchTerm: ', searchTerm);
        
        var templateList = component.get('v.templateList');
        
        templateList.forEach(function(template) {
            template.shown = false;
            
            // Search the tags
            if (template.tags) {
                for (var tag in template.tags) {
                    if (tag.indexOf(searchTerm) >= 0) {
                        template.shown = true;
                    }
                }          	                
            }
            
            // Search the title
            if (template.label && template.label.indexOf(searchTerm) >= 0) {
                template.shown = true;
            }
            
            // Search the description
            if (template.description && template.description.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
                template.shown = true;
            }
            
        });
        
        component.set('v.templateList', templateList);        
    }
    
    
})