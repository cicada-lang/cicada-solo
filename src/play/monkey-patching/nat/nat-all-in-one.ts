export class Nat {
  n: number

  constructor(n: number) {
    if (!Number.isInteger(n)) throw new Error("Expecting integer")
    if (n < 0) throw new Error("Expecting non negative number")
    this.n = n
  }

  static create(n: number): Nat {
    return new Nat(n)
  }

  even_p(): boolean {
    if (this.n === 0) return true
    if (this.n === 1) return false
    else return Nat.create(this.n - 1).odd_p()
  }

  odd_p(): boolean {
    if (this.n === 0) return false
    if (this.n === 1) return true
    else return Nat.create(this.n - 1).even_p()
  }
}
