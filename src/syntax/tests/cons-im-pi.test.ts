import * as tester from "../tester"

tester.stmts`

cong(
  implicit {
    X: Type,
    from: X,
    to: X,
  },
  target: Equal(X, from, to),
  implicit { Result: Type },
  f: (X) -> Result,
): Equal(Result, f(from), f(to)) {
  replace(
    target,
    (to) { Equal(Result, f(from), f(to)) },
    same)
}

`

tester.stmts`

cong(
  implicit {
    // NOTE In a record, comma is optional.
    X: Type
    from: X
    to: X
  },
  target: Equal(X, from, to),
  implicit { Result: Type },
  f: (X) -> Result,
): Equal(Result, f(from), f(to)) {
  replace(
    target,
    (to) { Equal(Result, f(from), f(to)) },
    same)
}

`
