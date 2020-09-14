/*
 * Analytics Sharing Utils
 * 
 * Note: This began as a copy of the Analytics Template Utils
 * and may include code that isn't directly relevant to sharing.
 * 
 */
function showToast(level, message, details) {
    var container = document.querySelector("#toast");
    container.classList.add("toast-hidden");
    var notify = document.querySelector(".slds-notify.slds-notify--toast");
    notify.classList = [];
    notify.classList.add("slds-notify", "slds-notify--toast");
    if (level) {
        notify.classList.add("slds-theme--" + level);
    }
    document.querySelector("#toast-message").innerHTML = message || "";
    document.querySelector("#toast-details").innerHTML = details || "";
    container.classList.remove("toast-hidden");
    setTimeout(function() {
        var container = document.querySelector("#toast");
        container.classList.add("toast-hidden");                
    }, 3000);
}


// Wrappers for the loadingAnalytics spinner
// Can be replaced with other spinners if desired

function toggleSpinner() {
    wtutils.loadingAnalytics.toggle();    
}

function showSpinner() {
    wtutils.loadingAnalytics.show();    
}

function hideSpinner() {
    wtutils.loadingAnalytics.hide();    
}

function hideToast() {
    var container = document.querySelector("#toast");
    container.classList.add("toast-hidden");        
}

function addLoadEvent(func) { 
    var oldonload = window.onload; 
    if (typeof window.onload != 'function') { 
        window.onload = func; 
    } 
    else { 
        window.onload = function() { 
            if (oldonload) { 
                oldonload(); 
            } 
            func(); 
        } 
    } 
} 

var _defaultActions = {
    refresh: {
        label: "Refresh",
        icon: {
            type: "action",
            name: "refresh"
        },
        action: refreshResource
    }
};

var _selectedResType = "dataset";


var _resTypeMap = {
    sobject: {
        name: "sobject",
        partialUrl: "/sobjects",
        label: "SObjects",
        type: "sobjects",
        thumbnailUrl: "/analytics/wave/web/proto/images/thumbs/thumb-dashboard.png",
        resourceMap: null,
        default: true
    },    
    dataset: {
        name: "dataset",
        partialUrl: "/wave/datasets",
        label: "Datasets",
        type: "datasets",
        thumbnailUrl: "/analytics/wave/web/proto/images/thumbs/thumb-edgemart.png",
        resourceMap: null
    }
};

addLoadEvent(function() {
    setup(function() {
        var resType = null;
        for (var key in _resTypeMap) {
            resType = resType || _resTypeMap[key];
            if (_resTypeMap[key].default === true) {
                resType = _resTypeMap[key];
            }
        }
        console.warn("resType: ", resType);
        refreshResources();
        
    });
});

var _apiVersion = null;
var _baseUrl = null;


function createTab() {
    
}

function setupDetailTabs() {
    var list = document.querySelector("ul#details-tab-list");
    var links = document.querySelectorAll("ul#details-tab-list .slds-tabs--scoped__link");
    console.warn("links: ", links);
    for (var i = 0; i < links.length; i++) {
        link = links[i];
        link.onclick = function(evt) {
            console.warn("link clicked: ", evt);
            var id = evt.currentTarget.getAttribute("id");
            id = id.replace("item", "outer");
            var tabItems = document.querySelectorAll("ul#details-tab-list .slds-tabs--scoped__item");                    
            for (var i = 0; i < tabItems.length; i++) {
                if (tabItems[i].getAttribute("id") === id) {
                    tabItems[i].classList.add("slds-active");
                } else {
                    tabItems[i].classList.remove("slds-active");                        
                }
            }
            
            var tabId = id.replace("__outer", "");
            var tabs = document.querySelectorAll("#details-content .slds-tabs--scoped__content");
            for (var i = 0; i < tabs.length; i++) {
                if (tabs[i].getAttribute("id") === tabId) {
                    tabs[i].classList.add("slds-show");
                    tabs[i].classList.remove("slds-hide");
                } else {
                    tabs[i].classList.add("slds-hide");
                    tabs[i].classList.remove("slds-show");
                }
            }
        }            
        
    }        
}

function setupResourceTabs() {
    var list = document.querySelector("ul#resource-tab-list");
    var tab = null;
    var link = null;
    var type = null;
    var index = 0;
    for (var key in _resTypeMap) {
        type = _resTypeMap[key];
        console.warn("type: ", type);
        
        tab = document.createElement("li");
        tab.classList.add("slds-tabs--default__item");
        if (key === _selectedResType) {
            tab.classList.add("slds-active");
        }
        tab.setAttribute("title", type.label);
        tab.setAttribute("role", "presentation");
        tab.setAttribute("data-res-type", key);
        
        link = document.createElement("a");
        link.classList.add("slds-tabs--default__link");
        link.setAttribute("role", "tab");
        link.setAttribute("tabindex", index === 0 ? 0 : -1);
        link.innerHTML = type.label;
        link.setAttribute("href", "javascript:void(0);");
        link.setAttribute("data-res-type", key);
        link.onclick = function(evt) {
            var k = evt.currentTarget.getAttribute("data-res-type");
            _selectedResType = k;
            var tabs = document.querySelectorAll("ul#resource-tab-list .slds-tabs--default__item");                    
            for (var i = 0; i < tabs.length; i++) {
                if (tabs[i].getAttribute("data-res-type") === k) {
                    tabs[i].classList.add("slds-active");
                } else {
                    tabs[i].classList.remove("slds-active");                        
                }
            }
            
            //document.querySelector("#action-buttons").innerHTML = "";                    
            document.querySelector("#attributes").innerHTML = "";
            document.querySelector("textarea#json").value = "";
            
            clearSearch();
            refreshResources();
            
        }
        tab.appendChild(link);
        
        list.appendChild(tab);
        
        index++;
    }   
}

