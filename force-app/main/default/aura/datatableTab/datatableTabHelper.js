({
    columns: [
        { label: 'Field Name', fieldName: 'fieldName', type: 'text' },
        { label: 'ID', fieldName: 'id', type: 'text' },
        { label: 'Label', fieldName: 'label', type: 'text' }
    ],
    
    data: [
        { fieldName: 'firstName', id: '12345678', label: 'First Name'},
        { fieldName: 'lastName', id: '5678901', label: 'Last Name' },
        { fieldName: 'city', id: '452145', label: 'City' },
        { fieldName: 'state', id: '96828853', label: 'State' },
        { fieldName: 'lastAccessedDate', id: '32452345', label: 'Last Accessed Date' },
        { fieldName: 'firstCommit', id: '995902', label: 'First Commit' }
    ],
    
    selectedRows: [
        'lastName', 'state', 'firstCommit'
    ],
    
    helperMethod : function() {
        
    }
})