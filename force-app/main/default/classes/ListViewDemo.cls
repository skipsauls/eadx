public with sharing class ListViewDemo {

  private static String baseQuery = 'Select ID, Name FROM Account ORDER BY NAME ASC';
  public static String AccFilterId {get; set;}
  private static Integer pageSize = 10;

  public ListViewDemo(){}

  public static ApexPages.StandardSetController AccSetController {
        get{
            if(AccSetController == null){
                AccSetController = new ApexPages.StandardSetController(Database.getQueryLocator(baseQuery));
                AccSetController.setPageSize(pageSize);

                // We have to set FilterId after Pagesize, else it will not work
                if(AccFilterId != null)
                {
                  AccSetController.setFilterId(AccFilterId);
                }
            }
            return AccSetController;
        }set;
    }

  public ListViewDemo(ApexPages.StandardSetController c) {   }

    @AuraEnabled
    public static List<Account> firstPage()
    {
      AccSetController.first();
      return (List<Account>)AccSetController.getRecords();
    }

    @AuraEnabled
    public static List<Account> lastPage()
    {
      AccSetController.last();
      return (List<Account>)AccSetController.getRecords();
    }

    @AuraEnabled
    public static List<Account> nextPage()
    {
      if(AccSetController.getHasNext())
      {
        AccSetController.next();        
      }
        return (List<Account>)AccSetController.getRecords();
    }

    @AuraEnabled
    public static List<Account> prevPage()
    {
      if(AccSetController.getHasPrevious())
      {
        AccSetController.previous();
      }
        return (List<Account>)AccSetController.getRecords();
    }

    @AuraEnabled
    public static List<Account> getAccounts()
    {
      return (List<Account>)AccSetController.getRecords();
    }

    @AuraEnabled
    public static Map<String, String> getAccountExistingViews(){
        SelectOption[] selectOptions = AccSetController.getListViewOptions();
        Map<String, String> options = new Map<String, String>();
        for (SelectOption option: selectOptions) {
            options.put(option.getLabel(), option.getValue());
        }
        return options;
    }

    /**
    * Reset List View
    */
    @AuraEnabled
    public static void resetFilter()
    {
      AccSetController = null;
        AccSetController.setPageNumber(1);

    }

}