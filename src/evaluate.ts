import { check } from "./check"

export function evaluate(n: number): void {
  if (n > 0) {
    console.log("evaluate:", n)
    check(n-1)
  }
}
