import { tester } from "../parser-tester-instance"

tester.echoExps(`
(vague A: Type, head: A, tail: List(A)) -> List(A)
(vague A: Type) -> List(A)
(vague A: Type, vague B: Type) -> Pair(List(A), List(B))
`)
