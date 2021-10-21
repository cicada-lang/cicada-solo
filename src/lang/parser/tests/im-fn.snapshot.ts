import { tester } from "./utilities"

tester.echo_stmts(`

car_type(
  implicit { A: Type, B: Type }, pair: (A) * B,
): Type {
  A
}

car_type: (
  implicit { A: Type, B: Type }, pair: (A) * B,
) -> Type =
  (implicit { A }, pair) => A

car_type: (
  implicit { A: Type, B: Type }, pair: (A) * B,
) -> Type =
  (implicit { A, B }, pair) => A

`)
