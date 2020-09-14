/*
 * Analytics Template Utils
 * 
 * JavaScript functions to support the atutils VF page
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

var _selectedResType = "app";

var _resTypeMap = {
    app: {
        name: "app",
        partialUrl: "/wave/folders",
        label: "Apps",
        type: "folders",
        iconsUrl: "/analytics/wave/web/proto/images/app/icons/",
        thumbnailUrl: "/analytics/wave/web/proto/images/thumbs/thumb-folder.png",
        resourceMap: null,
        actions: {
            refresh: {
                label: "Create Template",
                icon: {
                    type: "utility",
                    name: "insert_template"
                },
                action: createTemplate
            }
        }
    },
    dashboard: {
        name: "dashboard",
        partialUrl: "/wave/dashboards",
        label: "Dashboards",
        type: "dashboards",
        thumbnailUrl: "/analytics/wave/web/proto/images/thumbs/thumb-dashboard.png",
        resourceMap: null
    },
    lens: {
        name: "lens",
        partialUrl: "/wave/lenses",
        label: "Lenses",
        type: "lenses",
        thumbnailUrl: "/analytics/wave/web/proto/images/thumbs/thumb-chart-stackhbar.png",
        resourceMap: null
    },
    dataset: {
        name: "dataset",
        partialUrl: "/wave/datasets",
        label: "Datasets",
        type: "datasets",
        thumbnailUrl: "/analytics/wave/web/proto/images/thumbs/thumb-edgemart.png",
        resourceMap: null
    },
    /*
    dataflow: {
        name: "dataflow",
        partialUrl: "/wave/dataflows",
        label: "Dataflows",
        type: "dataflows",
        thumbnailUrl: "/analytics/wave/web/proto/images/thumbs/thumb-edgemart.png",
        resourceMap: null
    },
    */
    appTemplate: {
        name: "appTemplate",
        partialUrl: "/wave/templates?type=app",
        label: "App Templates",
        type: "templates",
        iconsUrl: "/analytics/wave/web/proto/images/template/icons/",
        default: true,
        resourceMap: null,
        actions: {
            "refresh": {
                label: "Update Template",
                icon: {
                    type: "standard",
                    name: "merge"
                },
                action: updateTemplate
            },
            "delete": {
                label: "Delete Template",
                icon: {
                    type: "action",
                    name: "delete"
                },
                action: deleteTemplate
            }

        }
    },
    dashboardTemplate: {
        name: "dashboardTemplate",
        partialUrl: "/wave/templates?type=dashboard",
        label: "Dashboard Templates",
        type: "templates",
        iconsUrl: "/analytics/wave/web/proto/images/template/icons/",
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
        //console.warn("resType: ", resType);
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
            
            document.querySelector("#action-buttons").innerHTML = "";                    
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
    //console.warn("refreshResource: ", evt, evt.currentTarget);
    var type = evt.currentTarget.getAttribute("data-type");
    var id = evt.currentTarget.getAttribute("data-id");
    var resTypeName = evt.currentTarget.getAttribute("data-restype-name");
    var resType = _resTypeMap[resTypeName];
    var resource = resType.resourceMap[id];
    
    //console.warn("resource: ", resource);
    
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

function updateTemplate(evt) {
    console.warn("updateTemplate: ", evt, evt.currentTarget);

    var type = evt.currentTarget.getAttribute("data-type");
    var id = evt.currentTarget.getAttribute("data-id");
    var resTypeName = evt.currentTarget.getAttribute("data-restype-name");
    var resType = _resTypeMap[resTypeName];
    var resource = resType.resourceMap[id];
    //console.warn("resource: ", resource);

    // Commented out as dataflow API isn't public
    //showTemplateUpdateModal(function(dataflowId) {
        //console.warn("modal returned: ", dataflowId);

        var body = {
                folderSource: {id: resource.folderSource.id}
        };
        
    	/*
        if (dataflowId) {
            body.dataflow = {id: dataflowId}
        };
        */
    
        var config = {
            url: resource.url,
            method: "PUT",
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            body: JSON.stringify(body)    
        };
        console.warn("config: ", config);
        
        showSpinner();
        sendRequest(config, function(response) {
            hideSpinner();
            console.warn("response: ", response);
            if (response.status && (response.status < 200 || response.status > 299)) {
                if (response.response) {
                    showToast("error", "Error: " + response.response[0].errorCode, response.response[0].message);
                }
            } else {
                showToast("success", response.label + " Template Updated", response.name + " (" + response.id + ")");
            }                
            showAttributes(resType, response);
        });         

    //});
    
}

function deleteTemplate(evt) {
    //console.warn("deleteTemplate: ", evt, evt.currentTarget);
    var type = evt.currentTarget.getAttribute("data-type");
    var id = evt.currentTarget.getAttribute("data-id");
    var resTypeName = evt.currentTarget.getAttribute("data-restype-name");
    var resType = _resTypeMap[resTypeName];
    var resource = resType.resourceMap[id];
    
    //console.warn("resource: ", resource);
    
    // First delete the app
    var config = {
        url: resource.folderSource.url,
        method: "DELETE",
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        }   
    };
    console.warn("config: ", config);
    
    showSpinner();
    sendRequest(config, function(response) {
        hideSpinner();
        console.warn("response: ", response);
        if (response.status && (response.status < 200 || response.status > 299)) {
            if (response.response) {
                showToast("error", "Error: " + response.response[0].errorCode, response.response[0].message);
            }
        } else {
            
            // Then delete the app template
            var config = {
                url: resource.url,
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json;charset=UTF-8"
                }   
            };
            console.warn("config: ", config);
            
            showSpinner();
            sendRequest(config, function(response) {
                hideSpinner();
                console.warn("response: ", response);
                if (response.status && (response.status < 200 || response.status > 299)) {
                    if (response.response) {
                        showToast("error", "Error: " + response.response[0].errorCode, response.response[0].message);
                    }
                }
                //showAttributes(resType, response);
                refreshResources();
            });                    
        }                
        
    });         
    
}

