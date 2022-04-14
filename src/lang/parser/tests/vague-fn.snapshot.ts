import { tester } from "../parser-tester-instance"

tester.echoExp(`

(vague A, head, tail) => {
  return li(head, tail)
}

`)
