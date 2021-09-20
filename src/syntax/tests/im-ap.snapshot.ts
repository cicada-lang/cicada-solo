import * as tester from "../tester"

tester.echo_stmts`

id(implicit { A: String }, "a")
k(implicit { A: Nat }, 100, implicit { A: Nat }, 101)

`
