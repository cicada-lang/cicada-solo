import { b } from "./b"

export function a(n: number): void {
  if (n > 0) {
    console.log("a:", n)
    b(n-1)
  }
}
