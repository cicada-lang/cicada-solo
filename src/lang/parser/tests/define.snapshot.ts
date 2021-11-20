import { tester } from "../parser-tester-instance"

tester.echo_stmts(`

x = exp
x: T = exp

f(a: A, b: B): C(a, b) {
  return body
}

`)
