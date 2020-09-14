({
    scriptsLoaded : function(component, event, helper) {
        console.warn('scriptsLoaded');
        //helper.setupNetwork(component);
        //
        let containerDiv = document.getElementById("vizContainer");
        let url = "https://us-west-2b.online.tableau.com/#/site/eadx/views/Superstore/Product";        
        let viz = new tableau.Viz(containerDiv, url);
    }
    
})