function setup(callback) {
    document.querySelector("#toast-close").onclick = function(evt) {
        hideToast();
    }
    setupResourceTabs();
    setupDetailTabs();
    var config = {
        url: "/services/data",
        method: "GET",
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        }
    };
    
    showSpinner();
    sendRequest(config, function(response) {
        hideSpinner();
        console.warn("versions: ", response.templates);
        _apiVersion = response[response.length - 1].version;
        _baseUrl = response[response.length - 1].url;
        console.warn("_apiVersion: ", _apiVersion);
        console.warn("_baseUrl: ", _baseUrl);
        callback();
    });    
}        

/* Actions */
function refreshResource(evt) {
    console.warn("refreshResource: ", evt, evt.currentTarget);
    var type = evt.currentTarget.getAttribute("data-type");
    var id = evt.currentTarget.getAttribute("data-id");
    var name = evt.currentTarget.getAttribute("data-name");
    var resTypeName = evt.currentTarget.getAttribute("data-restype-name");
    var resType = _resTypeMap[resTypeName];
    var resource = null;
    if (typeof id !== "undefined" && id !== null) {
        resource = resType.resourceMap[id];
    } else {
        resource = resType.resourceMap[name];
    }
    
    console.warn("resource: ", resource);
    
    var config = {
        url: resource.url,
        method: "GET",
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        }  
    };
    console.warn("config: ", config);
    
    showSpinner();
    sendRequest(config, function(response) {
        hideSpinner();
        console.warn("response: ", response);        
    });         
}            

function refreshResources() {
    var resType = _resTypeMap[_selectedResType];
    console.warn("refreshResources - resType: ", resType);
    
    showSpinner();
    listResources(_selectedResType, function(response) {
        //console.warn("listResources returned: ", _selectedResType, response);
        hideSpinner();
        if (response.status && (response.status < 200 || response.status > 299)) {
            showToast("error", "Error: You do not have access to the " + resType.label + " API.");
        } else {        
            //console.warn("listResources response: ", response);
            showResources(resType.name, resType.type ? response[resType.type] : response);
            
            if (resType.name === "sobject") {
	            showSObjectSharingCoverage();  
            } else if (resType.name === "dataset") {
                showDatasetSharingCoverage();
            }
        }
    });        
}

function listResources(type, callback) {
    var resType = _resTypeMap[type];
    //console.warn("resType: ", resType);
    if (resType) {
        var config = {
            url: _baseUrl + resType.partialUrl,
            method: "GET",
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            }
        };
        showSpinner();
        sendRequest(config, function(response) {
            hideSpinner();
            //console.warn("response: ", response);
            callback(response);
        });
    } else {
        callback(null);
    }
}

function handleChangeAttribute(evt) {
    console.warn("handleChangeAttribute: ", evt, evt.currentTarget);
    var value = evt.currentTarget.value;
    var key = evt.currentTarget.getAttribute("data-key");
    var id = evt.currentTarget.getAttribute("data-id");
    var name = evt.currentTarget.getAttribnute("data-name");
    var resTypeName = evt.currentTarget.getAttribute("data-restype-name");
    var resType = _resTypeMap[resTypeName];
    var resource = null;
    if (typeof id !== "undefined" && id !== null) {
        resource = resType.resourceMap[id];
    } else {
        resource = resType.resourceMap[name];
    }
    console.warn("resource: ", resource);
    console.warn("key: ", key);
    console.warn("value: ", value);
    
    var tokens = key.split(".");
    var obj = resource;
    var _obj = obj;
    var rootObj = {};
    var obj2 = rootObj;
    
    for (var i = 0; i < tokens.length; i++) {
        token = tokens[i];
        console.warn("------------------> token: ", token);
        if (token.indexOf("[") >= 0) {
            idx = token.split("[")[1].replace(/\]/g, "");
            token = token.split("[")[0];
            console.warn(">>>>>>>>>>> token: ", token);
            console.warn(">>>>>>>>>>> idx: ", idx);
        } else {
        }
    }
}

