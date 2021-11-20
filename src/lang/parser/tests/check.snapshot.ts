import { tester } from "../parser-tester-instance"

tester.echo_stmts(`

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


tester.echo_stmts(`

check! inl(x): Either(A, (A) -> B)
check! f(inl(x)): B

`)
