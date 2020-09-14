({
	init: function(component, event, helper) {
        let test = {
            a_string: 'This is a string',
            a_number: 1234.56,
            a_boolean: true,
            a_simple_array: [1,2,3,4,5,6],
            a_complex_array: [
                {
                    a: 1,
                    b: 2
                },
                {
                    a: 3,
                    b: 4
                }
            ],
            a_simple_object: {
                name: 'Demo'
            },
            a_complex_object: {
                an_array: [9,8,7,6,5,4,3,2,1],
                an_object: {
                    name: 'Larry',
                    age: 45
                },
                nested_objects: {
                    test1: {
                        name: 'Moe',
                        age: 40,
                        children: [
                            {
                                name: 'Huey',
                                blocks: [
                                    {
                                        'Spanky': {
                                            id: '1234567890',
                                            ticks: [Date.now(), Date.now() + 100, Date.now() + 200]
                                        }
                                    }
                                ]
                            },
                            {
                                name: 'Dewey'
                            },
                            {
                                name: 'Louie'
                            }
                        ]
                    },
                    test2: {
                        name: 'Curly',
                        age: 42
                    }                    
                }
            }
        };
        let json = JSON.stringify(test);
        component.set('v.json', json);
	}
})