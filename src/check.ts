import { evaluate } from "./evaluate"

export function check(n: number): void {
  if (n > 0) {
    console.log("check:", n)
    evaluate(n-1)
  }
}
