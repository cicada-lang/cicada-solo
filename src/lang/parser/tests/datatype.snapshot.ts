import { tester } from "../parser-tester-instance"

tester.echo_stmts(`

datatype Nat {
  zero: Nat
  add1(prev: Nat): Nat
}

datatype List(E: Type) {
  null: List(E)
  cons(head: E, tail: List(E)): List(E)
}

datatype Vector(E: Type) (length: Nat) {
  null: Vector(E, Nat.zero)
  cons(
    head: E,
    implicit prev: Nat,
    tail: Vector(E, prev),
  ): Vector(E, Nat.add1(prev))
}

datatype LessThan() (j: Nat, k: Nat) {
  zero_smallest(n: Nat): LessThan(Nat.zero, Nat.add1(n))
  add1_smaller(
    j: Nat, k: Nat,
    prev_smaller: LessThan(j, k),
  ): LessThan(Nat.add1(j), Nat.add1(k))
}

`)
