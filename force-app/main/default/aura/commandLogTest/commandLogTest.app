<aura:application extends="force:slds">
    <aura:attribute name="executeCommand" type="Object" access="global"/>
    <lightning:layout>
        <lightning:layoutItem size="3">
            <c:commandLog executeCommand="{!v.executeCommand}"/>
            <lightning:input type="text" value="{!v.executeCommand.text}" label="Execute Command"/>
        </lightning:layoutItem>
        <lightning:layoutItem size="9">
        </lightning:layoutItem>
    </lightning:layout>
    
</aura:application>