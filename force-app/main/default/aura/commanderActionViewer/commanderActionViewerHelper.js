({
    actionColumns: [
        {label: 'Action Name', fieldName: 'label', type: 'text', cellAttributes: {}, editable: false, sortable: false},
        {label: 'Type', fieldName: 'type', type: 'text', cellAttributes: {}, editable: false, sortable: false},
        {label: 'Intents', fieldName: 'intentCount', type: 'text', cellAttributes: {}, editable: false, sortable: false},
        {
            type: 'action', 
            typeAttributes: {
                rowActions: [
                    {label: 'Open', name: 'open'},
                    {label: 'Edit', name: 'edit'},
                    {label: 'Delete', name: 'delete'}
                ]
            }
        }        
    ],
        
    intentColumns: [
        {label: 'Phrase', fieldName: 'phrase', type: 'text', cellAttributes: {}, editable: true, sortable: false},
        {
            type: 'action',
            typeAttributes: {
                rowActions: [
                    {label: 'Test', name: 'test'},
                    {label: 'Delete', name: 'delete'}
                ]
            }
        }
    ],
    
    parameterColumns: [
        {label: 'Name', fieldName: 'name', type: 'text', cellAttributes: {}, editable: false, sortable: false},
        {label: 'Type', fieldName: 'type', type: 'text', cellAttributes: {}, editable: false, sortable: false},
        {label: 'Required', fieldName: 'required', type: 'boolean', cellAttributes: {}, editable: false, sortable: false},
        {label: 'Default Value', fieldName: 'defaultValue', type: 'text', cellAttributes: {}, editable: false, sortable: false},
        {
            type: 'action', 
            typeAttributes: {
                rowActions: [
                    {label: 'Edit', name: 'edit'},
                    {label: 'Delete', name: 'delete'}
                ]
            }
        }
    ],

    customApexActionColumns: [
        {label: 'Label', fieldName: 'label', type: 'text', cellAttributes: {}, editable: false, sortable: false},
        {label: 'Name', fieldName: 'name', type: 'text', cellAttributes: {}, editable: false, sortable: false},
        {label: 'Type', fieldName: 'type', type: 'text', cellAttributes: {}, editable: false, sortable: false},
        {label: 'Required', fieldName: 'required', type: 'boolean', cellAttributes: {}, editable: false, sortable: false},
        {label: 'Default Value', fieldName: 'defaultValue', type: 'text', cellAttributes: {}, editable: false, sortable: false},
        {
            type: 'action', 
            typeAttributes: {
                rowActions: [
                    {label: 'Edit', name: 'edit'},
                    {label: 'Delete', name: 'delete'}
                ]
            }
        }
    ],
    
    simpleValueTypeMap: {
        'StringType': 'string',
        'Integer': 'number',
        'Double': 'number',
        'SobjectType': 'object',
        'SobjectFieldType': 'field',
        'FilterOperatorType': 'operator',
        'DatasetType': 'dataset',
        'DatasetFieldType': 'dataset field',
        'NavigationDirectionType': 'direction'        
    },
    
    getSimpleValueType: function(type) {
        return this.simpleValueTypeMap[type] || 'string';    
    },
    

    refresh: function(component, callback) {
        let self = this;
        self.listActions(component, function(err, actions) {
            console.warn('actions: ', JSON.parse(JSON.stringify(actions)));
            component.set('v.actions', actions);
            component.set('v.action', null);
            component.set('v.actionDetails', null);
            if (typeof callback === 'function') {
                callback(null, actions);
            }
        });
        
    },

    // Updates an action without refreshing
    refreshAction: function(component, action, callback) {
        console.warn('refreshAction: ', action);
        let self = this;
        self.listActions(component, function(err, actions) {
            component.set('v.actions', actions);
            if (action) {
                actions.forEach(function(a) {
                    if (a.id === action.id) {
                        component.set('v.action', a);
                        self.getActionDetails(component, a, function(err, actionDetails) {
                            if (err) {
                                console.error('getActionDetails error: ', err);
                            } else {
                                component.set('v.actionDetails', actionDetails);
                            }
                        });                    
                    }
                });
            }
            
            //action = component.get('v.action');

            if (typeof callback === 'function') {
                callback(null, action);
            }
        });
    },
    
    listActions: function(component, callback) {
        var self = this;
        var commanderApi = component.find('commanderApi');
        
        commanderApi.describe(null, null, null, function(response) {
            if (callback !== null && typeof callback !== 'undefined') {
                response.actions.forEach(function(action) {
                    
                    // NOTE: Using a string as the right-justified numbers look awkward in the table
                    action.intentCount = '' + (action.intents ? action.intents.length : 0);
                });
                callback(null, response.actions);
            } else {
                return null;
            }            
        });
    },        
        
	handleActionSelect: function(component) {
        let self = this;
		let action = component.get('v.action');
        console.warn('handleActionSelect: ', action);
        if (action) {
            self.getActionDetails(component, action, function(err, actionDetails) {
                if (err) {
                    console.error('getActionDetails error: ', err);
                } else {
                    component.set('v.actionDetails', actionDetails);
                }
            });
        } else {
            component.set('v.actionDetails', null);
        }
	},
    
    handleActionRowAction: function(component, rowAction, action) {
        let self = this;
        console.warn('handleActionRowAction');
        
        component.set('v.action', action);
        
        if (rowAction.name === 'delete') {
            let answer = confirm('Are you sure you want to delete action ' + action.name + '?');
            if (answer === true) {
                self.deleteAction(component, action);
            }            
        } else if (rowAction.name === 'open') {
            self.getActionDetails(component, action, function(err, actionDetails) {
                self.getCustomApexActions(component, actionDetails, function(err, customApexActions) {
                	console.warn('getCustomApexActions returned: ', err, customApexActions);

		            component.set('v.actionDetails', actionDetails);
                    
                    component.set('v.customApexActions', customApexActions);
                });
            });
        } else if (rowAction.name === 'edit') {
            self.editAction(component);
        }
    },
           
    getActionDetails: function(component, action, callback) {
        let self = this;
        console.warn('getActionDetails: ', action);
        
        let proxy = component.find('proxy');
        
        let url = action.uri;
        
        let config = {
        };
        
        let body = JSON.stringify(config);
        console.warn('calling GET on url: ', url, ' with body: ', body);
        
        proxy.exec(url, 'GET', body, function(response) {
            console.warn('response: ', response);
            let actionDetails = response.body;
            
            // Add the intents info
            actionDetails.intents = action.intents;
            actionDetails.intentCount = action.intentCount;
                   
            self.getParameters(component, actionDetails, function(err, parameters) {
                console.warn('getParameters returned: ', err, parameters);
                if (err) {
                    console.error('getParameters error: ', err);
                } else {
                    component.set('v.parameters', parameters);
                }         
                
                if (typeof callback === 'function') {
                    callback(null, actionDetails);
                }
            });
        });
    },

    getCustomApexActions: function(component, actionDetails, callback) {
        let self = this;
        console.warn('getCustomApexActions: ', actionDetails);
        
        if (actionDetails.commandTarget) {
            let proxy = component.find('proxy');
            
            let version = '47.0';
            let url = '/services/data/v' + version + '/actions/custom/apex/' + actionDetails.commandTarget.name;
            
            let config = {
            };
            
            let body = JSON.stringify(config);
            
            proxy.exec(url, 'GET', body, function(response) {
                if (typeof callback === 'function') {
                    callback(null, response.body);
                }
            });
        } else {
                if (typeof callback === 'function') {
                    callback({error: 'NO_COMMAND_TARGET', msg: 'No command target'}, null);
                }            
        }
    },
    
    addAction: function(component) {
        console.warn('addAction');
        let self = this;

        let action = {
            label: '',
            name: '',
            type: '',
            description: '',
            commandTarget: {
                name: null
            }
        };
        let config = {
            action: action
        };
        
        var closeAction = component.getReference('v.closeAction');
                
        $A.createComponents([
            ["c:commanderActionEditor", config],
            ["c:commanderToolsModalFooter", {closeAction: closeAction}]
        ], function(components, status, err) {
            console.warn('components: ', components);
            console.warn('status: ', status);
            console.warn('err: ', err);
            if (status === "SUCCESS") {
                let modalBody = components[0];
                let modalFooter = components[1];
                modalBody.set('v.action', action);
                component.find('overlayLib').showCustomModal({
                    header: "New Action",
                    body: modalBody,
                    footer: modalFooter,
                    showCloseButton: true,
                    cssClass: "mymodal",
                    closeCallback: function() {
                        closeAction = component.get('v.closeAction');
                        if (closeAction === 'save') {
                            console.warn('action: ', action);
                            self.createAction(component, action);
                        } else {
                            // Do nothing
                        }
                    }
                })
            }                               
        });            
    },

    editAction: function(component) {
        console.warn('editAction');
        let self = this;

        let action = component.get('v.action');
        
        let config = {
            action: action
        };
        
        var closeAction = component.getReference('v.closeAction');
        
        $A.createComponents([
            ["c:commanderActionEditor", config],
            ["c:commanderToolsModalFooter", {closeAction: closeAction}]
        ], function(components, status, err) {
            console.warn('components: ', components);
            console.warn('status: ', status);
            console.warn('err: ', err);
            if (status === "SUCCESS") {
                let modalBody = components[0];
                let modalFooter = components[1];
                modalBody.set('v.action', action);
                component.find('overlayLib').showCustomModal({
                    header: "Edit Action",
                    body: modalBody,
                    footer: modalFooter,
                    showCloseButton: true,
                    cssClass: "mymodal",
                    closeCallback: function(e) {
                        closeAction = component.get('v.closeAction');
                        console.warn('editAction.closeCallback - closeAction: ', closeAction);
                        if (closeAction === 'save') {
	                        self.updateAction(component, action);
                        } else {
                             // Do nothing
                        }
                    }
                })
            }                               
        });            
    },
    
    showSpinner: function(component, text) {
        let spinner = component.find('spinner');
        spinner.set('v.alternativeText', text || '');
        $A.util.removeClass(spinner, 'slds-hide');
    },
    
    hideSpinner: function(component) {
        let spinner = component.find('spinner');
        $A.util.addClass(spinner, 'slds-hide');
    },
    
    showToast: function(component, title, message, messageData, variant, mode) {
		component.find('notifyLib').showToast({
            title: title,
            message: message,
            messageData: messageData || null,
            variant: variant || 'info',
            mode: mode || 'dismissable'
        });        
    },
    
    createAction: function(component, action) {
        let self = this;
        let proxy = component.find('proxy');
        
        // How to best get this dynamically?
        let version = '47.0';
        let url = '/services/data/v' + version + '/einstein-conduit/actions/';

        let config = {
            label: action.label,
            name: action.name,
            type: action.type,
            description: action.description
        };
        
        if (action.commandTarget.name !== null && typeof action.commandTarget.name !== 'undefined') {
            // We're putting the ID in the name field!
            config.commandTargetId = action.commandTarget.name;
        }
        let body = JSON.stringify(config);

        self.showSpinner(component, 'Creating action ' + action.name);
        
        proxy.exec(url, 'POST', body, function(response) {
            let results = JSON.parse(response.body);
            if (results.length > 0) {
                console.error('Error code: ', results[0].errorCode, ', message: ', results[0].message);
                self.hideSpinner(component);
                self.showToast(component, 'Error Creating Action', 'Failed to create action ' + action.name, null, 'error', 'dismissable');                
            } else {
                // Add at least one intent so describe doesn't miss it
                setTimeout($A.getCallback(function() {
                    self.addIntent(component, results, function(err, intent) {
                        if (err) {
                            console.error('addIntent error: ', err);
                            self.hideSpinner(component);
                            self.showToast(component, 'Failed Creating Intent', 'Failed to create intent' + action.name, null, 'success', 'dismissable');                        
                        } else {
                            setTimeout($A.getCallback(function() {
                                self.refresh(component);
                                self.hideSpinner(component);
                                self.showToast(component, 'Successfully Created Action', 'Created action ' + action.name, null, 'success', 'dismissable');
                            }), 3000);
                        }
                    });
                }), 1000);
            }
        });
    },

	updateAction: function(component, action) {
        console.warn('updateAction: ', action);
        let self = this;
        let proxy = component.find('proxy');
        
        // How to best get this dynamically?
        let version = '47.0';
        let url = '/services/data/v' + version + '/einstein-conduit/actions/' + action.id;
        
        let config = {
            label: action.label,
            name: action.name,
            type: action.type,
            description: action.description
        };
        
        if (action.commandTarget && (action.commandTarget.name !== null && typeof action.commandTarget.name !== 'undefined')) {
            /*
            config.commandTarget = {
                name: action.commandTarget.name
            };
			*/
            config.commandTarget = action.commandTarget.name;
        }
        let body = JSON.stringify(config);

        self.showSpinner(component, 'Updating action ' + action.name);
        
        proxy.exec(url, 'PUT', body, function(response) {
            console.warn('update action response: ', response);
            let results = response.body; //JSON.parse(response.body);
            console.warn('results: ', results);
            if (results.length > 0) {
                console.error('Error code: ', results[0].errorCode, ', message: ', results[0].message);
                self.hideSpinner(component);
                self.showToast(component, 'Error Updating Action', 'Failed to update action ' + action.name, null, 'error', 'dismissable');                
            } else {
	            component.set('v.action', results);            
                self.refreshAction(component, results);
                self.hideSpinner(component);
                self.showToast(component, 'Successfully Updated Action', 'Updated action ' + action.name, null, 'success', 'dismissable');
            }
        });
    },

    deleteAction: function(component, action) {
        let self = this;
        
        let proxy = component.find('proxy');
        
        let url = action.uri;
        
        let config = {
        };
        
        let body = JSON.stringify(config);

        self.showSpinner(component, 'Creating action ' + action.name);
        
        proxy.exec(url, 'DELETE', body, function(response) {
            setTimeout($A.getCallback(function() {
                self.refresh(component);
                self.hideSpinner(component);
                self.showToast(component, 'Successfully Deleted Action', 'Deleted action ' + action.name, null, 'success', 'dismissable');                
            }), 3000);            
        });        
    },
    
    handleParameterAction: function(component, action, row) {
        let self = this;
        console.warn('handleParameterAction');
        
        if (action.name === 'delete') {
            self.deleteParameter(component, row);
        } else if (action.name === 'edit') {
            self.editParameter(component, row, 'update');
        }
    },

    addParameter: function(component) {
        console.warn('addParameter called');
        let self = this;
        
        let parameter = {
            name: '',
            type: 'StringType',
            required: false,
            defaultValue: null
        };
        self.editParameter(component, parameter, 'create');
    },
    
    editParameter: function(component, parameter, actionName) {
        let self = this;
        
        let config = {
            parameter: parameter
        };

        var closeAction = component.getReference('v.closeAction');
        
        $A.createComponents([
            ["c:commanderParameterEditor", config],
            ["c:commanderToolsModalFooter", {closeAction: closeAction}]
        ], function(components, status, err) {
            if (status === "SUCCESS") {
                let modalBody = components[0];
                let modalFooter = components[1];
                modalBody.set('v.parameter', parameter);
                component.find('overlayLib').showCustomModal({
                    header: "New Parameter",
                    body: modalBody,
                    footer: modalFooter,
                    showCloseButton: true,
                    cssClass: "mymodal",
                    closeCallback: function() {
                        closeAction = component.get('v.closeAction');
                        if (closeAction === 'save') {
                            if (actionName === 'create') {
                                self.createParameter(component, parameter);
                            } else if (actionName === 'update') {
                                self.updateParameter(component, parameter);
                            }
                        } else {
                            // Do nothing
                        }
                    }
                })
            }                               
        });        
    },
    
    createParameter: function(component, parameter) {
        let self = this;
        let proxy = component.find('proxy');
        let actionDetails = component.get('v.actionDetails');
        let text = component.get('v.newIntent');
        
        let url = actionDetails.uri + '/parameters';
        let config = {
            name: parameter.name,
            type: parameter.type,
            required: parameter.required,
            defaultValue: parameter.defaultValue
        };
        
        let body = JSON.stringify(config);
        
        self.showSpinner(component, 'Creating parameter ' + parameter.name);
        
        proxy.exec(url, 'POST', body, function(response) {
            let action = component.get('v.action');
            setTimeout($A.getCallback(function() {
                self.refreshAction(component, action);
                self.hideSpinner(component);
                self.showToast(component, 'Successfully Created Parameter', 'Created parameter ' + parameter.name, null, 'success', 'dismissable');                
            }), 1000);  
        });
    },

    updateParameter: function(component, parameter) {
        let self = this;
        let proxy = component.find('proxy');
        let actionDetails = component.get('v.actionDetails');
        let text = component.get('v.newIntent');
        
        let url = actionDetails.parametersUri + '/' + parameter.id;
        let config = {
            name: parameter.name,
            type: parameter.type,
            required: parameter.required,
            defaultValue: parameter.defaultValue
        };
        
        let body = JSON.stringify(config);

        self.showSpinner(component, 'Updating parameter ' + parameter.name);
        
        proxy.exec(url, 'PUT', body, function(response) {
            let action = component.get('v.action');
            setTimeout($A.getCallback(function() {
                self.refreshAction(component, action);
                self.hideSpinner(component);
                self.showToast(component, 'Successfully Updated Parameter', 'Updated parameter ' + parameter.name, null, 'success', 'dismissable');                
            }), 1000);  
        });
    },
    
    deleteParameter: function(component, parameter) {
        let self = this;
        console.warn('deleteParameter: ', parameter);
        
        let answer = confirm('Are you sure you want to delete parameter ' + parameter.name + '?');
        if (answer === true) {
            
            let proxy = component.find('proxy');
            let action = component.get('v.action');
            
            let url = parameter.uri;
            
            let config = {
            };
            
            let body = JSON.stringify(config);
            
            self.showSpinner(component, 'Updating parameter ' + parameter.name);
            
            proxy.exec(url, 'DELETE', body, function(response) {
                let action = component.get('v.action');
                setTimeout($A.getCallback(function() {
                    self.refreshAction(component, action);
                    self.hideSpinner(component);
                    self.showToast(component, 'Successfully Deleted Parameter', 'Deleted parameter ' + parameter.name, null, 'success', 'dismissable');                
                }), 1000);  
    
            });
        }
    },
    
    updateIntent: function(component, intent) {
        let self = this;
        let proxy = component.find('proxy');
        let actionDetails = component.get('v.actionDetails');
        
        
        let url = actionDetails.intentsUri + '/' + intent.id;
        let config = {
            phrase: intent.phrase
        };
        
        let body = JSON.stringify(config);
        
        self.showSpinner(component, 'Updating intent ' + intent.id);
        
        proxy.exec(url, 'PUT', body, function(response) {
            setTimeout($A.getCallback(function() {
	            let action = component.get('v.action');            
                self.refreshAction(component, action);
                self.hideSpinner(component);
                self.showToast(component, 'Successfully Updated Intent', 'Updated intent to ' + intent.phrase, null, 'success', 'dismissable');                
            }), 1000);  
        });
        
    },
    
    addIntent: function(component, actionDetails, callback) {
        let self = this;
        let proxy = component.find('proxy');        
        let text = component.get('v.newIntent') || '';
        
        let url = actionDetails.intentsUri;
        let config = {
            phrase: text || 'Test'
        };
        
        let body = JSON.stringify(config);
        
        self.showSpinner(component, 'Adding intent ' + text);

        proxy.exec(url, 'POST', body, function(response) {
            let intent = JSON.parse(response.body);
            setTimeout($A.getCallback(function() {
	            component.set('v.newIntent', '');
                let action = component.get('v.action');
                self.refreshAction(component, action);
                self.hideSpinner(component);
                self.showToast(component, 'Successfully Added Intent', 'Added intent ' + intent.phrase, null, 'success', 'dismissable');                
                if (typeof callback === 'function') {
                    callback(null, response.body);
                }
            }), 1000);              
        });
    },
    
    deleteIntent: function(component, intent, callback) {
        let self = this;
        
        let answer = confirm('Are you sure you want to delete intent ' + intent.phrase + '?');
        if (answer === true) {
        
            let proxy = component.find('proxy');
            let action = component.get('v.action');
            
            let url = intent.uri;
            
            let config = {
            };
            
            let body = JSON.stringify(config);
    
            self.showSpinner(component, 'Deleting intent ' + intent.phrase);
            
            proxy.exec(url, 'DELETE', body, function(response) {
                setTimeout($A.getCallback(function() {
                    component.set('v.newIntent', '');
                    let action = component.get('v.action');
                    self.refreshAction(component, action);
                    self.hideSpinner(component);
                    self.showToast(component, 'Successfully Deleted Intent', 'Deleted intent ' + intent.phrase, null, 'success', 'dismissable');                
                    if (typeof callback === 'function') {
                        callback(null, response);
                    }
                }), 1000);              
            });
        }
    },
    
    
    handleIntentAction: function(component, action, row) {
        let self = this;
        
        if (action.name === 'delete') {
            self.deleteIntent(component, row, function(err, resp) {
                /*
                let action = component.get('v.action');
                setTimeout($A.getCallback(function() {
                    self.refreshAction(component, action);
                }), 3000);
                */
            });
        }
    },
    
    getParameters: function(component, action, callback) {
        let self = this;
        console.warn('getParameters: ', action);
        
        let proxy = component.find('proxy');
        
        let url = action.uri + '/parameters';
        
        let config = {
        };
        
        let body = JSON.stringify(config);
        
        proxy.exec(url, 'GET', body, function(response) {
            if (typeof callback === 'function') {
                callback(null, response.body.parameters);
            }
        });
    },
    
    /*
     * Recursively find all variations for the phrase
     * Returns the details, including variants in text and object form
     */
    getIntentDetails: function(component, intent, phrase, callback) {
        let self = this;
        
        let intentDetails = {
            phrase: phrase,
            tokenized: phrase,
            variants: [],
            variables: [],
            variableMap: {},
            parameters: [],
            parameterMap: {},
            tokens: [],
            tokenMap: {},
            tokenDetails: []
        };
        
        let exp = new RegExp('\\[(.*?)\\]', 'g');
        //let exp = new RegExp('\\[([^()]*)\\]', 'g');
        
        let matches = phrase.match(exp);
        if (matches) {
            matches.forEach(function(param, i) {
                intentDetails.tokenized = intentDetails.tokenized.replace(param, '{{v_' + i + '}}');                
                let v = param.replace(new RegExp('[{\\[\\]}]', 'g'), '');
                //if (!intentDetails.variableMap[v]) {
                var variable = {
                    key: v,
                    values: null
                }
                variable.values = v.split('|');
                intentDetails.variables.push(variable);
                intentDetails.variableMap[v] = variable.values;
                intentDetails.tokens.push({
                    name: 'v_' + i,
                    type: 'variable',
                    key: variable.key,
                    values: variable.values
                });
                intentDetails.tokenMap['{{v_' + i + '}}'] = {
                    name: 'v_' + i,
                    key: variable.key,
                    type: 'variable',
                    values: variable.values
                }
                //}
            });      
        }
        
        // Now do the parameters
        exp = new RegExp('\\(([^()]*)\\)', 'g');
        
        matches = phrase.match(exp);
        if (matches) {
            matches.forEach(function(param, i) {
                intentDetails.tokenized = intentDetails.tokenized.replace(param, '{{p_' + i + '}}');                                
                //param = param.replace(new RegExp('[{()}]', 'g'), '');
                param = param.replace(new RegExp('[()]', 'g'), '');
                let tokens = param.split('=');
                var parameter = {
                    key: tokens[0],
                    value: tokens[1], // || tokens[0],
                    def: null
                }
                intent.parameters.forEach(function(p) {
                    if (p.name === parameter.key) {
                        parameter.def = p
                    }
                });
                intentDetails.parameters.push(parameter);
                intentDetails.tokens.push({
                    name: 'p_' + i,
                    type: 'parameter',
                    key: parameter.key,
                    value: parameter.value,
                    values: parameter.values,
                    def: parameter.def
                });                
                intentDetails.tokenMap['{{p_' + i + '}}'] = {
                    name: 'p_' + i,
                    key: parameter.key,
                    type: 'parameter',
                    value: parameter.value,
                    values: parameter.values,
                    def: parameter.def
                }                
            });      
        }
        
        exp = new RegExp('{{[^}]*}}|[^{}]+', 'g');
        let tokens = intentDetails.tokenized.match(exp);
        console.warn('tokens: ', tokens);
        
        let tokenDetails = [];
        
        tokens.forEach(function(token) {
            var detail = intentDetails.tokenMap[token];
            if (detail) {
                intentDetails.tokenDetails.push({
                    token: token,
                    key: detail.key,
                    name: detail.name,
                    type: detail.type,
                    value: detail.value || (detail.values ? detail.values[0] : null),
                    values: detail.values,
                    def: detail.def,
                    simpleValueType: self.getSimpleValueType(detail.def ? detail.def.type : 'StringType')
                });
            } else {
                intentDetails.tokenDetails.push({
                    token: token,
                    type: 'text',
                    value: token,
                    simpleValueType: self.getSimpleValueType('StringType')
                });
            }
        });
        
        console.warn('tokensDetails: ', intentDetails.tokenDetails);
        
        console.warn('phrase: ', intentDetails.phrase);
        console.warn('tokenized: ', intentDetails.tokenized);
        console.warn('tokens: ', intentDetails.tokens);
        console.warn('tokenMap: ', intentDetails.tokenMap);
        
        
        
        if (typeof callback === 'function') {
            callback(intentDetails);
        }
    },
    
    generatePhrase: function(component) {
        console.warn('generatePhrase');
        let self = this;
        let intentDetails = component.get('v.intentDetails');
        let tokenDetails = intentDetails.tokenDetails;
        
        let phrase = '';
        
        let ready = true;
        
        tokenDetails.forEach(function(detail) {
            console.warn('detail: ', detail);
            
            // If a value is missing then it's not ready
            if (detail.value === null || typeof detail.value === 'undefined') {
                ready = false;
            }
            
            switch (detail.type) {
                case 'text':
                    phrase += detail.value || 'TBD';
                    break;
                    
                case 'variable':
                    phrase += detail.value || 'TBD';
                    break;
                    
                case 'parameter':
                    phrase += detail.value || 'TBD'; //'(' + detail.key + (detail.value ? '=' + detail.value : '') + ')';
                    break;
                    
                default:
                    break;
            }
        });
        console.warn('phrase: ', phrase);
        component.set('v.phraseReady', ready);
        component.set('v.generatedPhrase', phrase);
    },

    handleActionChange: function(component) {
        let self = this;
        
        let action = component.get('v.action');
        
        if (action && action.id) {
            self.getActionDetails(component, action, function(err, actionDetails) {
                if (err) {
                    console.error('getActionDetails error: ', err);
                } else {
                    component.set('v.actionDetails', actionDetails);
                    
                    self.getParameters(component, actionDetails, function(err, params) {
                        if (err) {
                            console.error('getParameters error: ', err);
                        } else {
                            component.set('v.parameters', params);
                        }
                    });
                }
            });
        }
    },
    
    findVariants: function(component, intentDetails, callback) {
        for (var key in intentDetails.tokenMap) {
            
        }  
    },
    
    handleSelectIntent: function(component, selectedRows) {
        let self = this;
        
        let intent = selectedRows[0];
        component.set('v.selectedIntent', intent);
        
        if (intent) {
            self.getIntentDetails(component, intent, intent.phrase, function(intentDetails) {
                
                component.set('v.intentDetails', intentDetails);
                
                self.generatePhrase(component);
                
                self.findVariants(component, intentDetails, function(variants) {
                    
                });
            });
        }
    },
    
    handleSaveIntents: function(component) {
        console.warn('handleSaveIntents');
        
    },
    
    handleCancelSaveIntents: function(component) {
        console.warn('handleCancelSaveIntents');
        
    }
    
})