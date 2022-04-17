import { tester } from "../parser-tester-instance"

tester.echoExps(`

{
  let x = a
  return f(x)
}

{
  let x = a;
  return f(x)
}

{ let x = a return f(x) }
{ let x = a; return f(x) }

`)
