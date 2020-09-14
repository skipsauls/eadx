<aura:application extends="force:slds">
    <aura:attribute name="datasetId" type="String" default="0FbB0000000BWZRKA4"/>
    <aura:attribute name="currentVersionId" type="String" default=""/>
    <aura:attribute name="currentVersionUrl" type="String" default=""/>
    <lightning:button label="Get Current Version" onclick="{!c.getCurrentVersion}"/>
    <lightning:input type="text" label="Dataset ID" value="{!v.datasetId}"/>
    <lightning:input type="text" label="Current Version ID" value="{!v.currentVersionId}"/>
    <lightning:input type="text" label="Current Version URL" value="{!v.currentVersionUrl}"/>
    <wave:sdk aura:id="sdk"/>
</aura:application>