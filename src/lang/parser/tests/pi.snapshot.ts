import { tester } from "../parser-tester-instance"

tester.echoExp(`(A) -> C`)
tester.echoExp(`(A, B) -> C`)
tester.echoExp(`(a: A, b: B) -> C(a, b)`)

tester.echoExp(`forall (a: A, b: B) C(a, b)`)
tester.echoExp(`forall (a: A) forall (b: B) C(a, b)`)

tester.echoExp(`(x) => body`)
tester.echoExp(`(x) => { body }`)

tester.echoExp(`f(x)`)
tester.echoExp(`f(x)(y)`)
tester.echoExp(`f(x, y)`)
