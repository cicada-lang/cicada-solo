import { tester } from "../parser-tester-instance"

tester.echoStmts(`

function cong(
  implicit X: Type,
  implicit from: X,
  implicit to: X,
  target: Equal(X, from, to),
  implicit Result: Type,
  f: (X) -> Result,
): Equal(Result, f(from), f(to)) {
  return replace(
    target,
    (to) => Equal(Result, f(from), f(to)),
    refl)
}

function cong(
  implicit X: Type,
  implicit from: X,
  implicit to: X,
  target: Equal(X, from, to),
  implicit Result: Type,
  f: (X) -> Result,
): Equal(Result, f(from), f(to)) {
  return replace(
    target,
    (to) => Equal(Result, f(from), f(to)),
    refl)
}

`)
