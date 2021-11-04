import { tester } from "../parser-tester-instance"

tester.echo_exp(`
x = a
f(x)
`)

tester.echo_exp(`x = a f(x)`)
tester.echo_exp(`x = a; f(x)`)
