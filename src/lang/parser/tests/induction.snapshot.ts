import { tester } from "../parser-tester-instance"

tester.echo_stmts(`

induction (x) {
  (_) => MyNat
  case my_zero => y
  case my_add1(_prev, almost) => MyNat.my_add1(almost.prev)
}

induction (x) {
  (length, _target) => Vector(E, add(length, yl))
  case null => y
  case cons(head, _tail, almost) => Vector.cons(head, almost.tail)
}

`)
