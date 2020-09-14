<aura:application access="global" extends="force:slds">
    
    <aura:attribute name="records" type="String[]" access="global" default="[{Id:'0011I000006cw7zQAA',Name:'Abbott358 Inc (Account)'},{Id:'0061I000004oihQQAQ',Name:'Abbott1184 (Opportunity)'},{Id:'0031I000006uxdQQAQ',Name:'Jonathan Bruce (Contact)'},{Id:'00Q1I000002WqLEUA0',Name:'Bertha Boxer (Lead)'}]"/>
    <aura:attribute name="recordId" type="String" access="global"/>
    <aura:attribute name="configName" type="String" access="global" default="Greeble"/>
    
    <aura:handler name="change" value="{!v.recordId}" action="{!c.handleAttributeChange}"/>
    <aura:handler name="change" value="{!v.configName}" action="{!c.handleAttributeChange}"/>
        
    <div>
        <lightning:select value="{!v.recordId}" label="Record ID">
            <aura:iteration items="{!v.records}" var="record">
                <option value="{!record.Id}">{!record.Name}</option>
            </aura:iteration>
        </lightning:select> 
    </div>
    
    <div aura:id="magic"></div>
    
</aura:application>