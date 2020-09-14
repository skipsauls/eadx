({
	disablePopoutSupport: function(cmp) {
        var utilityApi = cmp.find("utilitybar");
        if (utilityApi){
            utilityApi.getAllUtilityInfo().then(function(response) {
                var thisUtilityInfo = response[0];
                utilityApi.disableUtilityPopOut({utilityId: thisUtilityInfo.id, 
                                                 disabled: true})
                    .then(function(response){
                        $A.log('commanderSession: Successfully disabled pop-out support.');
                    }).catch(function(error) {
                        console.log('commanderSession: Unable to disable pop-out support.' + error);
                    });
           })
        }
	},
    loadSessionData: function(cmp){
        return {
            "Sprint Review Preso": [
                "View dashboard Sprint Slide Deck",
                "Next slide",
                "Previous slide",
                "Say Thank You!"
            ],
            "Navigation Features": [
                "Learn about SAQL",
                "Next",
                "Previous",
                "First",
                "Last"
            ],
            "Environmental": [
             	"Who am I?"  
            ],
            "Collaboration": [                
                "Join channel wdx",
                "Open dashboard Opportunity Summary!",
                "Select where stage is closed",
                "Select where lead is referral",
                "Select where type is Existing",
                "Select where category is closed",
                "Clear selected stage",
                "Clear selected type",
                "Clear selected lead",
                "Clear selected category",
                "Leave channel"
            ]
        };
    }
})