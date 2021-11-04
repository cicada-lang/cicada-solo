import { tester } from "./utilities"

tester.echo_exp(`[a: A | C(a)]`)
tester.echo_exp(`[_: A | C]`)
tester.echo_exp(`[a: A | [b: B | C(a, b)]]`)
tester.echo_exp(`[a: A, b: B | C(a, b)]`)
tester.echo_exp(`there exists [a: A, b: B such that C(a, b)]`)

tester.echo_exp(`Pair(A, B)`)

// tester.echo_exp(`[car | cdr]`)
// tester.echo_exp(`[a, b | c]`)

// tester.echo_exp(`car(target)`)
// tester.echo_exp(`cdr(target)`)
