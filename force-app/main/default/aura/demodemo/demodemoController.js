({    
    doInit: function(component, event, helper) {
        
    },
    
    setChartType: function(component, event, helper) {
        var msg = {
            name: "setChartType",
            value: component.get("v.chartType")
        };
        component.find("ReactApp").message(msg);
        
    },

    setChartOptions: function(component, event, helper) {
        var options = component.get('v.chartOptions');
        console.warn('SendReceiveMessageController.setChartOptions: ', options);
        var msg = {
            name: "setChartOptions",
            value: JSON.stringify(options)
        };
        component.find("ReactApp").message(msg);
        
    },
    
    addDataset: function(component, event, helper) {
        var data = helper.generateData(20, -150, 100);
        var msg = {
            name: "addDataset",
            value: JSON.stringify(data)
        };
        component.find("ReactApp").message(msg);
        
    },

    getChartOptions: function(component, event, helper) {
        var msg = {
            name: "getChartOptions",
            value: JSON.stringify({})
        };
        console.warn('sending message: ', msg);
        component.find("ReactApp").message(msg);
    },
    
    sendMessage : function(component, event, helper) {
        
        var msg = {
            name: "General",
            value: component.get("v.messageToSend")
        };
        component.find("ReactApp").message(msg);
    },
    
    handleMessage: function(component, message, helper) {
        var payload = message.getParams().payload;
        console.warn('SendReceiveMessageController.handleMessage: ', payload);
        var name = payload.name;
        console.warn('name: ', name);
        if (name === "General") {
            var value = payload.value;
            component.set("v.messageReceived", value);
        }
        else if (name === "chartOptions") {
            var value = payload.value;
            var options = JSON.parse(value);
            console.warn('chartOptions: ', options);
            component.set('v.chartOptions', options);
        }
    },
    
    handleError: function(component, error, helper) {
        var description = error.getParams().description;
        component.set("v.error", description);
    }
})