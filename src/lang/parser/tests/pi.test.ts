import { tester } from "./utilities"

tester.exp(`(a: A, b: B) -> C`)
tester.exp(`for all (a: A, b: B) -> C`)

tester.exp(`(a: A, b: B) -> C(a, b)`)
tester.exp(`for all (a: A, b: B) -> C(a, b)`)
