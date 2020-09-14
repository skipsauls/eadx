<aura:application extends="force:slds" access="global">
    <aura:attribute name="actionId" type="String" access="global"/>
    <aura:attribute name="actionType" type="String" access="global"/>
    <aura:attribute name="action" type="String" access="global"/>
    
    <div class="outer">
        <lightning:layout horizontalAlign="space">
            <lightning:layoutItem flexibility="auto" size="3" padding="around-small">
                <lightning:card title="Einstein Voice for Analytics" iconName="utility:einstein">
                    <c:commanderTree aura:id="commander-tree" action="{!v.action}"/>
                </lightning:card>
            </lightning:layoutItem>
            <lightning:layoutItem flexibility="auto" size="9" padding="around-small">
                <c:commanderActionViewer action="{!v.action}"/>
            </lightning:layoutItem>
        </lightning:layout>
    </div>    
    
</aura:application>