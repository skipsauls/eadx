<aura:application access="global" extends="force:slds">
    <aura:attribute name="analysisId" type="String" access="GLOBAL" description="The id of the analysis" default="9B4B0000000PGFeKAO"/>
    <aura:attribute name="insights" type="List" access="global" description="The insights in the Story"/>
    <aura:attribute name="index" type="Integer" access="GLOBAL" description="The index for the insight to display" default="0"/>
    
    <div class="slds-box slds-theme_default">
        <lightning:layout>
            <lightning:layoutItem flexibility="auto" padding="around-small" size="3">
                <lightning:slider label="Insight" value="{!v.index}" min="0" max="{!v.insights.length}"/>
            </lightning:layoutItem>
            <lightning:layoutItem flexibility="auto" padding="around-small" size="6" class="slds-box slds-theme_default">
                <c:analyticsInsight analysisId="{!v.analysisId}" index="{!v.index}" insights="{!v.insights}"/>
            </lightning:layoutItem>
        </lightning:layout>
    </div>
    
</aura:application>