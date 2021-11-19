import { tester } from "../parser-tester-instance"

tester.echo_stmts(`

car_type(
  implicit A: Type,
  implicit B: Type,
  pair: [_: A | B],
): Type {
  A
}

car_type: (
  implicit A: Type,
  implicit B: Type,
  pair: [_: A | B],
) -> Type =
  (implicit A, pair) => A

car_type: (
  implicit A: Type,
  implicit B: Type,
  pair: [_: A | B],
) -> Type =
  (implicit A, implicit B, pair) => A

`)
