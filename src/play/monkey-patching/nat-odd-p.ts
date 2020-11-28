import { Nat } from "./nat"

declare module "./nat" {
  interface Nat {
    odd_p(): boolean
  }
}

Nat.prototype.odd_p = function () {
  if (this.n === 1) return true
  else return Nat.create(this.n - 2).even_p()
}
