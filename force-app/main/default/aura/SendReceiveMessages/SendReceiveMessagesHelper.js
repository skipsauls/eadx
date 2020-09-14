({
	rand: function(min, max) {
		return (Math.random() * (max - min)) + min;
	},
    
    generateData: function(count, min, max) {
        var self = this;
        var data = [];
        var i;

        for (i = 0; i < count; ++i) {
            data.push({
                x: self.rand(min, max),
                y: self.rand(min, max),
                v: self.rand(0, 1000)
            });
        }

        return data;
    }    
})