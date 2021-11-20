import { tester } from "../parser-tester-instance"

tester.echo_exp(`(fixed E) => Nat`)
tester.echo_exp(`(fixed E, n) => Nat`)
tester.echo_exp(`(fixed E, fixed f, n) => Nat`)
