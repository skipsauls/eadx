{
  "Extract_OpportunityHistory_custom": {
    "action": "sfdcDigest",
    "parameters": {
      "fields": [
        {
          "name": "Amount__c"
        },
        {
          "name": "CloseDate__c"
        },
        {
          "name": "CreatedById"
        },
        {
          "name": "CreatedDate"
        },
        {
          "name": "ForecastCategory__c"
        },
        {
          "name": "Id"
        },
        {
          "name": "IsDeleted"
        },
        {
          "name": "OpportunityId__c"
        },
        {
          "name": "StageName__c"
        }
      ],
      "object": "OpportunityHistory__c"
    },
    "schema": {
      "objects": [
        {
          "fields": [
            {
              "description": "Opportunity Created Date",
              "format": "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
              "label": "CreatedDate",
              "name": "CreatedDate"
            },
            {
              "description": "Amount",
              "label": "Amount",
              "name": "Amount__c"
            }
          ],
          "label": "OpportunityHistory"
        }
      ]
    }
  },
  "Compute_Historical_Trending_Fields_custom": {
    "action": "computeRelative",
    "parameters": {
      "computedFields": [
        {
          "description": "Opportunity Created Date",
          "expression": {
            "default": "current()",
            "offset": "first()",
            "sourceField": "CreatedDate"
          },
          "label": "OpportunityCreatedDate",
          "name": "OpportunityCreatedDate"
        },
        {
          "description": "ValidToDate",
          "expression": {
            "default": "3000-01-01T00:00:00.000Z",
            "offset": "next()",
            "sourceField": "CreatedDate"
          },
          "label": "ValidToDate",
          "name": "ValidToDate"
        },
        {
          "description": "ValidFromDate",
          "expression": {
            "default": "current()",
            "offset": "current()",
            "sourceField": "CreatedDate"
          },
          "label": "ValidFromDate",
          "name": "ValidFromDate"
        },
        {
          "description": "AmountPrev",
          "expression": {
            "default": "0",
            "offset": "previous()",
            "sourceField": "Amount__c"
          },
          "label": "AmountPrev",
          "name": "AmountPrev"
        },
        {
          "description": "Previous Stage Name",
          "expression": {
            "default": null,
            "offset": "previous()",
            "sourceField": "StageName__c"
          },
          "label": "Prev Stage Name",
          "name": "StageNamePrev"
        },
        {
          "description": "ForecastCategoryPrev",
          "expression": {
            "default": null,
            "offset": "previous()",
            "sourceField": "ForecastCategory__c"
          },
          "label": "ForecastCategoryPrev",
          "name": "ForecastCategoryPrev"
        },
        {
          "description": "Previous Close Date",
          "expression": {
            "default": "1970-01-01",
            "offset": "previous()",
            "sourceField": "CloseDate__c"
          },
          "label": "Prev Close Date",
          "name": "CloseDatePrev"
        },
        {
          "description": "Previous Created Date",
          "expression": {
            "default": null,
            "offset": "previous()",
            "sourceField": "CreatedDate"
          },
          "label": "Prev CreatedDate",
          "name": "CreatedDatePrev"
        },
        {
          "expression": {
                       "sourceField": "ForecastCategory__c",
                       "default": null,
                       "offset": "current()"
                   },
                   "name": "ForecastCategory",
                   "label": "To ForecastCategory"
               },
               {
                   "expression": {
                       "sourceField": "Amount__c",
                       "default": "0",
                       "offset": "current()"
                   },
                   "name": "Amount",
                   "label": "Amount"
               },
               {
                   "expression": {
                       "sourceField": "CloseDate__c",
                       "default": "current()",
                       "offset": "current()"
                   },
                   "name": "CloseDate",
                   "label": "Close Date"
               },
               {
                   "expression": {
                       "sourceField": "OpportunityId__c",
                       "default": "current()",
                       "offset": "current()"
                   },
                   "name": "OpportunityId",
                   "label": "Opportunity ID"
               },
               {
                   "expression": {
                       "sourceField": "StageName__c",
                       "default": null,
                       "offset": "current()"
                   },
                   "name": "StageName",
                   "label": "Stage Name"
               }
      ],
      "orderBy": [
        {
          "direction": "asc",
          "name": "CreatedDate"
        }
      ],
      "partitionBy": [
        "OpportunityId__c"
      ],
      "source": "Extract_OpportunityHistory"
    }
  }
}