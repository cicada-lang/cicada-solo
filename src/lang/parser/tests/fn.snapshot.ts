import { tester } from "../parser-tester-instance"

// NOTE sugar for not repeating argument list

tester.echo_stmts(`

function id(A: Type, x: A): A {
  return x
}

let id: (A: Type, x: A) -> A =
  (A, x) => {
    return x
  }

let id: (A: Type, x: A) -> A =
  (A, x) => x

let id: (A: Type, x: A) -> A =
  // NOTE The scope is different,
  //   thus the name of bound variables
  //   does not need to be the same.
  (B, y) => y
`)

// NOTE sugar for multi-argument function

tester.echo_stmts(`

let f: (Trivial) -> (Trivial) -> Trivial =
  (x, y) => sole

let g: (Trivial) -> (Trivial) -> Trivial =
  (x) => (y) => sole

let g: (Trivial) -> (Trivial) -> Trivial =
  (x) => (y) => {
    return sole
  }

`)
