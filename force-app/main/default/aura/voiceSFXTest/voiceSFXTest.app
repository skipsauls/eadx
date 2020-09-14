<aura:application controller="VoiceSFXController" extends="force:slds">
    <aura:attribute name="resourceName" type="String" description="The name of the static resource" access="global" default="voiceSFX"/>
    <aura:attribute name="soundResources" type="Object[]" description="Array of named resources to load"/>
    
    <div>
        <lightning:layout multipleRows="true">
            <lightning:layoutItem size="4" padding="around-small">
                <lightning:card title="Analytics Voice - SFX" iconName="utility:volume_high">
                    <ul class="slds-p-around_small" >
                        <aura:iteration items="{!v.soundResources}" var="info">
                            <li>
                                <lightning:button name="{!info.fileName}" iconName="utility:play" iconPosition="right" variant="bare" onclick="{! c.playSound}" label="{!info.fileName}" />
                            </li>
                        </aura:iteration>
                    </ul>
                </lightning:card>
            </lightning:layoutItem>
        </lightning:layout>
        
    </div>
    <c:voiceSFX aura:id="sfx" resourceName="{!v.resourceName}" soundResources="{!v.soundResources}"/>
</aura:application>