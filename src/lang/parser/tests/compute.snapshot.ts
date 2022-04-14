import { tester } from "../parser-tester-instance"

// NOTE preserved keywords

tester.echoStmts(`

compute "abc"
compute x
compute f(x)

`)
