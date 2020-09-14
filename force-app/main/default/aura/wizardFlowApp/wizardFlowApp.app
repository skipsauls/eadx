<aura:application extends="force:slds" access="global">
    <aura:attribute name="stages" type="String" access="global"/>
    <aura:attribute name="currentStage" type="String" access="global"/>    
    <aura:attribute name="configId" type="String" access="global" default="" description="The template config ID."/>    
    <aura:attribute name="interviewId" type="String" access="global" default="" description="The GUID for this interview."/>    
    <aura:attribute name="startFrom" type="String" access="global" default="blank" description="Start from a template or blank app."/>    
    <aura:handler name="init" value="{!this}" action="{!c.init}" />
   
    <!--
    <c:wizardFlowTest3 />
    -->
    
    <div class="outer">
	    <lightning:flow aura:id="flowData" onstatuschange="{!c.handleFlowStatusChange}"/>
    </div>
    
</aura:application>