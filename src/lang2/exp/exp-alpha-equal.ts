import * as Exp from "../exp"

export function alpha_equal(x: Exp.Exp, y: Exp.Exp): boolean {
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
  if (left.kind === "Exp.Var" && right.kind === "Exp.Var") {
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
  } else if (left.kind === "Exp.Pi" && right.kind === "Exp.Pi") {
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
  } else if (left.kind === "Exp.Fn" && right.kind === "Exp.Fn") {
    return alpha({
      depth: depth + 1,
      left_names: left_names.set(left.name, depth),
      left: left.body,
      right_names: right_names.set(right.name, depth),
      right: right.body,
    })
  } else if (left.kind === "Exp.Ap" && right.kind === "Exp.Ap") {
    return (
      alpha({ ...the, left: left.target, right: right.target }) &&
      alpha({ ...the, left: left.arg, right: right.arg })
    )
  } else if (left.kind === "Exp.Sigma" && right.kind === "Exp.Sigma") {
    return (
      alpha({ ...the, left: left.car_t, right: right.car_t }) &&
      alpha({
        depth: depth + 1,
        left_names: left_names.set(left.name, depth),
        left: left.cdr_t,
        right_names: right_names.set(right.name, depth),
        right: right.cdr_t,
      })
    )
  } else if (left.kind === "Exp.Cons" && right.kind === "Exp.Cons") {
    return (
      alpha({ ...the, left: left.car, right: right.car }) &&
      alpha({ ...the, left: left.cdr, right: right.cdr })
    )
  } else if (left.kind === "Exp.Car" && right.kind === "Exp.Car") {
    return alpha({ ...the, left: left.target, right: right.target })
  } else if (left.kind === "Exp.Cdr" && right.kind === "Exp.Cdr") {
    return alpha({ ...the, left: left.target, right: right.target })
  } else if (left.kind === "Exp.Nat" && right.kind === "Exp.Nat") {
    return true
  } else if (left.kind === "Exp.Zero" && right.kind === "Exp.Zero") {
    return true
  } else if (left.kind === "Exp.Succ" && right.kind === "Exp.Succ") {
    return alpha({ ...the, left: left.prev, right: right.prev })
  } else if (left.kind === "Exp.NatInd" && right.kind === "Exp.NatInd") {
    return (
      alpha({ ...the, left: left.target, right: right.target }) &&
      alpha({ ...the, left: left.motive, right: right.motive }) &&
      alpha({ ...the, left: left.base, right: right.base }) &&
      alpha({ ...the, left: left.step, right: right.step })
    )
  } else if (left.kind === "Exp.Equal" && right.kind === "Exp.Equal") {
    return (
      alpha({ ...the, left: left.t, right: right.t }) &&
      alpha({ ...the, left: left.from, right: right.from }) &&
      alpha({ ...the, left: left.to, right: right.to })
    )
  } else if (left.kind === "Exp.Same" && right.kind === "Exp.Same") {
    return true
  } else if (left.kind === "Exp.Replace" && right.kind === "Exp.Replace") {
    return (
      alpha({ ...the, left: left.target, right: right.target }) &&
      alpha({ ...the, left: left.motive, right: right.motive }) &&
      alpha({ ...the, left: left.base, right: right.base })
    )
  } else if (left.kind === "Exp.Trivial" && right.kind === "Exp.Trivial") {
    return true
  } else if (left.kind === "Exp.Sole" && right.kind === "Exp.Sole") {
    return true
  } else if (left.kind === "Exp.Absurd" && right.kind === "Exp.Absurd") {
    return true
  } else if (left.kind === "Exp.AbsurdInd" && right.kind === "Exp.AbsurdInd") {
    return (
      alpha({ ...the, left: left.target, right: right.target }) &&
      alpha({ ...the, left: left.motive, right: right.motive })
    )
  } else if (left.kind === "Exp.Str" && right.kind === "Exp.Str") {
    return true
  } else if (left.kind === "Exp.Quote" && right.kind === "Exp.Quote") {
    return left.str === right.str
  } else if (left.kind === "Exp.Type" && right.kind === "Exp.Type") {
    return true
  } else if (
    left.kind === "Exp.The" &&
    left.t.kind === "Exp.Absurd" &&
    right.kind === "Exp.The" &&
    right.t.kind === "Exp.Absurd"
  ) {
    return true
  } else if (left.kind === "Exp.The" && right.kind === "Exp.The") {
    return (
      alpha({ ...the, left: left.t, right: right.t }) &&
      alpha({ ...the, left: left.exp, right: right.exp })
    )
  } else {
    return false
  }
}
