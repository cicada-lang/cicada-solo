import { tester } from "./utilities"

tester.echo_exp(`[a: A, b: B | C]`)
tester.echo_exp(`[a: A, b: B | C(a, b)]`)

// tester.echo_exp(`there exists [a: A, b: B such that C]`)
// tester.echo_exp(`there exists [a: A, b: B such that C(a, b)]`)
