({
	clickAdd: function(component, event, helper) {
		let num1 = component.get('v.num1');
        console.warn('num1: ', num1, typeof num1);
		let num2 = component.get('v.num2');
        console.warn('num2: ', num2, typeof num2);
        let sum = num1 + num2;
        component.set('v.sum', sum);
	}
})