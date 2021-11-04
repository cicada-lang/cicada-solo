import { tester } from "./utilities"

tester.echo_stmts(`

x = exp
x: T = exp

f(a: A, b: B): C(a, b) {
  body
}

// f(a: A, b: B): C(a, b) {
//   return body
// }

`)
