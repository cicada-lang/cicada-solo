import * as Exp from "../exp"

export function equivalent(x: Exp.Exp, y: Exp.Exp): boolean {
  return alpha(x, y, {
    depth: 0,
    left_names: new Map(),
    right_names: new Map(),
  })
}

function alpha(
  left: Exp.Exp,
  right: Exp.Exp,
  the: {
    depth: number
    left_names: Map<string, number>
    right_names: Map<string, number>
  }
): boolean {
  if (left.kind === "Exp.v" && right.kind === "Exp.v") {
    const left_depth = the.left_names.get(left.name)
    const right_depth = the.right_names.get(right.name)
    return (
      (left_depth === undefined &&
        right_depth === undefined &&
        left.name === right.name) ||
      (typeof left_depth === "number" &&
        typeof right_depth === "number" &&
        left_depth === right_depth)
    )
  }

  if (left.kind === "Exp.pi" && right.kind === "Exp.pi")
    return (
      alpha(left.arg_t, right.arg_t, the) &&
      alpha(left.ret_t, right.ret_t, {
        depth: the.depth + 1,
        left_names: the.left_names.set(left.name, the.depth),
        right_names: the.right_names.set(right.name, the.depth),
      })
    )

  if (left.kind === "Exp.fn" && right.kind === "Exp.fn")
    return alpha(left.ret, right.ret, {
      depth: the.depth + 1,
      left_names: the.left_names.set(left.name, the.depth),
      right_names: the.right_names.set(right.name, the.depth),
    })

  if (left.kind === "Exp.ap" && right.kind === "Exp.ap")
    return (
      alpha(left.target, right.target, the) && alpha(left.arg, right.arg, the)
    )

  if (left.kind === "Exp.sigma" && right.kind === "Exp.sigma")
    return (
      alpha(left.car_t, right.car_t, the) &&
      alpha(left.cdr_t, right.cdr_t, {
        depth: the.depth + 1,
        left_names: the.left_names.set(left.name, the.depth),
        right_names: the.right_names.set(right.name, the.depth),
      })
    )

  if (left.kind === "Exp.cons" && right.kind === "Exp.cons")
    return alpha(left.car, right.car, the) && alpha(left.cdr, right.cdr, the)

  if (left.kind === "Exp.car" && right.kind === "Exp.car")
    return alpha(left.target, right.target, the)

  if (left.kind === "Exp.cdr" && right.kind === "Exp.cdr")
    return alpha(left.target, right.target, the)

  if (left.kind === "Exp.nat" && right.kind === "Exp.nat") return true

  if (left.kind === "Exp.zero" && right.kind === "Exp.zero") return true

  if (left.kind === "Exp.add1" && right.kind === "Exp.add1")
    return alpha(left.prev, right.prev, the)

  if (left.kind === "Exp.nat_ind" && right.kind === "Exp.nat_ind")
    return (
      alpha(left.target, right.target, the) &&
      alpha(left.motive, right.motive, the) &&
      alpha(left.base, right.base, the) &&
      alpha(left.step, right.step, the)
    )

  if (left.kind === "Exp.equal" && right.kind === "Exp.equal")
    return (
      alpha(left.t, right.t, the) &&
      alpha(left.from, right.from, the) &&
      alpha(left.to, right.to, the)
    )

  if (left.kind === "Exp.same" && right.kind === "Exp.same") return true

  if (left.kind === "Exp.replace" && right.kind === "Exp.replace")
    return (
      alpha(left.target, right.target, the) &&
      alpha(left.motive, right.motive, the) &&
      alpha(left.base, right.base, the)
    )

  if (left.kind === "Exp.trivial" && right.kind === "Exp.trivial") return true

  if (left.kind === "Exp.sole" && right.kind === "Exp.sole") return true

  if (left.kind === "Exp.absurd" && right.kind === "Exp.absurd") return true

  if (left.kind === "Exp.absurd_ind" && right.kind === "Exp.absurd_ind")
    return (
      alpha(left.target, right.target, the) &&
      alpha(left.motive, right.motive, the)
    )

  if (left.kind === "Exp.str" && right.kind === "Exp.str") return true

  if (left.kind === "Exp.quote" && right.kind === "Exp.quote")
    return left.str === right.str

  if (left.kind === "Exp.type" && right.kind === "Exp.type") return true

  if (
    left.kind === "Exp.the" &&
    left.t.kind === "Exp.absurd" &&
    right.kind === "Exp.the" &&
    right.t.kind === "Exp.absurd"
  )
    return true

  if (left.kind === "Exp.the" && right.kind === "Exp.the")
    return alpha(left.t, right.t, the) && alpha(left.exp, right.exp, the)

  return false
}
