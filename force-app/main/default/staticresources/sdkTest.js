let _sdk = null;

function setSDK(sdk) {
    this._sdk = sdk;
}

function getSDK() {
    return this._sdk;
}

function listDashboards() {
    let sdk = getSDK();    
    var context = {apiVersion: '46'};
    var methodName = 'listDashboards';
    var methodParameters = {};
    console.warn('in static resource');
    console.warn('sdk: ', sdk);
    console.warn('methodName: ', methodName);
    console.warn('methodParameters: ', methodParameters);
    sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
        console.warn('sdk.invokeMethod returned: ', err, data);
        if (err !== null) {
            console.error(JSON.stringify(err, null, 2));
        } else {
            console.warn(JSON.stringify(data, null, 2));
        }
    }));
    sdk.invokeMethod(context, methodName, methodParameters, function(err, data) {
        console.warn(methodName + ' returned: ', err, data);
        if (err !== null) {
            console.error(JSON.stringify(err, null, 2));
        } else {
            console.warn(JSON.stringify(data, null, 2));
        }
    });
}

function listFolders() {
    let sdk = getSDK();    
    var context = {apiVersion: "46"};
    var methodName = 'listFolders';
    var methodParameters = {
        q: 'My_Demo_App',
        sort: 'Name'
    };
    console.warn('in static resource');
    console.warn('sdk: ', sdk);        
    console.warn('methodName: ', methodName);
    console.warn('methodParameters: ', methodParameters);
    sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
        console.warn(methodName + ' returned: ', err, data);
        if (err !== null) {
            console.error("error: ", JSON.stringify(err, null, 2));
        } else {
            console.warn('data: ', JSON.stringify(data, null, 2));
        }
    }));        
}

function testMethod() {
    console.warn('testMethod');
    methodTest.test(function(err, resp) {
        console.warn('methodTest returned: ', err, resp);
    });
}

function testSDKExecuteQuery() {
    console.warn('test');
    var query = "q = load \"0FbB0000000BWZRKA4/0FcB0000002OPtKKAW\";q = foreach q generate 'CloseDate' as 'CloseDate', 'ExpectedRevenue' as 'ExpectedRevenue', 'Fiscal' as 'Fiscal', 'FiscalQuarter' as 'FiscalQuarter', 'FiscalYear' as 'FiscalYear', 'ForecastCategory' as 'ForecastCategory', 'Id' as 'Id', 'IsWon' as 'IsWon', 'LeadSource' as 'LeadSource', 'Name' as 'Name', 'Probability' as 'Probability', 'StageName' as 'StageName', 'Type' as 'Type', 'eadx__OrderNumber__c' as 'eadx__OrderNumber__c';q = limit q 100;";
    executeQuery(query, function(err, resp) {
        console.warn('executeQuery returned: ', err, resp);
    });
}

function executeQuery(query, callback) {
    let sdk = getSDK();
    var context = {apiVersion: '46'};
    var methodName = 'executeQuery';
    var methodParameters = {
        query: query
    };
    console.warn('executeQuery');
    console.warn('query: ', query);
    console.warn('methodName: ', methodName);
    console.warn('methodParameters: ', methodParameters);
    sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
        console.warn('sdk.invokeMethod returned: ', err, data);
        if (err !== null) {
            if (callback !== null && typeof callback !== 'undefined') {
                callback(err, null);
            } else {
                return err;
            }
        } else {
            let resp = typeof data === 'string' ? JSON.parse(data) : data;
            if (callback !== null && typeof callback !== 'undefined') {
                callback(null, resp);
            } else {
                return data;
            }
        }
    }));
}


function setupLightning() {
    var loAppName = "c:loApp";
    var sdk = null;
    var methodTest = null;    
    
    //setTimeout(function() {
        
    $Lightning.use(loAppName, function(evt) {
        var config = {};
        
        
        $Lightning.createComponent("eadx:methodTestTab", {}, "method_test", function(cmp, msg, err) {
            console.warn('createComponent - eadx:methodTestTab returned: ', cmp, msg, err);
            methodTest = cmp;
        });
        
        $Lightning.createComponent("eadx:executeQueryTab", config, "execute_query", function(cmp, msg, err) {});
        
        $Lightning.createComponent("wave:sdk", {"aura:id": "sdk"}, "sdk", $A.getCallback(function(cmp, msg, err) {
            console.warn('createComponent wave:sdk returned: ', cmp, msg, err);
            sdk = cmp;
            
            setSDK(sdk);
            
            testSDKExecuteQuery();
            
            //listDashboards();
            
            //listFolders();

        }));
    });      
        
    //}, 1000);
        
}


(function() {
    console.warn('test');
    setupLightning();
}());