function createAttributeElement(key, value, resType, resource) {
    
    if (typeof value === "object") {
        var container = document.
        createElement("div");
        container.classList.add("slds-form-element");
        var el = null;                
        if (value instanceof Array) {
            for (var i  = 0; i < value.length; i++) {
                el = createAttributeElement(key + "[" + i + "]", value[i], resType, resource);
                container.appendChild(el);
            }                    
        } else {
            for (var k in value) {
                //el = createAttributeElement("[\"" + key + "\"][\"" + k + "\"]", value[k], resType, resource);
                el = createAttributeElement(key + "." + k, value[k], resType, resource);
                container.appendChild(el);
            }                    
        }
        return container;
    } else {
        
        var formEl = null;
        var label = null;
        var control = null;
        var el = null;
        var searchKey = key.toLowerCase().replace(/[\._\[\]]/g, "_");
        
        formEl = document.createElement("div");
        formEl.classList.add("slds-form-element");
        formEl.setAttribute("data-key", key);
        formEl.setAttribute("data-search-key", searchKey);
        
        label = document.createElement("label");
        label.classList.add("slds-form-element__label");
        label.setAttribute("for", key + "-control");
        label.innerHTML = key;
        formEl.appendChild(label);
        
        control = document.createElement("div");
        control.classList.add("slds-form-element__control");
        el = document.createElement("input");
        el.setAttribute("type", "text");
        el.classList.add("slds-input");
        el.setAttribute("id", key + "-control");
        el.setAttribute("data-key", key);
        el.setAttribute("data-id", resource.id || "");
        el.setAttribute("data-name", resource.name || "");
        el.setAttribute("data-restype-name", resType.name);
        el.setAttribute("value", value);
        el.onchange = handleChangeAttribute;
        control.appendChild(el);
        formEl.appendChild(control);
        
        if (resType.name !== "appTemplate" && resType.name !== "dashboardTemplate") {
            
            // Move and generalize for use with action buttons, etc.
            var button = null;
            var svg = null;
            var useEl = null;
            var url = null;
            var svgns = "http://www.w3.org/2000/svg";
            var xlinkns = "http://www.w3.org/1999/xlink";
            
            button = document.createElement("button");
            button.classList.add("slds-button", "slds-button--icon-border");
            button.setAttribute("title", "Add to Template");
            button.setAttribute("data-value", value);
            button.setAttribute("data-key", key);
            button.setAttribute("data-id", resource.id || "");
            button.setAttribute("data-name", resource.name || "");
            button.setAttribute("data-restype-name", resType.name);
            button.setAttribute("value", value);
            
            //button.innerHTML = "&rarrb;";
            svg = document.createElementNS(svgns, "svg");
            svg.classList.add("slds-button__icon");
            svg.setAttributeNS(null, "aria-hidden", true);
            useEl = document.createElementNS(svgns, "use");
            url = _svgUrl.replace("%%TYPE%%", "utility");
            url = url.replace("%%NAME%%", "forward");
            useEl.setAttributeNS(xlinkns, "href", url);
            svg.appendChild(useEl);
            button.appendChild(svg);
            button.onclick = function(evt) {
                console.warn("button click: ", evt.currentTarget);
                var key = evt.currentTarget.getAttribute("data-key");
                var value = evt.currentTarget.getAttribute("data-value");
                var id = evt.currentTarget.getAttribute("data-id");
                var name = evt.currenTargety.getAttribute("data-name");
                var resTypeName = evt.currentTarget.getAttribute("data-restype-name");
                var resType = _resTypeMap[resTypeName];
                var resource = null;
                if (typeof id !== "undefined" && id !== null) {
                    resource = resType.resourceMap[id];
                } else {
                    resource = resType.resourceMap[name];
                }
                console.warn("resource: ", resource);
                console.warn("key: ", key);
                console.warn("value: ", value);
                
                var templateDef = createTemplateDef(resource, key, value);
                console.warn("templateDef: ", templateDef);
                
                var templateJson = JSON.stringify(templateDef, null, 2);
                console.warn("templateJson: ", templateJson);
                
            }
            
            formEl.appendChild(button);
        }
        
        return formEl;
    }
}

function determineType(val) {
    var type = "StringType";
    if (typeof val === "string") {
        var lcval = val.toLowerCase();
        if (lcval === "true" || lcval === "false") {
            type = "BooleanType";
        } else if (!isNaN(Number(val))) {
            type = "StringType";
        }
    }
    
    return type;
}

function hideModal(locator) {
    var backdrop = document.querySelector("#backdrop");
    var modal = document.querySelector(locator);
    modal.classList.add("modal-hidden");
    backdrop.classList.add("backdrop-hidden");
}

function showModal(resource, key, value, values) {
    var locator = "#modal";
    var backdrop = document.querySelector("#backdrop");
    var modal = document.querySelector(locator);
    modal.classList.remove("modal-hidden");
    backdrop.classList.remove("backdrop-hidden");
    document.querySelector(locator + " [name=cancelButton]").onclick = function(evt) {
        hideModal(locator);
    }
}


function copyToClipboard(locator, type) {
	try {
		var textarea = document.querySelector("textarea" + locator);
		textarea.select();
		document.execCommand("copy");
		textarea.blur();
		showToast("success", "Copied to Clipboard", "The " + type + " was copied to the clipboard.");
	} catch (e) {
		showToast("error", "Unable to Copy to Clipboard", e);
	}
	
}

function searchAttributes(input) {
    var value = input.value;
    //console.warn("search value: ", value);
    if (value && value.length >= 2) {
        var key = value;
        var searchKey = value; //value.toLowerCase();
        var matches = document.querySelectorAll("#attributes .slds-form-element[data-key*='" + searchKey + "']");
        //console.warn("matches: ", matches);
        var map = {};
        matches.forEach(function(item) {
            map[item.getAttribute("data-key")] = item; }
        );
        //console.warn("map: ", map);
        var items = document.querySelectorAll("#attributes .slds-form-element[data-key]");
        var count = 0;
        items.forEach(function(item) {
            if (map[item.getAttribute("data-key")]) {
                item.closest("div.slds-form-element[data-key]").classList.remove("hidden");
                count++;
            } else {
                item.closest("div.slds-form-element[data-key]").classList.add("hidden");
            }
        });
        document.querySelector("#match-count").innerHTML = count;
        document.querySelector("#match-count-label").classList.remove('hidden');
    } else {
        var items = document.querySelectorAll("#attributes .slds-form-element[data-key]");
        items.forEach(function(item) {
            item.closest("div.slds-form-element[data-key]").classList.remove("hidden");
        });
        document.querySelector("#match-count-label").classList.add('hidden');
    }

}

function clearSearch() {
    document.querySelector("#attribute-search").value = "";
    document.querySelector("#match-count").innerHTML = 0;
    document.querySelector("#match-count-label").classList.add('hidden');    
}

function showAttributes(resType, resource) {
    clearSearch();
    var form = document.querySelector("#attributes");
    form.innerHTML = "";
    var formEl = null;
    var value = null;
    for (var key in resource) {
        value = resource[key];
        formEl = createAttributeElement(key, value, resType, resource);
        form.appendChild(formEl);
    }
}

