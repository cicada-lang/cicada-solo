import { tester } from "../parser-tester-instance"

tester.echoStmts(`

let x = exp
let x: T = exp

function f(a: A, b: B): C(a, b) {
  return body
}

`)
