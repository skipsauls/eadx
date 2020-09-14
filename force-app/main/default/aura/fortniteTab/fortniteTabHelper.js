({
    backgroundNames: ['jailbirds','sun_strider','norse_emblem','battle_royale','carbide','visitor','rex','poolside'],

    rotateBackground: function(component) {
        var self = this;
        var backgroundName = component.get('v.backgroundName');
        var backgrounds = component.get('v.backgrounds');
        var index = 0;
        self.backgroundNames.forEach(function(name, i) {
            if (name === backgroundName) {
                index = i + 1;
                if (index >= self.backgroundNames.length) {
                    index = 0;
                }
            }
        });
        backgroundName = self.backgroundNames[index];
        component.set('v.backgroundName', backgroundName);
        var background = backgrounds[backgroundName];
        component.set('v.background', background);        
    },

	setupBackground: function(component) {
        var self = this;
        var backgrounds = {};
        self.backgroundNames.forEach(function(name) {
            backgrounds[name] = $A.get('$Resource.fortnite_loading_screens') + '/' + name + '_2048x1024.jpg';
        });
        component.set('v.backgrounds', backgrounds);
        //self.changeBackground(component);
        var backgroundName = self.backgroundNames[Math.floor(Math.random() * self.backgroundNames.length)];
        component.set('v.backgroundName', backgroundName);
        var background = backgrounds[backgroundName];
        component.set('v.background', background);        
	}
})