function createTemplate(evt) {
    //console.warn("createTemplate: ", evt, evt.currentTarget);
    var type = evt.currentTarget.getAttribute("data-type");
    var id = evt.currentTarget.getAttribute("data-id");
    var resTypeName = evt.currentTarget.getAttribute("data-restype-name");
    var resType = _resTypeMap[resTypeName];
    var resource = resType.resourceMap[id];
    
    //console.warn("resource: ", resource);            
    
    var body = {
        folderSource: {id: resource.id}
    };
    var config = {
        url: _baseUrl + _resTypeMap["appTemplate"].partialUrl,
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify(body)    
    };
    console.warn("config: ", config);
    
    showSpinner();
    sendRequest(config, function(response) {
        hideSpinner();
        console.warn("response: ", response);
        if (response.status && response.response) {
            var res = response.response[0];
            showToast("error", "Error creating template: " + res.errorCode, res.message);
        } else {
        	showToast("success", "Created template for " + response.label);
        	showAttributes(resType, "Created template for " + response.label);        	
        }
    });         
    
}

function refreshResources() {
    var resType = _resTypeMap[_selectedResType];
    //console.warn("resType: ", resType);
    
    showSpinner();
    listResources(_selectedResType, function(response) {
        hideSpinner();
        if (response.status && (response.status < 200 || response.status > 299)) {
            showToast("error", "Error: You do not have access to the " + resType.label + " API.");
        } else {        
            console.warn("listResources response: ", response);
            showResources(resType.name, resType.type ? response[resType.type] : response);
        }
    });        
}

function listResources(type, callback) {
    var resType = _resTypeMap[type];
    //console.warn("resType: ", resType);
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
}