function createActionButton(action, resType, resource) {
    var button = null;
    var svg = null;
    var useEl = null;
    var url = null;
    var svgns = "http://www.w3.org/2000/svg";
    var xlinkns = "http://www.w3.org/1999/xlink";
    
    button = document.createElement("button");
    button.classList.add("slds-button", "slds-button--icon-border");
    button.setAttribute("title", action.label);
    button.setAttribute("data-type", resource.type);
    button.setAttribute("data-id", resource.id || "");
    button.setAttribute("data-name", resource.nsme || "");
    button.setAttribute("data-restype-name", resType.name);
    //button.innerHTML = action.label;
    svg = document.createElementNS(svgns, "svg");
    svg.classList.add("slds-button__icon");
    svg.setAttributeNS(null, "aria-hidden", true);
    useEl = document.createElementNS(svgns, "use");
    url = _svgUrl.replace("%%TYPE%%", action.icon.type);
    url = url.replace("%%NAME%%", action.icon.name);
    useEl.setAttributeNS(xlinkns, "href", url);
    svg.appendChild(useEl);
    button.appendChild(svg);
    button.onclick = action.action;
    
    return button;
}

function showActions(action, resType, resource) {
    
    // Ignore
    return;
    
    var action = null;
    var buttons = document.querySelector("#action-buttons");
    buttons.innerHTML = "";
    var button = null;
    for (var key in _defaultActions) {
        action = _defaultActions[key];
        button = createActionButton(action, resType, resource);    
        buttons.appendChild(button);
    }
    if (resType.actions) {
        for (var key in resType.actions) {
            action = resType.actions[key];
            button = createActionButton(action, resType, resource);    
            buttons.appendChild(button);
        }
        
    }
    
}

function showJSON(resource) {
    var r = typeof resource === 'object' ? resource : JSON.parse(resource);
    var json = JSON.stringify(r, null, 4);
    document.querySelector("textarea#json").value = json;
}

/*

/services/data/v41.0/wave/security/coverage/objects/User

{eligibleSharingSource: true, label: "Account", name: "Account", url: "/services/data/v41.0/wave/security/coverage/objects/Account"}
*/

function showProgressbar() {
    document.querySelector("#progressbar-container").classList.remove("slds-hide");
}

function hideProgressbar() {
    document.querySelector("#progressbar-container").classList.add("slds-hide");
}

function initProgressbar(min, max, percent, label) {
	document.querySelector("#progressbar").setAttribute("aria-valuemin", min);
	document.querySelector("#progressbar").setAttribute("aria-valuemax", max);
	document.querySelector("#progressbar").setAttribute("aria-valuenow", percent);
	document.querySelector("#progressbar-value").style.width = percent + "%";    
    document.querySelector("#progressbar-label").innerHTML = label;       
	document.querySelector("#progressbar-text").innerHTML = percent + "%";
}

function updateProgressbar(percent) {
	document.querySelector("#progressbar").setAttribute("aria-valuenow", percent);
	document.querySelector("#progressbar-value").style.width = percent + "%";
	document.querySelector("#progressbar-text").innerHTML = percent + "%";
}

var _sharingCoverage = {};

function showDatasetSharingCoverage(callback) {
    console.warn("showDatasetSharingCoverage");
    
    if (_resTypeMap.dataset && _resTypeMap.dataset.resourceMap) {
        showSharingCoverage("dataset");
    } else {
        listResources("dataset", function(response) {
            var resources = response.datasets;
            
            for (var i = 0; i < resources.length; i++) {
                resource = resources[i];
                //console.warn("resource: ", resource);
                
                if (resource.id) {
                    _resTypeMap.dataset.resourceMap[resource.id] = resource;        
                } else {
                    _resTypeMap.dataset.resourceMap[resource.name] = resource;                    
                }
            }
            showSharingCoverage("dataset", function() {
                
            });
        });
    }

}
                  
function showSObjectSharingCoverage(callback) {
    console.warn("showSObjectSharingCoverage");
    
    if (_resTypeMap.sobject && _resTypeMap.sobject.resourceMap) {
        showSharingCoverage("sobject");
    } else {
        listResources("sobject", function(response) {
            var resources = response.sobjects;
            
            for (var i = 0; i < resources.length; i++) {
                resource = resources[i];
                //console.warn("resource: ", resource);
                
                if (resource.id) {
                    _resTypeMap.sobject.resourceMap[resource.id] = resource;        
                } else {
                    _resTypeMap.sobject.resourceMap[resource.name] = resource;                    
                }
            }
            showSharingCoverage("sobject", function() {
                
            });
        });
    }
}

