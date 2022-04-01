import { tester } from "../parser-tester-instance"

tester.echoStmts(`

function car_type(
  implicit A: Type,
  implicit B: Type,
  pair: [_: A | B],
): Type {
  return A
}

let car_type: (
  implicit A: Type,
  implicit B: Type,
  pair: [_: A | B],
) -> Type =
  (implicit A, pair) => A

let car_type: (
  implicit A: Type,
  implicit B: Type,
  pair: [_: A | B],
) -> Type =
  (implicit A, implicit B, pair) => A

`)
