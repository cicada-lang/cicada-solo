import * as church from "../church"

export function from_number(n: number): church.Numeral {
  if (n <= 0) {
    return (f) => (x) => x
  } else {
    const almost = from_number(n - 1)
    return (f) => (x) => almost(f)(f(x))
  }
}
