import { tester } from "../parser-tester-instance"

tester.echo_stmts(`

(vague A, head, tail) => {
  return li(head, tail)
}

`)
