import { tester } from "../parser-tester-instance"

tester.echo_stmts(`

let a: Nat = {
  let x = 1
  let y = 2
  return x
}

let b: Nat = {
  let x: Nat = {
    return 1
  }

  let y = 2

  return x
}

class ABC {
  a: String = "a"

  b: String = {
    let str = "b"
    return str
  }

  c: String
}

`)