function handleChangeAttribute(evt) {
    console.warn("handleChangeAttribute: ", evt, evt.currentTarget);
    var value = evt.currentTarget.value;
    var key = evt.currentTarget.getAttribute("data-key");
    var id = evt.currentTarget.getAttribute("data-id");
    var resTypeName = evt.currentTarget.getAttribute("data-restype-name");
    var resType = _resTypeMap[resTypeName];
    var resource = resType.resourceMap[id];
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
        el.setAttribute("data-id", resource.id);
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
            button.setAttribute("data-id", resource.id);
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
                var resTypeName = evt.currentTarget.getAttribute("data-restype-name");
                var resType = _resTypeMap[resTypeName];
                var resource = resType.resourceMap[id];                
                //console.warn("resource: ", resource);
                //console.warn("key: ", key);
                //console.warn("value: ", value);
                
                var templateDef = createTemplateDef(resource, key, value);
                //console.warn("templateDef: ", templateDef);
                
                var templateJson = JSON.stringify(templateDef, null, 2);
                //console.warn("templateJson: ", templateJson);
                
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

function showTemplateUpdateModal(callback) {
    
    listResources("dataflow", function(response) {
        var dataflows = response.dataflows;
        var select = document.querySelector("select#dataflow_select");
        select.innerHTML = "";
        var dataflow = null;
        var option = null;
        var label = null;
        option = document.createElement("option");
        option.innerHTML = "None";
        //option.setAttribute("disabled", "disasbled");
        option.setAttribute("selected", "selected");
        select.appendChild(option);
        for (var i = 0; i < dataflows.length; i++) {
            dataflow = dataflows[i];
            option = document.createElement("option");
            option.setAttribute("data-id", dataflow.id);
            label = dataflow.label + " (";
            label += dataflow.namespace ? dataflow.namespace + "__" : "";
            label += dataflow.name + ")";
            option.innerHTML = label;
            select.appendChild(option);
        }
        select.onchange = function(evt) {
            var value = evt.currentTarget.value;
            var option = evt.currentTarget.options[evt.currentTarget.selectedIndex];
            console.warn("option: ", option);
            var id = option.getAttribute("data-id");
            console.warn("id: ", id);
        }

        var locator = "#template_update_modal";
        var backdrop = document.querySelector("#backdrop");
        var modal = document.querySelector(locator);
        modal.classList.remove("modal-hidden");
        backdrop.classList.remove("backdrop-hidden");
        document.querySelector(locator + " [name=updateButton]").onclick = function(evt) {
            var select = document.querySelector(locator + " select#dataflow_select");
            var option = select.options[select.selectedIndex];
            console.warn("option: ", option);
            var id = option.getAttribute("data-id");
            console.warn("Update using dataflow: ", id);
            if (typeof callback === "function") {
                callback(id);
            }
            hideModal(locator);
        }
        document.querySelector(locator + " [name=cancelButton]").onclick = function(evt) {
            hideModal(locator);
        }

    });
    
       
}


function createTemplateDef(resource, key, value, values) {
    
    showModal(resource, key, value, values);
    
    var name = resource.name + "_" + key;
    console.warn("name: ", name);
    name = name.replace(/[\s\.]/g, "_");
    console.warn("name: ", name);
    
    var variable = "${Variables." + name + "}";
    
    var variableType = determineType(value);
    
    var variableDef = {};
    variableDef[name] = {
        label: "TBD",
        description: "TBD",
        defaultValue: value || null,
        variableType: {
            type: variableType
        }  
    };
    
    if (values) {
        variableDef[variable].variableType.enums = [];
        for (var i = 0; i < values.length; i++) {
            variableDef[variable].variableType.enums.push(values[i]);
        }
    }
    
    var ruleDef = {
        name: name,
        appliesTo: [
            {
                type: resource.type,
                name: resource.name + "_tp" // Is appending _tp always the case?
            }
        ],
        actions: [
            {
                action: "set",
                description: "Set the value for " + key + " in " + resource.name + ".",
                path: "$." + key,
                value: variable
            }
        ]
    };
    
    var pageDef = {
        title: "TBD",
        variables: [
            {
                name: name
            }
        ]
    };
    
    document.querySelector("#variableDef").value = JSON.stringify(variableDef, null, 2);
    document.querySelector("#ruleDef").value = JSON.stringify(ruleDef, null, 2);
    document.querySelector("#pageDef").value = JSON.stringify(pageDef, null, 2);
    
    var templateDef = {
        variableDef: variableDef,
        ruleDef: ruleDef,
        pageDef: pageDef
    };
    
    return templateDef;
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

// Older, dumber version REMOVE
function _searchAttributes(input) {
    var value = input.value;
    //console.warn("search value: ", value);
    if (value && value.length >= 2) {
    	var key = value;
    	var searchKey = value.toLowerCase();
	    var matches = document.querySelectorAll("#attributes .slds-form-element[data-search-key*='" + searchKey + "']");
	    //console.warn("matches: ", matches);
	    var map = {};
	    matches.forEach(function(item) {
	    	map[item.getAttribute("data-search-key")] = item; }
	    );
	    //console.warn("map: ", map);
	    var items = document.querySelectorAll("#attributes .slds-form-element[data-search-key]");
	    var count = 0;
	    items.forEach(function(item) {
	    	if (map[item.getAttribute("data-search-key")]) {
	    		item.closest("div.slds-form-element[data-search-key]").classList.remove("hidden");
	    		count++;
	    	} else {
	    		item.closest("div.slds-form-element[data-search-key]").classList.add("hidden");
	    	}
	    });
        document.querySelector("#match-count").innerHTML = count;
        document.querySelector("#match-count-label").classList.remove('hidden');
    } else {
        var items = document.querySelectorAll("#attributes .slds-form-element[data-search-key]");
        items.forEach(function(item) {
    		item.closest("div.slds-form-element[data-search-key]").classList.remove("hidden");
        });
        document.querySelector("#match-count-label").classList.add('hidden');
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
    button.setAttribute("data-id", resource.id);
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

function selectItem(evt) {
    //console.warn("selectItem: ", evt, evt.currentTarget);
    document.querySelectorAll(".item-clickable.selected").forEach(function(e) {
        e.classList.remove("selected");
    });
    evt.currentTarget.classList.add("selected");
    var type = evt.currentTarget.getAttribute("data-type");
    var id = evt.currentTarget.getAttribute("data-id");
    var resTypeName = evt.currentTarget.getAttribute("data-restype-name");
    var resType = _resTypeMap[resTypeName];
    var resource = resType.resourceMap[id];
    //console.warn("type: ", type, ", id: ", id, ", resType: ", resType);
    //console.warn("resource: ", resource);
    
    
    var config = {
        url: resource.url,
        method: "GET",
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        }               
    };
    
    showSpinner();
    sendRequest(config, function(response) {
        hideSpinner();
        //console.warn("full resource: ", response);
        
        resource = response;
        
        showActions(type, resType, resource);
        
        showAttributes(resType, resource);
        
        showJSON(resource);
        
        getImages(resource, function(imageData) {
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
        
    });        
    
}

function showResources(type, resources) {
    
    console.warn("showResources: ", type, resources);
    
    // Clear the preview
    var preview = document.querySelector("#preview");
    preview.innerHTML = "";
    
    var resType = _resTypeMap[type];
    
    //console.warn("resType: ", resType);

    var list = document.querySelector("ul#resource-list");
    list.innerHTML = "";
    
    var resource = null;
    var item = null;
    var figure = null;
    var icon = null;
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
        
        resType.resourceMap[resource.id] = resource;
        
        item = document.createElement("li");
        item.classList.add("slds-media", "slds-media--responsive", "slds-m-around--small", "item-clickable");
        item.setAttribute("data-type", type);
        item.setAttribute("data-restype-name", resType.name);
        item.setAttribute("data-id", resource.id);                
        item.onclick = selectItem;
        
        figure = document.createElement("div");
        figure.classList.add("slds-image", "slds-image--card"); //"slds-media__-figure");
        
        icon = document.createElement("img");
        icon.classList.add("icon--medium");
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
        item.appendChild(figure);
        
        body = document.createElement("div");
        body.classList.add("slds-media__body", "slds-m-around--small");
        
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