function getSharingCoverage(type, callback) {
    console.warn("getSharingCoverage: ", type);
    
    _sharingCoverage[type] = _sharingCoverage[type] || {};
    
    var resourceMap = _resTypeMap[type].resourceMap;
    var resourceList = [];
    for (var key in resourceMap) {
        resourceList.push(resourceMap[key]);
    }

    var resource = null;
    var url = null;
    var config = {
        url: url,
        method: "GET",
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        }
    };
    var name = null;
    var id = null;
    
    var total = resourceList.length;
    var count = total;
    var percent = 0;
    var sharingEnabled = false;
    
    var label = "Retrieving " + type.substring(0, 1).toUpperCase() + type.substring(1) + " Sharing Coverage...";
    
    initProgressbar(0, 100, 0, label);
    showProgressbar();
    
    for (var i = 0; i < resourceList.length; i++) {
        resource = resourceList[i];
        //console.warn("resource: ", resource);
        
        url = _baseUrl;
        
        if (type === "sobject") {
            url += "/wave/security/coverage/objects/" + resource.name;
        } else if (type === "dataset") {
            url += "/wave/security/coverage/datasets/" + resource.id + "/versions/" + resource.currentVersionId;
        } else {
            //
        }
                
        config.url = url;
        
        sendRequest(config, function(response) {
            //console.warn("response: ", response);
            if (type === "sobject") {
        	    name = response.namespace ? response.namespace + "__" : "";
    	        name += response.name;
                sharingEnabled = response.eligibleSharingSource;
            } else if (type === "dataset") {
                name = response.datasetVersion.dataset.namespace  ? response.datasetVersion.dataset.namespace + "__" : "";
                name += response.datasetVersion.dataset.name;
            }

            _sharingCoverage[type][name] = response;
            
            count--;
            percent = Math.round(((total - count) / total) * 100);
            updateProgressbar(percent);
            
            if (count === 0 && typeof callback === "function") {
                hideProgressbar();
                callback(type);
            }
		});
    }
}

function showSharingCoverage(type) {
    //console.warn("showSharingCoverage: ", type);
    
    
    if (typeof _sharingCoverage[type] === "undefined" || _sharingCoverage[type] === null) {
        getSharingCoverage(type, showSharingCoverage);
    }

    var coverage = null;
            
    var resource = null;
            
    var name = null;
    var id = null;
    var item = null;
    var icon = null;
    var sharingEnabled = false;
    
    for (var key in _sharingCoverage[type]) {
		coverage = _sharingCoverage[type][key];
        resource = _resTypeMap[type].resourceMap[key];
        //console.warn("coverage: ", coverage);
        //console.warn("resource: ", resource);
        name = resource.namespace ? resource.namespace + "__" : "";
        name += resource.name;
        
        sharingEnabled = false;
        
        if (type === "dataset") {
            for (var i = 0; i < coverage.sources.length; i++) {                
                if (coverage.sources[i].object.eligibleSharingSource === true) {
                    sharingEnabled = true;
                }
            }
        } else {
	        sharingEnabled = coverage.eligibleSharingSource;
        }
        
        if (sharingEnabled) {
            // Show the icon
            if (type === "sobject") {
                item = document.querySelector("[data-restype-name=sobject][data-name=" + name + "]");
                icon = document.querySelector("[data-restype-name=sobject][data-name=" + name + "] .slds-hide");                    
            } else if (type === "dataset") {
                id = coverage.datasetVersion.dataset.id;
                item = document.querySelector("[data-restype-name=dataset][data-id=\"" + id + "\"]");
                icon = document.querySelector("[data-restype-name=dataset][data-id=\"" + id+ "\"] .slds-hide");                    
            } else {
                
            }
            
            if (item) {
                item.classList.add("has-sharing-coverage");
            }
            if (icon) {
                icon.classList.remove("slds-hide");                  
            }
            // Move to top (controversial?)
            if (item) {
                var sitems = item.parentElement.querySelectorAll("[data-restype-name=sobject].has-sharing-coverage");
                //console.warn("sitems: ", sitems, sitems.length);
                if (sitems.length < 2) {
                    item.parentElement.insertBefore(item, item.parentElement.firstChild);
                } else {
                    item.parentElement.insertBefore(item, sitems[sitems.length - 2].nextElementSibling);
                }
            }
        }
    }
}

function refresh() {
    
    for (var key in _resTypeMap) {
        _resTypeMap[key].resourceMap = null;
    }
    
    _sharingCoverage = {};
    
    refreshResources();
}

function expSharingCoverage() {
    if (_selectedResType === "sobject") {
        expSObjectSharingCoverage();
    } else if (_selectedResType === "dataset") {
        expDatasetSharingCoverage();
    }
}

function expSObjectSharingCoverage() {
    var type = "sobject";
    var resourceMap = _resTypeMap[type].resourceMap;
    var resource = null;

    var exp = "data:text/csv;name=SObjectSharingCoverage.csv;charset=utf-8,";
    
    exp += "type";
    exp += "," + "eligibleSharingSource";
    exp += "," + "keyPrefix";
    exp += "," + "name";
    exp += "\r\n";
    
    for (var key in resourceMap) {
        resource = resourceMap[key];
		coverage = _sharingCoverage[type][key];
        
        exp += type;
        exp += "," + (coverage.eligibleSharingSource === true ? "true" : "false");
        exp += "," + resource.keyPrefix;
        exp += "," + resource.name;
        exp += "\n";
    }
    //console.warn(exp);
    
	var encodedUri = encodeURI(exp);
	var link = document.querySelector("#download_link");
    link.href = encodedUri;
    link.setAttribute("download", "SObjectSharingCoverage.csv");
    link.click();
}

function expDatasetSharingCoverage() {
    var type = "dataset";
    var resourceMap = _resTypeMap[type].resourceMap;
    var resource = null;
    var source = null;
    var secrityField = null;

    var exp = "data:text/csv;name=DatasetSharingCoverage.csv;charset=utf-8,";

    exp += "type";
    exp += "," + "eligibleSharingSource";
    exp += "," + "id";
    exp += "," + "namespace";
    exp += "," + "name";
    exp += "," + "securityField"
    exp += "\n";

    for (var key in resourceMap) {
        resource = resourceMap[key];
		coverage = _sharingCoverage[type][key];
        sharingEnabled = false;
        
        for (var i = 0; i < coverage.sources.length; i++) {
            source = coverage.sources[i];
            
            for (var j = 0; j < source.securityFields.length; j++) {
                securityField = source.securityFields[i];
                exp += type;
                exp += "," + (source.object.eligibleSharingSource === true ? "true" : "false");
                exp += "," + (resource.id || "");
                exp += "," + (resource.namespace || "");
                exp += "," + resource.name;
                exp += "," + (securityField || "null");
                exp += "\r\n";
            }
        }
    }
    //console.warn(exp);
    
	var encodedUri = encodeURI(exp);
	var link = document.querySelector("#download_link");
    link.href = encodedUri;
    link.setAttribute("download", "DatasetSharingCoverage.csv");
    link.click();    
}

