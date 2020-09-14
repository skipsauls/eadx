({
    y_space: 200,
    z_space: 200,
    current_index: 1,
    
	setup: function(component) {
        
		//var y_space = 200;
		//var z_space = 200;
			
        
		var view = component.find("view").getElement();
        console.warn("view: ", view);
		var stack = component.find("stack").getElement();
        console.warn("stack: ", stack);
        var items = stack.querySelectorAll("li");
        console.warn("items: ", items, items.length, items.forEach);

		var z_index = items.length;
		var translate_y = this.y_space *-1;
		var translate_z = this.z_space *-1;
        var item = null;
        
        for (var i = 0; i < items.length; i++) {
            item = items[i];
            
			item.style['-webkit-transform'] = 'translate3d(0px, ' + translate_y + 'px, ' + translate_z + 'px)';
			item.style['z-index'] = z_index;
			
            item.setAttribute("data-translate_y", translate_y);
            item.setAttribute("data-translate_z", translate_z);
			
			z_index--;
			translate_y -= this.y_space;
			translate_z -= this.z_space;
			
		}        
	},
    
    prev: function(component) {
		var stack = component.find("stack").getElement();
        var items = stack.querySelectorAll("li");
        var item = null;
        
        for (var i = 0; i < items.length; i++) {
            item = items[i];
            this.animateStack(component, item, -this.y_space, -this.z_space);
        }
        //lis.filter(':nth-child(' + (current_index - 1) + ')').css('opacity', 1);
        items = stack.querySelectorAll('li:nth-child(' + (this.current_index - 1) + ')');
        for (var i = 0; i < items.length; i++) {
            item = items[i];
            item.style['opacity'] = 1;
        }
        
        this.current_index--;       
    },
    
    next: function(component) {
        console.warn("next - this.current_index: ", this.current_index);
		var stack = component.find("stack").getElement();
        var items = stack.querySelectorAll("li");
        console.warn("list items: ", items);
        var item = null;
        
        for (var i = 0; i < items.length; i++) {
            item = items[i];
            this.animateStack(component, item, this.y_space, this.z_space);
        }
        //lis.filter(':nth-child(' + current_index + ')').css('opacity', 0);
        items = stack.querySelectorAll('li:nth-child(' + (this.current_index - 1) + ')');
        console.warn("nth-child items: ", items, items.length);
        for (var i = 0; i < items.length; i++) {
            item = items[i];
            console.warn("item: ", item);
            item.style['opacity'] =  0;
        }
        
        this.current_index++;
    },
    
    animateStack: function(component, item, y, z) {
        console.warn("animateStack: ", component, item, y, z);
        var new_y = parseInt(item.getAttribute("data-translate_y")) + y;
        var new_z = parseInt(item.getAttribute("data-translate_z")) + z;

        console.warn("new_y: ", new_y);
        console.warn("new_z: ", new_z);
        
        item.style['-webkit-transform'] = 'translate3d(0px, ' + new_y + 'px, ' + new_y + 'px)';
        //item.style['z-index'] = z_index;
        
		//item.style.transform = 'translate3d(0px, ' + new_y + 'px, ' + new_z + 'px)';
        
        item.setAttribute("data-translate_y", new_y);
        item.setAttribute("data-translate_z", new_z);
    }
})