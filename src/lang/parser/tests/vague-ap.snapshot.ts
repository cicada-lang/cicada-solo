import { tester } from "../parser-tester-instance"

tester.echoExp(`
my_list_cons(vague String, "abc", List.null)
`)

tester.echoExp(`
my_list_cons(vague String)
`)

tester.echoExp(`
my_list_cons(vague String)("abc", List.null)
`)
