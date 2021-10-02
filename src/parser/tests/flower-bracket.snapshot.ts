import { tester } from "./utilities"

tester.echo_stmts(`

a: Nat {
  x = 1
  y = 2
  x
}


b: Nat {
  x: Nat {
    1
  }

  y = 2

  x
}


`)
