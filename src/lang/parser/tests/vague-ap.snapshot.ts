import { tester } from "../parser-tester-instance"

tester.echoStmts(`

my_list_cons(vague String, "abc", List.null)
my_list_cons(vague String)
my_list_cons(vague String)("abc", List.null)

`)
