import * as Value from "../value"

export function equal(x: Value.Value, y: Value.Value): boolean {
  if (x === y) return true
  if (x.kind === "Value.fn" && y.kind === "Value.fn") {
    return Value.Closure.equal(x.ret_cl, y.ret_cl)
  } else if (x.kind === "Value.str" && y.kind === "Value.str") {
    return x.value === y.value
  } else if (x.kind === "Value.pattern" && y.kind === "Value.pattern") {
    return x.label === y.label && x.value.toString() === y.value.toString()
  } else if (x.kind === "Value.grammar" && y.kind === "Value.grammar") {
    return x.name === y.name && Value.DelayedChoices.equal(x.delayed, y.delayed)
  } else {
    return false
  }
}

export function equal_parts(
  x: Array<{ name?: string; value: Value.Value }>,
  y: Array<{ name?: string; value: Value.Value }>
): boolean {
  if (x === y) return true
  if (x.length !== y.length) return false
  for (let i = 0; i < x.length; i++) {
    if (x[i].name !== y[i].name) return false
    if (!equal(x[i].value, y[i].value)) return false
  }
  return true
}
