import { tester } from "../parser-tester-instance"

tester.echo_stmts(`

datatype __Nat {
  __zero: __Nat
  __add1(prev: __Nat): Nat
}

datatype __List(E: Type) {
  __nil: List(E)
  __li(head: E, tail: List(E)): List(E)
}

datatype __Vector(E: Type) (length: Nat) {
  __vecnil: Vector(E, __Nat.__zero)
  __vec(
    head: E,
    implicit prev: Nat,
    tail: Vector(E, prev),
  ): Vector(E, __Nat.__add1(prev))
}

datatype LessThan() (j: Nat, k: Nat) {
  zero_smallest(n: Nat): LessThan(__Nat.__zero, __Nat.__add1(n))
  add1_smaller(
    j: Nat, k: Nat,
    prev_smaller: LessThan(j, k),
  ): LessThan(__Nat.__add1(j), __Nat.__add1(k))
}

`)
