import { tester } from "../parser-tester-instance"

tester.echo_stmts(`

(returned A: Type, head: A, tail: List(A)) => List(A)

(returned A: Type) => A
(returned A: Type, returned B: Type) => Pair(A, B)

`)
