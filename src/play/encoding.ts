export type Church<T> = (f: (x: T) => T) => (x: T) => T

function zero<T>(f: (x: T) => T): (x: T) => T {
  return (x) => x
}
function one<T>(f: (x: T) => T): (x: T) => T {
  return (x) => f(x)
}
function two<T>(f: (x: T) => T): (x: T) => T {
  return (x) => f(f(x))
}

function add1<T>(n: Church<T>): Church<T> {
  return (f) => (x) => f(n(f)(x))
}

function add<T>(m: Church<T>, n: Church<T>): Church<T> {
  return (f) => (x) => m(f)(n(f)(x))
}

function id<T>(x: T): T {
  return x
}

console.log(zero((x: number) => x + 1)(0))
console.log(add1(add(two, two))((x: number) => x + 1)(0))
