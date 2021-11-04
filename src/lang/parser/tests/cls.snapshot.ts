import { tester } from "../parser-tester-instance"

tester.echo_exp(`class { a: A, b: B(a), c: C(a, b) }`)

tester.echo_exp(`
class {
  a: A
  b: B(a)
  c: C(a, b)
}
`)

tester.echo_exp(`{ a: f(x), b: g(y), c: z }`)
tester.echo_exp(`{ a, b, c }`)
tester.echo_exp(`{ a, b, c, }`)
tester.not_exp(`{ a b c }`)

tester.echo_exp(`object.field`)
tester.echo_exp(`object.method(x)`)
tester.echo_exp(`object.method(x, y)`)
tester.echo_exp(`object.method(x)(y)`)
