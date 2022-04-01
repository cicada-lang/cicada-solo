import { tester } from "../parser-tester-instance"

tester.echoStmts(`

function example(
  implicit A: Type,
  implicit B: Type,
  f: (Either(A, (A) -> B)) -> B,
): B {
  function g(x: A): B {
    check! inl(x): Either(A, (A) -> B)
    check! f(inl(x)): B
    return f(inl(x))
  }

  check! inr(g): Either(A, (A) -> B)
  check! f(inr(g)): B
  return f(inr(g))
}

`)

tester.echoStmts(`

check! inl(x): Either(A, (A) -> B)
check! f(inl(x)): B

`)
