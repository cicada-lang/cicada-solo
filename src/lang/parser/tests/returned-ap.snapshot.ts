import { tester } from "../parser-tester-instance"

tester.echo_stmts(`

my_list_cons(returned Nat, 123, nil)
my_list_cons(returned Nat)
my_list_cons(returned Nat)(123, nil)

`)
