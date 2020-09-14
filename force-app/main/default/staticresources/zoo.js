'use strict';

class Animal { 
    constructor(name) {
        this.name = name;
    }
    
    speak() {
        console.log(this.name + ' makes a noise.');
    }

}

class Dog extends Animal {
    constructor(name) {
        super(name); // call the super class constructor and pass in the name parameter
        this.barks = 0;
    }
    
    speak() {
        console.log(this.name + ' barks.');
        this.barks++;
    }
}

(function(w) {
    w.Animal = Animal;
    w.Dog = Dog;
})(window);
