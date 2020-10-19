import * as church from "../church"

export function to_number(numeral: church.Numeral): number {
  return numeral((n) => n + 1)(0)
}
