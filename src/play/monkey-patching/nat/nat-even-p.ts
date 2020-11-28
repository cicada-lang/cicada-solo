import { Nat } from "."

declare module "./nat" {
  interface Nat {
    even_p(): boolean
  }
}

Nat.prototype.even_p = function () {
  if (this.n === 0) return true
  if (this.n === 1) return false
  else return Nat.create(this.n - 1).odd_p()
}