function showSharing(type, resType, resource) {
    var t0 = Date.now();
    console.warn("showSharing: ", type, resType, resource);
    
    var sharing = document.querySelector("#sharing");
    sharing.innerHTML = null;
    
    var url = _baseUrl;
    
    if (type === "sobject") {
        url += "/wave/security/coverage/objects/" + resource.name;
    } else if (type === "dataset") {
        url += "/wave/security/coverage/datasets/" + resource.id + "/versions/" + resource.currentVersionId;
    } else {
        //
    }
    var config = {
        url: url,
        method: "GET",
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        }
    };
    //showSpinner();
    sendRequest(config, function(response) {
        //hideSpinner();
        //console.warn("response: ", response);
        var label = document.createElement("h1");
        if (response && response.sources) {
            var source = null;
            for (var i = 0; i < response.sources.length; i++) {
                source = response.sources[i];
                //console.warn("source: ", source);
	            label.innerHTML = source.object.eligibleSharingSource === true ? "Yes!" : "No Sharing For You!";
            }

        } else if (response && typeof response.eligibleSharingSource !== "undefined") {
			label.innerHTML = response.eligibleSharingSource === true ? "Yes!" : "No Sharing For You!";            
        }
        sharing.appendChild(label);
        var t1 = Date.now();
        console.warn("showSharing time: ", t1 - t0);
    });
}

function selectItem(evt) {
    var t0 = Date.now();
    console.warn("selectItem: ", evt, evt.currentTarget);
    document.querySelectorAll(".item-clickable.selected").forEach(function(e) {
        e.classList.remove("selected");
    });
    evt.currentTarget.classList.add("selected");
    var type = evt.currentTarget.getAttribute("data-type");
    var id = evt.currentTarget.getAttribute("data-id");
    var namespace = evt.currentTarget.getAttribute("data-namespace");
    var name = evt.currentTarget.getAttribute("data-name");
    var resTypeName = evt.currentTarget.getAttribute("data-restype-name");
    var resType = _resTypeMap[resTypeName];
    var resource = null;
    console.warn("0");
    console.warn("typeof id: ", typeof id);
    
	var fullName = (namespace ? namespace + "__" : "") + name;
    
    resource = resType.resourceMap[fullName];
    
    console.warn("name: ", name);
    console.warn("type: ", type);
    console.warn("id: ", id);
    console.warn("resTypeName: ", resTypeName);
    console.warn("resType: ", resType);
    console.warn("resType.resourceMap: ", resType.resourceMap);
    console.warn("resType.resourceMap[" + name + "]: ", resType.resourceMap[name]);
    console.warn("resource: ", resource);
    
    var url = null;
    
    if (type === "sobject" && resource.urls) {
        url = resource.urls.describe
    } else if (resource.url) {
        url = resource.url
    } else {
        // Handle missing URL
    }
    
    console.warn("url: ", url);
    
    var config = {
        url: url,
        method: "GET",
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        }               
    };
    
    var t1 = Date.now();
    showSpinner();
    sendRequest(config, function(response) {
        hideSpinner();
        console.warn("full resource: ", response);
        
        resource = response;
        
        showActions(type, resType, resource);
	    var t2 = Date.now();
        
        showAttributes(resType, resource);
	    var t3 = Date.now();
        
        showJSON(resource);
	    var t4 = Date.now();
        
        showSharing(type, resType, resource);
	    var t5 = Date.now();
        
        getImages(resource, function(imageData) {
		    var t6 = Date.now();
            console.warn("t2: ", t2 - t1)
            console.warn("t3: ", t3 - t2)
            console.warn("t4: ", t4 - t3)
            console.warn("t5: ", t5 - t4)
            console.warn("t6: ", t6 - t5)
            console.warn("total: ", t6 - t1)
            console.warn("getImages returned: ", imageData);
            var preview = document.querySelector("#preview");
            var label = null;
            var img = null;
            preview.innerHTML = null;
            
            if (imageData instanceof Array && imageData.length > 0)  {
                var img = null;
                for (var i = 0; i < imageData.length; i++) {
                    label = document.createElement("span");
                    label.classList.add("preview-message");
                    label.innerHTML = "Label: " + imageData[i].label;
                    preview.appendChild(label);

                    label = document.createElement("span");
                    label.classList.add("preview-message");
                    label.innerHTML = "Name: " + imageData[i].name;
                    preview.appendChild(label);

                    label = document.createElement("span");
                    label.classList.add("preview-message");
                    label.innerHTML = "URL: " + imageData[i].url;
                    preview.appendChild(label);
                    
                    img = document.createElement("img");
                    img.classList.add("preview-image");
                    img.src = imageData[i].src;
                    preview.appendChild(img);                  
                }
            } else {
                label = document.createElement("span");
                label.classList.add("preview-message");
                label.innerHTML = "N/A";
                preview.appendChild(label);
            }
        });
        
        // Handle specific types            
        if (type === "template") {
            var config = {
                url: resource.configurationUrl,
                method: "GET",
                headers: {
                    "Content-Type": "application/json;charset=UTF-8"
                }               
            };
            
            showSpinner();
            sendRequest(config, function(response) {
                hideSpinner();
                console.warn("template config: ", response);
            });        
        } else if (type === "dashboard") {
            
        } else if (type === "dataset") {
            var config = {
                url: resource.currentVersionUrl,
                method: "GET",
                headers: {
                    "Content-Type": "application/json;charset=UTF-8"
                }               
            };
            
            showSpinner();
            sendRequest(config, function(response) {
                hideSpinner();
                console.warn("dataset current version: ", response);
            });        
            
        } else if (type === "app") {
            
            // Search each type for folder?
        }
        
        var t7 = Date.now();
        console.warn("selectItem time: ", t7 - t0);
        
    });        
    
}

