import { tester } from "../parser-tester-instance"

tester.echo_exp(`Equal(t, from, to)`)

tester.echo_exp(`refl`)

tester.echo_exp(`same(x)`)
tester.not_exp(`same`)

tester.echo_exp(`replace(target, motive, base)`)
