import { tester } from "../parser-tester-instance"

tester.echoExp(`
{
  let x = a
  return f(x)
}
`)

tester.echoExp(`
{
  let x = a;
  return f(x)
}
`)

tester.echoExp(`{ let x = a return f(x) }`)
tester.echoExp(`{ let x = a; return f(x) }`)
