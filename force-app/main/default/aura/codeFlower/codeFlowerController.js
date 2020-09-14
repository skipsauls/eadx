({
    scriptsLoaded : function(component, event, helper) {
        console.warn('scriptsLoaded');
        
        //helper.init(component);
        
        console.warn('init');
        
        console.warn('d3: ', d3);
        
        var width = 960;
        var height = 500;
        
        // Create SVG element, we can't just use  tag in lightning component
        // So creating one dynamically using jquery
        var svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
        
        let data = [
            {
                age: '=65',
                candiates: 61
        	},
            {
                age: '=55',
                candiates: 31
        	},
            {
                age: '=45',
                candiates: 51
        	},
            {
                age: '=35',
                candiates: 41
        	}
            
        ];
        
		helper.renderChart(component, data);
        

/*        
        console.warn('CodeFlower: ', CodeFlower);
        
        var myFlower = new window.CodeFlower("#visualization", 300, 200);
        myflower.update(helper.jsonData);
*/        
    }
})