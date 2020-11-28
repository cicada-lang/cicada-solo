export class Nat {
  n: number

  constructor(n: number) {
    if (!Number.isInteger(n)) throw new Error("Expecting integer")
    if (n < 0) throw new Error("Expecting non negative number")
    this.n = n
  }
}
