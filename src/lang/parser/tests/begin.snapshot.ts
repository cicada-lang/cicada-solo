import { tester } from "../parser-tester-instance"

tester.echo_stmts(`

let a: String = {
  let x = "x"
  let y = "y"
  return x
}

let b: String = {
  let x: String = {
    return "x"
  }

  let y = "y"

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
