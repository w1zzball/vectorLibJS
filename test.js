class Test {
  constructor() {
    this.name = 'test';
    (()=>console.log('test'))();
  }
}

function Test2() {
  this.name = 'test';
  (()=>console.log('test'))();
}

a = new Test();
b = new Test2();

console.log(typeof a);
console.log(typeof b);
console.log(typeof a === typeof b);