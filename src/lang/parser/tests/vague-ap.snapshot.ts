import { tester } from "../parser-tester-instance"

tester.echoExps(`
my_list_cons(vague String, "abc", List.null)
my_list_cons(vague String)
my_list_cons(vague String)("abc", List.null)
`)
