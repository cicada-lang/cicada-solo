import { tester } from "./utilities"

tester.echo_exp(`(a: A, b: B) -> C`)
tester.echo_exp(`for all (a: A, b: B) -> C`)

tester.echo_exp(`(a: A, b: B) -> C(a, b)`)
tester.echo_exp(`for all (a: A, b: B) -> C(a, b)`)
