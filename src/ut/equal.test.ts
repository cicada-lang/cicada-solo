import assert from "assert"
import * as ut from "./index"

{
  let x = [1, 2, new Set([1, 2, [1, 2, 3]])]
  let y = [1, 2, new Set([1, 2, [1, 2, 3]])]
  assert(ut.equal(x, y))
}

{
  let x = new Map().set("a", "a").set("b", "b").set("c", "c")
  let y = new Map().set("c", "c").set("b", "b").set("a", "a")
  assert(ut.equal(x, y))
}

{
  let x = [1, { x: "x", y: "y" }, new Set([1, 2, [1, 2, { x: "x", y: "y" }]])]
  let y = [1, { x: "x", y: "y" }, new Set([1, 2, [1, 2, { x: "x", y: "y" }]])]
  assert(ut.equal(x, y))
}

{
  function f(x: number): string {
    return `x: ${x}`
  }

  let x = [f, { x: "x", y: "y" }, new Set([1, 2, [1, 2, { x: "x", y: "y" }]])]
  let y = [f, { x: "x", y: "y" }, new Set([1, 2, [1, 2, { x: "x", y: "y" }]])]
  assert(ut.equal(x, y))
}

{
  function f(x: number): (y: number) => string {
    return (y: number) => `x: ${x}, y: ${y}`
  }

  let x = f(1)
  let y = f(1)
  assert(!ut.equal(x, y))
}
