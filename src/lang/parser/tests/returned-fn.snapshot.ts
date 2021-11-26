import { tester } from "../parser-tester-instance"

tester.echo_stmts(`

(returned A, head, tail) => {
  return li(head, tail)
}

`)
