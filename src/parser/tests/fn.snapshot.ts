import { tester } from "./utilities"

// suger for not repeating argument list

tester.echo_stmts`
id(A: Type, x: A): A {
  x
}
`

tester.stmts`
id: (A: Type, x: A) -> A =
  (A, x) {
    x
  }
`

tester.stmts`
id: (A: Type, x: A) -> A =
  // NOTE The scope is different,
  //   thus the name of bound variables
  //   does not need to be the same.
  (B, y) {
    y
  }
`

// suger for multi-argument function

tester.stmts`
f: (Trivial) -> (Trivial) -> Trivial =
  (x, y) {
    sole
  }
`

tester.stmts`
g: (Trivial) -> (Trivial) -> Trivial =
  (x) (y) {
    sole
  }
`
