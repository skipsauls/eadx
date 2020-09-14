<aura:application template="c:oenolyticsEmbedTemplate" extends="force:slds" controller="OenolyticsController">
    <aura:attribute name="dashboardId" type="String" access="global" default="0FKB0000000AVFqOAO"/>
    <aura:attribute name="height" type="String" access="global" default="800"/>
    
    <aura:attribute name="imageUrl" type="String" default=""/>
    
    <aura:attribute name="upcCode" type="String" default="" access="global"/>
    <aura:attribute name="recordId" type="String" access="global"/>
    <aura:attribute name="targetRecord" type="Object" access="global"/>
    <aura:attribute name="targetFields" type="Object" access="global"/>
    <aura:attribute name="fields" type="String[]" default="['Name','Description','eadx__UPC_Code__c','eadx__Image_URL__c']" />
        
    <aura:attribute name="eaRecord" type="Object" access="global"/>
    
    <aura:attribute name="selectedTabId" type="String" default="details" access="global"/>
    
    <aura:dependency resource="markup://wave:waveDashboard"/>
    
    
    <aura:registerEvent name="updateUPCCode" type="c:updateUPCCode"/>
    <aura:handler event="c:updateUPCCode" action="{!c.handleUPCCodeEvent}"/>

    <aura:registerEvent name="selectTab" type="c:selectTab"/>
    <aura:handler event="c:selectTab" action="{!c.handleSelectTabEvent}"/>
    
    <aura:handler name="init" value="{!this}" action="{!c.refresh}"/>
    
    <aura:handler name="change" value="{!v.upcCode}" action="{!c.handleUPCCodeChanged}"/>
    <aura:handler name="change" value="{!v.recordId}" action="{!c.handleRecordIdChanged}"/>
    
    <aura:handler event="wave:selectionChanged" action="{!c.handleSelectionChanged}"/>
    
    <div class="{!'outer ' + (v.eaRecord != null ? 'show' : 'hide')}">
        <lightning:layout class="slds-m-around_x-small">
            <lightning:layoutItem size="12">
                <!--
                <lightning:button label="All Wines" onclick="{!c.allWines}"/>
                <lightning:button label="Decoy Wines" onclick="{!c.decoyWines}"/>
                <lightning:button label="UPC Wine" onclick="{!c.upcWine}"/>
				-->
                <!--
                <lightning:input type="text" label="UPC Code" value="{!v.upcCode}"/>
				-->
                <div class="tabs">
                    <div class="{!'tab ' + (v.selectedTabId == 'details' ? 'show' : 'hide')}">
                        <!--
                    <h1>recordId: {!v.recordId}</h1>
                    <h1>targetFields.Name: {!v.targetFields.Name}</h1>
                    <div aura:id="recordData">
                    </div>
     -->
                        <lightning:card class="{!'details ' + (v.eaRecord != null ? '' : 'hide')}">
                            <aura:set attribute="title">
                                
                            </aura:set>
                            <aura:set attribute="footer">
                                <div>
                                    <!--
                                    <lightning:badge label="{!v.eaRecord.variety}"/>
                                    <lightning:badge label="{!v.eaRecord.year}"/>
                                    <lightning:badge label="{!v.eaRecord.points + ' pts.'}"/>
                                    <lightning:badge label="{!'$' + v.eaRecord.price}"/>
          							-->
                                </div>
                            </aura:set>
                            <lightning:layout class="details">
                                <lightning:layoutItem size="6" class="slds-m-horizontal_x-small">
                                    <div class="slds-text-body_small slds-p-vertical_x-small heading">
                                        <span class="slds-text-title_caps province">{!v.eaRecord.province}</span>
                                        <span class="slds-text-title_caps region">{!v.eaRecord.year}</span>
                                    </div>
                                    <div class="slds-text-heading_medium slds-m-bottom_x-small title">
                                        {!v.eaRecord.title}
                                    </div>
                                    <div class="slds-text-body_small slds-m-bottom_medium variety">
                                        {!v.eaRecord.variety}
                                    </div>
                                    <div class="slds-text-body_small slds-m-vertical_x-small pointsprice">
                                         <lightning:layout>
			                                <lightning:layoutItem size="6" class="slds-m-right_x-small">
                                                <div class="slds-text-title_caps">Points</div>
            		                            <lightning:formattedNumber value="{!v.eaRecord.points}" class="slds-text-heading_medium points"/>
                                             </lightning:layoutItem>
                                             <lightning:layoutItem size="6" class="slds-m-left_x-small">
                                                <div class="slds-text-title_caps">Price</div>
		                                        <lightning:formattedNumber value="{!v.eaRecord.price}" style="currency" currencyCode="USD" class="price slds-text-heading_medium"/>
                                             </lightning:layoutItem>
                                        </lightning:layout>
                                    </div>
                                    <div class="slds-text-heading_small slds-m-vertical_x-small winery">
                                        {!v.eaRecord.winery}
                                    </div>
                                    <div class="slds-text-heading_small slds-m-vertical_x-small region">
                                        {!v.eaRecord.region_1}
                                    </div>
                                </lightning:layoutItem>
                                <lightning:layoutItem size="6">
                                    <div class="image">
                                        <img src="{!v.imageUrl}"/>
                                    </div>                        
                                </lightning:layoutItem>
                            </lightning:layout>

                                    <div class="slds-text-body_regular slds-m-vertical_small slds-p-vertical_medium slds-border_top description">
                                        {!v.eaRecord.description}
                                    </div>

                        </lightning:card>
                        <!--
                    <aura:if isTrue="{!recordId != null}">
                        <lightning:recordViewForm recordId="{!v.recordId}" objectApiName="Product2">
                            <div class="slds-box">
                                <lightning:outputField fieldName="Name" />
                                <lightning:outputField fieldName="eadx__Image_URL__c" value="{!v.imageUrl}"/>
                                <lightning:outputField fieldName="eadx__UPC_Code__c" />
                            </div>
                        </lightning:recordViewForm>
                    </aura:if>
                    -->
                    </div>
                    <div class="{!'tab ' + (v.selectedTabId == 'analytics' ? 'show' : 'hide')}">
                        <div aura:id="dashboard" class="dashboard-container"/>
                        <wave:waveDashboard dashboardId="{!v.dashboardId}" height="{!v.height}" openLinksInNewWindow="false" showHeader="false" showTitle="false" showSharing="false"/>
                                                                                 
                    </div>
                </div>
            </lightning:layoutItem>
        </lightning:layout>
        
    </div>
    
</aura:application>