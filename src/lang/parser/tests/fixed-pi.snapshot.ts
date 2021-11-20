import { tester } from "../parser-tester-instance"

tester.echo_exp(`(fixed E: Type) -> Type`)
tester.echo_exp(`(fixed E: Type, n: Nat) -> Type`)
