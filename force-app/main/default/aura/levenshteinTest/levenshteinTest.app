<aura:application extends="force:slds">
    <aura:attribute name="stringA" type="String" default="Salesforce"/>
    <aura:attribute name="stringB" type="String" default="Analytics"/>
    <aura:attribute name="stringC" type="String" default="Einstein"/>
    <aura:attribute name="stringD" type="String" default="Surf Force"/>
    <aura:attribute name="match" type="Integer" default="-1"/>
    <aura:handler event="c:CommanderOutputEvent" 
                  action="{! c.handleCommanderOutput }"/>    
    <ltng:require scripts="{!join(',', $Resource.js_levenshtein, $Resource.string_similarity_js, $Resource.fuzzyset_js)}" afterScriptsLoaded="{!c.scriptsLoaded}"/>
    <div>
        <lightning:button label="Test" onclick="{!c.test}"/>
        <lightning:input type="text" label="A" class="input" value="{!v.stringA}"/>
        <lightning:input type="text" label="B" class="{!'input' + (v.match == 0 ? ' match' : '')}" value="{!v.stringB}"/>
        <lightning:input type="text" label="C" class="{!'input' + (v.match == 1 ? ' match' : '')}" value="{!v.stringC}"/>
        <lightning:input type="text" label="D" class="{!'input' + (v.match == 2 ? ' match' : '')}"  value="{!v.stringD}"/>
        <lightning:button label="Levenshtein" onclick="{!c.levenshtein}"/>
        <lightning:button label="Compare Two Strings" onclick="{!c.compareTwoStrings}"/>
        <lightning:button label="Find Best Match" onclick="{!c.findBestMatch}"/>
        <lightning:button label="Fuzzy Set" onclick="{!c.fuzzySet}"/>
    </div>
</aura:application>