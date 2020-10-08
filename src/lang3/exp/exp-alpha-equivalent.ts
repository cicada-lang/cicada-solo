import * as Exp from "../exp"

export function alpha_equivalent(x: Exp.Exp, y: Exp.Exp): boolean {
  return alpha({
    depth: 0,
    left_names: new Map(),
    left: x,
    right_names: new Map(),
    right: y,
  })
}

function alpha(the: {
  depth: number
  left_names: Map<string, number>
  left: Exp.Exp
  right_names: Map<string, number>
  right: Exp.Exp
}): boolean {
  const { depth, left_names, left, right_names, right } = the
  if (left.kind === "Exp.v" && right.kind === "Exp.v") {
    const left_depth = left_names.get(left.name)
    const right_depth = right_names.get(right.name)
    return (
      (left_depth === undefined &&
        right_depth === undefined &&
        left.name === right.name) ||
      (typeof left_depth === "number" &&
        typeof right_depth === "number" &&
        left_depth === right_depth)
    )
  } else if (left.kind === "Exp.pi" && right.kind === "Exp.pi") {
    return (
      alpha({ ...the, left: left.arg_t, right: right.arg_t }) &&
      alpha({
        depth: depth + 1,
        left_names: left_names.set(left.name, depth),
        left: left.ret_t,
        right_names: right_names.set(right.name, depth),
        right: right.ret_t,
      })
    )
  } else if (left.kind === "Exp.fn" && right.kind === "Exp.fn") {
    return alpha({
      depth: depth + 1,
      left_names: left_names.set(left.name, depth),
      left: left.ret,
      right_names: right_names.set(right.name, depth),
      right: right.ret,
    })
  } else if (left.kind === "Exp.ap" && right.kind === "Exp.ap") {
    return (
      alpha({ ...the, left: left.target, right: right.target }) &&
      alpha({ ...the, left: left.arg, right: right.arg })
    )
  } else if (left.kind === "Exp.cls" && right.kind === "Exp.cls") {
    if (left.scope.length !== right.scope.length) {
      return false
    }
    for (let i = 0; i < left.scope.length; i++) {
      const left_entry = left.scope[i]
      const right_entry = right.scope[i]
      if (left_entry.name !== right_entry.name) return false
      if (!alpha({ ...the, left: left_entry.t, right: right_entry.t })) return false
    }
    return true
  } else if (left.kind === "Exp.fill" && right.kind === "Exp.fill") {
    return (
      alpha({ ...the, left: left.target, right: right.target }) &&
      alpha({ ...the, left: left.arg, right: right.arg })
    )
  } else if (left.kind === "Exp.obj" && right.kind === "Exp.obj") {
    if (left.properties.size !== right.properties.size) {
      return false
    }
    for (const name of left.properties.keys()) {
      const left_exp = left.properties.get(name)
      const right_exp = right.properties.get(name)
      if (left_exp === undefined) return false
      if (right_exp === undefined) return false
      if (!alpha({ ...the, left: left_exp, right: right_exp })) return false
    }
    return true
  } else if (left.kind === "Exp.equal" && right.kind === "Exp.equal") {
    return (
      alpha({ ...the, left: left.t, right: right.t }) &&
      alpha({ ...the, left: left.from, right: right.from }) &&
      alpha({ ...the, left: left.to, right: right.to })
    )
  } else if (left.kind === "Exp.same" && right.kind === "Exp.same") {
    return true
  } else if (left.kind === "Exp.replace" && right.kind === "Exp.replace") {
    return (
      alpha({ ...the, left: left.target, right: right.target }) &&
      alpha({ ...the, left: left.motive, right: right.motive }) &&
      alpha({ ...the, left: left.base, right: right.base })
    )
  } else if (left.kind === "Exp.absurd" && right.kind === "Exp.absurd") {
    return true
  } else if (
    left.kind === "Exp.absurd_ind" &&
    right.kind === "Exp.absurd_ind"
  ) {
    return (
      alpha({ ...the, left: left.target, right: right.target }) &&
      alpha({ ...the, left: left.motive, right: right.motive })
    )
  } else if (left.kind === "Exp.str" && right.kind === "Exp.str") {
    return true
  } else if (left.kind === "Exp.quote" && right.kind === "Exp.quote") {
    return left.str === right.str
  } else if (left.kind === "Exp.type" && right.kind === "Exp.type") {
    return true
  } else if (
    left.kind === "Exp.the" &&
    left.t.kind === "Exp.absurd" &&
    right.kind === "Exp.the" &&
    right.t.kind === "Exp.absurd"
  ) {
    return true
  } else if (left.kind === "Exp.the" && right.kind === "Exp.the") {
    return (
      alpha({ ...the, left: left.t, right: right.t }) &&
      alpha({ ...the, left: left.exp, right: right.exp })
    )
  } else {
    return false
  }
}
