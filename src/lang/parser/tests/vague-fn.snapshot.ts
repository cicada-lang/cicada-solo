import { tester } from "../parser-tester-instance"

tester.echoStmts(`

(vague A, head, tail) => {
  return li(head, tail)
}

`)