function showResources(type, resources) {
    
    console.warn("showResources: ", type, resources);
    
    // Clear the preview
    var preview = document.querySelector("#preview");
    preview.innerHTML = "";
    
    var resType = _resTypeMap[type];
    
    console.warn("resType: ", resType);

    var list = document.querySelector("ul#resource-list");
    list.innerHTML = "";
    
    var resource = null;
    var item = null;
    var figure = null;
    var icon = null;
    var container = null;
    var svg = null;
    var useEl = null;
    var url = null;
    var name = null;
    var namespace = null;
    var svgns = "http://www.w3.org/2000/svg";
    var xlinkns = "http://www.w3.org/1999/xlink";
    var body = null;
    var title = null;
    var span = null;
    var subtitle = null;
    var label = null;
    var desc = null;
    
    resType.resourceMap = {};
    
    
    for (var i = 0; i < resources.length; i++) {
        resource = resources[i];
        //console.warn("resource: ", resource);
        
        name = resource.namespace ? resource.namespace + "__" : "";
        name += resource.name;

        resType.resourceMap[name] = resource;                    
		/*        
        if (resource.id) {
	        resType.resourceMap[resource.id] = resource;        
        } else {
	        resType.resourceMap[resource.name] = resource;                    
        }
		*/
        
        item = document.createElement("li");
        item.classList.add("slds-media", "slds-media--responsive", "item-clickable");
        if (resType.type !== "sobjects") {
	        //item.classList.add("slds-m-around--small");
        }
        item.setAttribute("data-type", type);
        item.setAttribute("data-restype-name", resType.name);
        item.setAttribute("data-id", resource.id || "");                
        item.setAttribute("data-name", resource.name || "");
        item.setAttribute("data-namespace", resource.namespace || "");
        item.onclick = selectItem;
        
        
        if (resType.type === "sobjects") {
            name = getIconName(resource.name);
            figure = document.createElement("div");
            figure.classList.add("slds-image", "slds-image--card"); //"slds-media__-figure");
           	container = document.createElement("span");
            container.classList.add("slds-icon_container", "slds-icon-standard-" + name.replace(/_/g, "-"));
            figure.appendChild(container);
            svg = document.createElementNS(svgns, "svg");
            svg.classList.add("slds-icon", "slds-icon--large");
            svg.setAttributeNS(null, "aria-hidden", true);
            useEl = document.createElementNS(svgns, "use");
            url = _svgUrl.replace("%%TYPE%%", "standard");
            url = url.replace("%%NAME%%", name);
            useEl.setAttributeNS(xlinkns, "href", url);
            svg.appendChild(useEl);
            container.appendChild(svg);
            
        } else {
            figure = document.createElement("div");
            figure.classList.add("slds-image", "slds-image--card"); //"slds-media__-figure");
            icon = document.createElement("img");
            icon.classList.add("icon--small");
            if (resType.type === "templates") {
                if (resource.icons && resource.icons.templateBadge) {
                    icon.setAttribute("src", resource.icons.templateBadge.url);                
                } else {
                    icon.setAttribute("src", resType.iconsUrl + resource.templateIcon || resource.assetIcon);
                }
            } else if (resType.type === "folders") {
                icon.setAttribute("src", resource.icon.url);
            } else {
                icon.setAttribute("src", resType.thumbnailUrl);
            }
            figure.appendChild(icon);
        }
        
        item.appendChild(figure);
                
        body = document.createElement("div");
        body.classList.add("slds-media__body");
        /*
        if (resType.type !== "sobjects") {
            body.classList.add("slds-m-around--small");
        }
        */
        
        label = "&nbsp;("; //resource.label + "&nbsp;(";
        label += resource.namespace ? resource.namespace + "__" : "";
        label += resource.name + ")";
        
        title = document.createElement("div");
        title.classList.add("slds-text-align--left", "slds-text-heading--small", "resource-label");
        title.innerHTML = resource.label;
        span = document.createElement("span");
        span.classList.add("slds-text-color--weak", "resource-ns-name");
        span.innerHTML = label;
        title.appendChild(span);
        body.appendChild(title);
        
        if (resource.createdBy && resource.createdBy.name) {
            subtitle = document.createElement("div");
            subtitle.classList.add("slds-text-align--left", "slds-text-title");
            subtitle.innerHTML = resource.createdBy.name;
            body.appendChild(subtitle);            
        }

        desc = document.createElement("div");
        desc.classList.add("slds-text-align--left", "slds-p-top--small", "resource-description");
        desc.innerHTML = resource.description || "&nbsp;";                
        body.appendChild(desc);
        
        item.appendChild(body);


        // Sharing icon
        container = document.createElement("span");
        container.classList.add("slds-icon_container", "slds-icon-standard-socialshare", "icon-sharing", "slds-hide");
        svg = document.createElementNS(svgns, "svg");
        svg.classList.add("slds-icon", "slds-icon--x-small", "slds-icon-text-default");
        svg.setAttributeNS(null, "aria-hidden", true);
        useEl = document.createElementNS(svgns, "use");
        url = _svgUrl.replace("%%TYPE%%", "utility");
        url = url.replace("%%NAME%%", "socialshare");
        useEl.setAttributeNS(xlinkns, "href", url);
        svg.appendChild(useEl);        
        container.appendChild(svg);
        item.appendChild(container);
        
        
        list.appendChild(item);
        
        /*
                <div class="slds-media slds-media--responsive">
                    <div class="slds-media__-figure">
                        <img src="/assets/images/avatar2.jpg" class="slds-avatar--large" alt="Placeholder" />
                    </div>
                    <div class="slds-media__body">
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat minus molestias reprehenderit consequuntur sapiente. Modi veritatis totam accusantium numquam assumenda.</p>
                    </div>
                </div>
                */
    }
}

