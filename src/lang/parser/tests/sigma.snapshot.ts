import { tester } from "../parser-tester-instance"

tester.echoExp(`[a: A | C(a)]`)
tester.echoExp(`[_: A | C]`)
tester.echoExp(`[a: A | [b: B | C(a, b)]]`)
tester.echoExp(`[a: A, b: B | C(a, b)]`)

tester.echoExp(`exists (a: A) C(a)`)
tester.echoExp(`exists (_: A) C`)
tester.echoExp(`exists (a: A) exists (b: B) C(a, b)`)
tester.echoExp(`exists (a: A, b: B) C(a, b)`)

tester.echoExp(`Pair(A, B)`)

tester.echoExp(`cons(a, b)`)
tester.echoExp(`cons(a, cons(b, c))`)

tester.echoExp(`[a | b]`)
tester.echoExp(`[a, b | c]`)

tester.echoExp(`car(target)`)
tester.echoExp(`cdr(target)`)
