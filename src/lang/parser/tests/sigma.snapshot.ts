import { tester } from "../parser-tester-instance"

tester.echo_exp(`[a: A | C(a)]`)
tester.echo_exp(`[_: A | C]`)
tester.echo_exp(`[a: A | [b: B | C(a, b)]]`)
tester.echo_exp(`[a: A, b: B | C(a, b)]`)
tester.echo_exp(`there exists [a: A, b: B such that C(a, b)]`)

tester.echo_exp(`Pair(A, B)`)

tester.echo_exp(`cons(a, b)`)
tester.echo_exp(`cons(a, cons(b, c))`)

tester.echo_exp(`[a | b]`)
tester.echo_exp(`[a, b | c]`)

tester.echo_exp(`car(target)`)
tester.echo_exp(`cdr(target)`)
