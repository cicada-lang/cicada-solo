import * as tester from "../tester"

tester.echo_stmts`

car_type(
  implicit { A: Type, B: Type }, pair: (A) * B,
): Type {
  A
}

`

tester.echo_stmts`

car_type: (
  implicit { A: Type, B: Type }, pair: (A) * B,
) -> Type =
  (implicit { A }, pair) {
    A
  }

`

// tester.echo_stmts`

// car_type: (
//   implicit { A: Type, B: Type }, pair: (A) * B,
// ) -> Type =
//   (implicit { A, B }, pair) {
//     A
//   }

// `
