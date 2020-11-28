import { Nat } from "./nat"

declare module "./nat" {
  interface Nat {
    even_p: () => boolean
  }
}

Nat.prototype.even_p = function () {
  if (this.n === 0) return true
  else return Nat.create(this.n - 2).odd_p()
}
