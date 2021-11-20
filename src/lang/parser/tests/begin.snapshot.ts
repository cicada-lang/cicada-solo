import { tester } from "../parser-tester-instance"

tester.echo_stmts(`

a: Nat = {
  x = 1
  y = 2
  return x
}

b: Nat = {
  x: Nat = {
    return 1
  }

  y = 2

  return x
}

class ABC {
  a: String = "a"

  b: String = {
    str = "b"
    return str
  }

  c: String
}

`)
