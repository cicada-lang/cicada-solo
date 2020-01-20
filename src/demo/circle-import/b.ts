import { a } from "./a"

export function b(n: number): void {
  if (n > 0) {
    console.log("b:", n)
    a(n-1)
  }
}
