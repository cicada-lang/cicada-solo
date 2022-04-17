import { tester } from "../parser-tester-instance"

tester.echoExp(`

recursion (x) {
  case zero => y
  case add1(_prev, almost) => Nat.add1(almost.prev)
}

`)

tester.echoExp(`

induction (x) {
  (_) => Nat
  case zero => y
  case add1(_prev, almost) => Nat.add1(almost.prev)
}

`)

tester.echoExp(`

induction (x) {
  (length, _target) => Vector(E, add(length, yl))
  case null => y
  case cons(head, _tail, almost) => Vector.cons(head, almost.tail)
}

`)
