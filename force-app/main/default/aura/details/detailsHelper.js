({
    index: 0,
    
    getRecords: function(component) {
        //console.warn("detailsHelper.getRecords");
        
        var lastQuery = component.get("v.query");
        
		var query = "";
        
        var recordType = component.get("v.recordType");
        
        var fields = component.get("v.fields");
        if (fields && fields.length > 0) {
            fields = fields.split(',');
        }
        
        var limit = component.get("v.limit");
        //console.warn("limit: ", limit);
        
        var where = component.get("v.where");
        //console.warn("where: ", where);
        
        var recordId = component.get("v.recordId");
        //console.warn("recordId: ", recordId);

        var record = component.get("v.record");
        //console.warn("record: ", record);
        
        if (typeof record === "undefined" || record === null) {
            //return;
        }
        
        if (typeof fields !== "undefined" && fields.length > 0) {
            var sep = "";
            query = "SELECT ";
            for (var i = 0; i < fields.length; i++) {
                query += sep + fields[i].trim();
                sep = ", ";
            }
            query += " FROM " + recordType;

            //console.warn("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% query: ", query);
            
            if (typeof where !== "undefined") {
            	query += " " + where;
                if (typeof record !== "undefined" && record !== null) {
                    query += " AND " + record.apiName + ".Id = '" + record.id + "'";
                }
            } else {
                if (typeof record !== "undefined" && record !== null) {
                    query += " WHERE " + record.apiName + ".Id = '" + record.id + "'";
                }
            }

            if (typeof limit !== "undefined" && limit > 0) {
                query += " LIMIT " + limit;
            }
        } else {
            //query = component.get("v.query"); //SELECT Id, Name, StageName FROM Opportunity";
        }
        
        //console.warn("lastQuery: ", lastQuery);
        //console.warn("query: ", query);
        
        if (query === lastQuery) {
            return;        
        } else {
            component.set("v.query", query);
        }
        
        
        console.warn("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ query: ", query);

        var self = this;
        
        var action = component.get("c.getRecords");
        action.setParams({query: query});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var records = response.getReturnValue();
                self.createTable(component, records);
            }
            else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.error("Error message: " + errors[0].message);
                    }
                } else {
                    console.error("Unknown error");
                }
            }            
        });
        $A.enqueueAction(action);
    },
    
    createCheckbox: function(component, recordId, val, field, callback) {
        var self = this;
        var span = document.createElement("span");
        span.classList.add("slds-checkbox");
        
        var checkbox = document.createElement("input");
        var uid = "checkbox-" + self.index; //Date.now();
        self.index++;
        checkbox.setAttribute("data-record-id", recordId);        
        checkbox.setAttribute("data-field", field);        
        checkbox.setAttribute("data-value", val);        
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("name", "filter");
        checkbox.setAttribute("id", uid);
        checkbox.checked =  false;
        checkbox.onclick = function(evt) {
        };//callback;
        
        var checkboxes = component.get("v.checkboxes");
        checkboxes.push(checkbox);
                
        span.appendChild(checkbox);
        
        var label = document.createElement("label");
        label.classList.add("slds-checkbox__label");
        label.setAttribute("for", uid);
        
        var lspan = document.createElement("span");
        lspan.classList.add("slds-checkbox--faux");
        label.appendChild(lspan);
        
        lspan = document.createElement("span");
        lspan.classList.add("slds-form-element__label");
        lspan.classList.add("slds-assistive-textx");
        label.appendChild(lspan);
        
        span.appendChild(label);
        
        return span;        
    },
    
    
    createCell: function(component, recordId, label, val, field, type, callback) {
        var self = this;
        
        field = field.trim();
        
        var cell = document.createElement(type);
        cell.setAttribute("role", "gridcell");        
        
        var div = document.createElement("div");
        div.classList.add("slds-truncate");
        if (type === 'th') {
            //div.classList.add("slds-cell-fixed");
        }
        
        var checkbox = self.createCheckbox(component, recordId, val, field, callback);
        div.appendChild(checkbox);
        
        var span = document.createElement("span");
        span.classList.add("slds-p-around--small");
        span.innerHTML = '' + label;
        
        div.appendChild(span);
        
        div.setAttribute("data-field", field);
        
        if (typeof callback === "function") {
            checkbox.onclick = callback;
        }
        
        cell.appendChild(div);
        return cell;
    },
    
    createTable: function(component, records) {
        var self = this;
        var cell = null;
        
        var fields = component.get("v.fields");
        if (fields && fields.length > 0) {
            fields = fields.split(',');            
        } else {
            fields = [];
        }
        
        var labels = component.get("v.labels");
        if (labels && labels.length > 0) {
            labels = labels.split(',');
        } else {
            labels = [];
        }  
        
        var thead = component.find("thead").getElement();
        thead.innerHTML = '';
        
        var checkboxAttr = []; 
        component.set("v.checkboxes", checkboxAttr);
        
        var record = records[0];
        var row = document.createElement("tr");
        row.classList.add('slds-text-title--caps');
        cell = self.createCell(component, "", 'All', 'all', 'all', "th", function(evt) {
            evt.stopPropagation();
            if (evt.target.type === 'checkbox') {
                var checked = evt.target.checked;
                
                var field = evt.target.getAttribute("data-field");
                var value = evt.target.getAttribute("data-value");
                
                var checkboxes = component.get("v.checkboxes");
                checkboxes.forEach(function(cb) {
                    cb.checked = checked;
                });
                
                self.createFilter(component, "all", true);                
            }
            
        });
        row.appendChild(cell);
        for (var i = 0; i < labels.length; i++) {
            cell = self.createCell(component, "", labels[i], labels[i], fields[i], "th", function(evt) {
                evt.stopPropagation();
                if (evt.target.type === 'checkbox') {
					var checked = evt.target.checked;
                    var field = evt.target.getAttribute("data-field");
                    var value = evt.target.getAttribute("data-value");
                    
                    var checkboxes = component.get("v.checkboxes"); //document.querySelectorAll("input[data-field='" + field + "']");
                    checkboxes.forEach(function(cb) {
                        if (cb.getAttribute("data-field") === field) {
                            cb.checked = checked;
                        }                                                
                    });
                    
                    self.createFilter(component, field, true);
                }
                
            });    
            row.appendChild(cell);            
        }
        
        thead.appendChild(row);
        
        var tbody = component.find("tbody").getElement();
        tbody.innerHTML = '';
        
        for (var i = 0; i < records.length; i++) {
            record = records[i];
            row = document.createElement("tr");
            cell = self.createCell(component, record["Id"], i, record["Id"], "Id", "td", function(evt) {
                evt.stopPropagation();
                if (evt.target.type === 'checkbox') {
                    var checked = evt.target.checked;
                    var recordId = evt.target.getAttribute("data-record-id");
                    var field = evt.target.getAttribute("data-field");
                    var value = evt.target.getAttribute("data-value");

                    var checkboxes = component.get("v.checkboxes");
                    //var checkboxes = document.querySelectorAll("input[data-record-id='" + recordId + "']");
                    checkboxes.forEach(function(cb) {
                        if (cb.getAttribute("data-record-id") === recordId) {
                            cb.checked = checked;
                        }
                    });
                    
                    self.createFilter(component, field);
                }
            });
            
            row.appendChild(cell);
            var field = null;
            var value = null;
            var obj = null;
            for (var j = 0; j < fields.length; j++) {            
                field = fields[j].trim();
                value = record[field];
                if (field.indexOf(".") >= 0) {
                    var tokens = field.split(".");
                    obj = record[tokens[0]];
                    if (typeof obj === "object") {
                        value = obj[tokens[1]];
                    }
                }
                
                cell = self.createCell(component, record["Id"], value, value, field, "td", function(evt) {
                    evt.stopPropagation();
                    if (evt.target.type === 'checkbox') {
                        var field = evt.target.getAttribute("data-field");
                        var value = evt.target.getAttribute("data-value");
                        self.createFilter(component, field);
                    }
                });
                
                row.appendChild(cell);
            }
            tbody.appendChild(row);
        }        
    },

    createFilter: function(component, fields, resetFields) {
        var dashboardId = component.get('v.dashboardId');
        
        var ns = component.getType().split(":")[0];

        var datasetName = (ns !== "c" ? ns + "__" : "" ) + component.get('v.dataset');
        
        var checkboxes = component.get("v.checkboxes");

        var field = null;
        var value = null;
        
        
        var filter = {};
        filter.datasets = {};
        filter.datasets[datasetName] = [];
        
        
        /* - Reset case?
        var allFields = component.get("v.fields").split(",");
        for (var i = 0; i < allFields.length; i++) {
            filter[datasetName][allFields[i].trim()] = [];
        }
        */
        
       	fields = typeof fields === "string" ? [fields] : fields;

        var values = {};
        
        checkboxes.forEach(function(checkbox) {
            if (checkbox.checked === true) {
				field = checkbox.getAttribute("data-field");
				value = checkbox.getAttribute("data-value");
                value = isNaN(parseInt(value)) ? value : parseInt(value);
                
                values[field] = values[field] || [];                
                values[field].push(value);
            }
        });

        var f = null;
        
        var operator = "in";
        
        for (var i = 0; i < fields.length; i++) {
            field = fields[i].trim();
            f = {};
            f.fields = [];
            f.fields.push(field);
            f.filter = {
                operator: operator,
                values: values[field]
            };
            filter.datasets[datasetName].push(f);
        }
        
        console.warn("filter: ", filter);
        var json = JSON.stringify(filter);
        console.warn("json: ", json);
        
        var evt = $A.get('e.wave:update');
        evt.setParams({
            value: json,
            id: dashboardId,
            type: "dashboard"
        });
        evt.fire();

    }    
})