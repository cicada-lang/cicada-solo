import { tester } from "../parser-tester-instance"

tester.echo_exp(`(A) -> C`)
tester.echo_exp(`(A, B) -> C`)
tester.echo_exp(`(a: A, b: B) -> C(a, b)`)

tester.echo_exp(`(x) => body`)
tester.echo_exp(`(x) => { body }`)

tester.echo_exp(`f(x)`)
tester.echo_exp(`f(x)(y)`)
tester.echo_exp(`f(x, y)`)
