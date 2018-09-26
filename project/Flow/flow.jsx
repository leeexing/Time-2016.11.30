// @flow
function concat(a: string, b: string) {
  return a + b;
}

concat("A", "B"); // Works!
// concat(1, 2); // Error!

function method (x: number, y: string, z: boolean) {
  console.log(x, y, z)
}

method(3.14, 'hello', false)

function add (obj) {
  let foo: number = obj.foo
}
add({foo: 'leeing'})
