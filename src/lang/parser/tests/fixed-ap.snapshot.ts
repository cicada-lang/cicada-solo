import { tester } from "../parser-tester-instance"

tester.echo_exp(`f(fixed E)`)
tester.echo_exp(`f(fixed E, n)`)
tester.echo_exp(`f(fixed E, fixed x, n)`)
