import { Nat } from "./nat"

declare module "./nat" {
  namespace Nat {
    function create(n: number): Nat
  }
}

Nat.create = function (n) {
  return new Nat(n)
}
