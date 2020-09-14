<aura:application extends="force:slds" access="global">
    <aura:attribute name="title" type="String" access="global" default="Einstein Assistant"/>
    <aura:attribute name="fullScreen" type="Boolean" default="false"/>
    
    <div aura:id="outer" class="outer">
        <lightning:icon class="expand-icon"
                        iconName="{!v.fullScreen ? 'utility:contract' : 'utility:expand'}"
                        alternativeText="{!v.fullScreen ? 'Exit Full Screen' : 'Enter Full Screen'}"
                        onclick="{!c.toggleFullScreen}"
                        size="x-small"
                        />
        <lightning:layout class="main">
            <lightning:layoutItem class="slds-p-around_small" size="12">
                Dashboards, etc. here
            </lightning:layoutItem>
        </lightning:layout>
        <div class="utility-bar-content">
            <div class="item">
                <lightning:card class="card hide" aura:id="voiceUtilityBar">
                    <aura:set attribute="title">
                        <lightning:icon iconName="utility:einstein" size="xx-small"/>
                        <span class="slds-text-body_regular slds-m-left_x-small title">Einstein Assistant</span>
                    </aura:set>
                    <c:voiceUtilityBar standaloneApp="true"/>                
                </lightning:card>
            </div>
            <div class="item" style="left: 120px">
                <lightning:card class="card hide" aura:id="voiceUtilityBarSettings">
                    <aura:set attribute="title">
                        <lightning:icon iconName="utility:settings" size="xx-small"/>
                        <span class="slds-text-body_regular slds-m-left_x-small title">EA Settings</span>
                    </aura:set>
                    <c:voiceUtilityBarSettings standaloneApp="true"/>                
                </lightning:card>
            </div>
        </div>
        <div class="utility-bar">
            <div class="utility-bar-buttons">
                <lightning:button class="slds-p-horizontal_x-small utility-bar-button" label="Einstein Assistant" name="voiceUtilityBar" iconName="utility:einstein" variant="base" onclick="{!c.toggleUtilityItem}"/>
                <lightning:button class="slds-p-horizontal_x-small utility-bar-button" label="EA Settings" name="voiceUtilityBarSettings" iconName="utility:settings" variant="base" onclick="{!c.toggleUtilityItem}"/>
            </div>
        </div>
    </div>
</aura:application>