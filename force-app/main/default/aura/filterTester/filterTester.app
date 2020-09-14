<aura:application access="global" extends="force:slds">
    <aura:attribute name="dashboardId" type="String" access="GLOBAL" default="0FKB00000003fBpOAI"/>
    <aura:attribute name="dashboardId2" type="String" access="GLOBAL" default="0FKB00000003fCTOAY"/>
    <aura:attribute name="developerName" type="String" access="GLOBAL" default="eadx__Alpha_Test"/>
    
    <lightning:layout>
        <lightning:layoutItem size="2">
            <c:filterTest dashboardId="{!v.dashboardId}"/>
            <c:filterTest developerName="{!v.developerName}"/>
        </lightning:layoutItem>
        <lightning:layoutItem size="5">
            <h1>DashboardId: {!v.dashboardId}</h1>
            <wave:waveDashboard dashboardId="{!v.dashboardId}" height="700"/>
        </lightning:layoutItem>
        <lightning:layoutItem size="5">
            <h1>DeveloperName: {!v.developerName}</h1>
            <wave:waveDashboard developerName="{!v.developerName}" height="700"/>            
        </lightning:layoutItem>
        <!--
        <lightning:layoutItem size="3">
            <h1>DashboardId2: {!v.dashboardId2}</h1>
            <div style="transform: scale(0.5)">
                <wave:waveDashboard dashboardId="{!v.dashboardId2}" height="700"/>            
            </div>
        </lightning:layoutItem>
  -->
    </lightning:layout>
    <lightning:layout>
        <lightning:layoutItem size="5">
            <h1>DashboardId: {!v.dashboardId}</h1>
            <wave:waveDashboard dashboardId="{!v.dashboardId}" height="700"/>
        </lightning:layoutItem>
        <lightning:layoutItem size="5">
            <h1>DeveloperName: {!v.developerName}</h1>
            <wave:waveDashboard developerName="{!v.developerName}" height="700"/>            
        </lightning:layoutItem>
    </lightning:layout>
</aura:application>