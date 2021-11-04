import { tester } from "./utilities"

tester.echo_exp(`
x = a
f(x)
`)

tester.echo_exp(`x = a f(x)`)
// tester.echo_exp(`x = a; f(x)`)
