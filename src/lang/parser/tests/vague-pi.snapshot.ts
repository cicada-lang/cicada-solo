import { tester } from "../parser-tester-instance"

tester.echoExp(`
(vague A: Type, head: A, tail: List(A)) -> List(A)
`)

tester.echoExp(`
(vague A: Type) -> List(A)
`)

tester.echoExp(`
(vague A: Type, vague B: Type) -> Pair(List(A), List(B))
`)
