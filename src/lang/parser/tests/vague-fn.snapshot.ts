import { tester } from "../parser-tester-instance"

tester.echoExps(`
(vague A, head, tail) => {
  return li(head, tail)
}
`)
