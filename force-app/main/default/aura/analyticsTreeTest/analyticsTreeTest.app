<aura:application extends="force:slds" access="global">
    
    <div class="outer">
        <lightning:layout horizontalAlign="space">
            <lightning:layoutItem flexibility="auto" size="3" padding="around-small">
                <lightning:card title="Einstein Analytics" iconName="utility:chart">
                    <c:analyticsTree />
                </lightning:card>
            </lightning:layoutItem>
            <lightning:layoutItem flexibility="auto" size="9" padding="around-small">
                2
            </lightning:layoutItem>
        </lightning:layout>
    </div>    
    
</aura:application>