function getImages(item, handler) {
    var t0 = Date.now();
    var imageData = [];
    if (item.files && item.files.length > 0) {
        var count = 0;
        for (var j = 0; j < item.files.length; j++) {
            (function(file) {
                if (file.fileName === "assetPreviewThumb" && file.contentType === "image/png") {
                    var self = this;
                    var xhr = new XMLHttpRequest();
                    //var xhr = createRequest();
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4) {
                            if (xhr.status > 199 && xhr.status < 300) {
                                //console.warn('xhr.response: ', xhr.response);
                                var blob = new Blob([xhr.response], {type: 'image/png'});
                                var reader = new FileReader();
                                reader.id = item.id;
                                reader.onload = function(e) {
                                    var returnedURL = e.target.result;
                                    //console.warn('returnedURL: ', returnedURL);
                                    var returnedBase64 = returnedURL.replace(/^[^,]+,/, '');
                                    imageData.push({label: file.fileName, name: file.fileName, url: file.url, src: "data:image/png;base64," + returnedBase64});
                                    count++;
                                    if (count >= item.files.length && handler instanceof Function) {
                                        var t1 = Date.now();
                                        console.warn("getImages time: ", t1 - t0);
                                        handler(imageData);
                                    }
                                };
                                reader.readAsDataURL(blob); //Convert the blob from clipboard to base64
                                
                                
                            } else {
                                console.error(xhr.responseText);
                            }
                        }
                    };
                    
                    xhr.open('GET', file.url, true);
                    xhr.responseType = 'arraybuffer';
                    xhr.setRequestHeader("Authorization", "Bearer " + getSID());
                    xhr.send(undefined);
                }
            })(item.files[j]);         
            
        }
    } else if (item.icons) {
        console.warn("item has icons");
        for (var key in item.icons) {
            console.warn("key: ", key, ", value: ", item.icons[key]);
            if (item.icons[key]) {
    	        imageData.push({label: key, name: item.icons[key].name, url: item.icons[key].url, src: item.icons[key].url});	                
            }
        }
        handler(imageData);
    } else if (item.icon) {
        console.warn("item has icon");
        imageData.push({label: "icon", name: item.icon.name, url: item.icon.url, src: item.icon.url});
        handler(imageData);
    } else {
        if (handler instanceof Function) {
            handler(null);
        }
    }
}

/* Utilities for icons, etc. */


var _iconNames = [
	"account", "address", "announcement", "answer_best", "answer_private", "answer_public", "approval", "apps_admin", "apps", "article", "asset_relationship", "assigned_resource", "avatar_loading", "avatar", "business_hours", "calibration", "call_history", "call", "campaign_members", "campaign", "canvas", "carousel", "case_change_status", "case_comment", "case_email", "case_log_a_call", "case_milestone", "case_transcript", "case", "client", "cms", "coaching", "connected_apps", "contact_list", "contact", "contract_line_item", "contract", "custom_notification", "custom", "dashboard", "datadotcom", "default", "document", "drafts", "email_chatter", "email", "empty", "endorsement", "entitlement_process", "entitlement_template", "entitlement", "entity_milestone", "environment_hub", "event", "feed", "feedback", "file", "flow", "folder", "forecasts", "generic_loading", "goals", "group_loading", "groups", "hierarchy", "home", "household", "insights", "investment_account", "lead_insights", "lead_list", "lead", "link", "list_email", "live_chat", "location", "log_a_call", "macros", "maintenance_asset", "maintenance_plan", "marketing_actions", "merge", "metrics", "news", "note", "omni_supervisor", "operating_hours", "opportunity_splits", "opportunity", "orders", "people", "performance", "person_account", "photo", "poll", "portal", "post", "pricebook", "process", "product_consumed", "product_item_transaction", "product_item", "product_request_line_item", "product_request", "product_required", "product_transfer", "product", "question_best", "question_feed", "quick_text", "quip_sheet", "quip", "quotes", "recent", "record", "related_list", "relationship", "report", "resource_absence", "resource_capacity", "resource_preference", "resource_skill", "reward", "rtc_presence", "sales_path", "scan_card", "service_appointment", "service_contract", "service_crew_member", "service_crew", "service_report", "service_resource", "service_territory_location", "service_territory_member", "service_territory", "shipment", "skill_entity", "skill_requirement", "skill", "social", "solution", "sossession", "task", "task2", "team_member", "template", "thanks_loading", "thanks", "timesheet_entry", "timesheet", "timeslot", "today", "topic", "topic2", "unmatched", "user", "work_order_item", "work_order", "work_type"   
];

var _iconNameMap = {};
_iconNames.forEach(function(n) { _iconNameMap[n] = n; })

function toUnderscore(s) { return s.replace(/\.?([A-Z])/g, function (x,y){return "_" + y.toLowerCase()}).replace(/^_/, ""); }

function getIconName(name) {
    var s = toUnderscore(name);
    var i = _iconNameMap[s];
    return i || "default";
}
