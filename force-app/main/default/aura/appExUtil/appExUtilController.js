({
    openAppexchangeModal: function(cmp, event, helper) {
        var appexModalAttributes = { "origin" : "setupTile", "useContainerManager" : false };
        var appexModalStyles = { "transform" : "none", "maxWidth" : "960px", "position" : "initial"};
        
        helper.openModal(cmp, "flexipageEditor:appExchangeModal", appexModalAttributes, appexModalStyles);
    }
})