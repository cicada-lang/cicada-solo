import { tester } from "../parser-tester-instance"

tester.echoExp(`class { a: A, b: B(a), c: C(a, b) }`)

tester.echoExp(`
class {
  a: A
  b: B(a)
  c: C(a, b)
}
`)

tester.echoExp(`
class {
  a: A
  b: B(a)

  c(E: Type): C(a, b) {
    return f(a, b)
  }
}
`)

tester.echoExp(`{ a, b, c }`)
tester.echoExp(`{ a, b, c, }`)
tester.notExp(`{ a b c }`)

tester.echoExp(`{ a: f(x), b: g(y), c: z }`)
tester.echoExp(`{ a: (x) => f(x) }`)
tester.echoExp(`{ a(x) { return f(x) } }`)

tester.echoExp(`object.field`)
tester.echoExp(`object.method(x)`)
tester.echoExp(`object.method(x, y)`)
tester.echoExp(`object.method(x)(y)`)
