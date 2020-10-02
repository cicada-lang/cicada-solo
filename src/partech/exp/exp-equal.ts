import * as Exp from "../exp"

export function equal(x: Exp.Exp, y: Exp.Exp): boolean {
  if (x === y) return true
  if (x.kind === "Exp.v" && y.kind === "Exp.v") {
    return x.name === y.name
  } else if (x.kind === "Exp.fn" && y.kind === "Exp.fn") {
    return x.name === y.name && equal(x.ret, y.ret)
  } else if (x.kind === "Exp.ap" && y.kind === "Exp.ap") {
    return equal(x.target, y.target) && equal_exps(x.args, y.args)
  } else if (x.kind === "Exp.str" && y.kind === "Exp.str") {
    return x.value === y.value
  } else if (x.kind === "Exp.pattern" && y.kind === "Exp.pattern") {
    return x.label === y.label && x.value.toString() === y.value.toString()
  } else if (x.kind === "Exp.grammar" && y.kind === "Exp.grammar") {
    return x.name === y.name && equal_choices(x.choices, y.choices)
  } else {
    return false
  }
}

function equal_exps(x: Array<Exp.Exp>, y: Array<Exp.Exp>): boolean {
  if (x === y) return true
  if (x.length !== y.length) return false
  for (let i = 0; i < x.length; i++) {
    if (!equal(x[i], y[i])) return false
  }
  return true
}

export function equal_choices(
  x: Map<string, Array<{ name?: string; value: Exp.Exp }>>,
  y: Map<string, Array<{ name?: string; value: Exp.Exp }>>
): boolean {
  if (x === y) return true
  if (x.size !== y.size) return false
  for (const [key, x_part] of x.entries()) {
    const y_part = y.get(key)
    if (y_part === undefined) return false
    if (!equal_parts(x_part, y_part)) return false
  }
  return true
}

function equal_parts(
  x: Array<{ name?: string; value: Exp.Exp }>,
  y: Array<{ name?: string; value: Exp.Exp }>
): boolean {
  if (x === y) return true
  if (x.length !== y.length) return false
  for (let i = 0; i < x.length; i++) {
    if (x[i].name !== y[i].name) return false
    if (!Exp.equal(x[i].value, y[i].value)) return false
  }
  return true
}
