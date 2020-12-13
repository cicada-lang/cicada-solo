import * as Exp from "../exp"
import * as Pattern from "../pattern"

export function equivalent(x: Exp.Exp, y: Exp.Exp): boolean {
  return alpha(x, y, {
    depth: 0,
    left_depths: new Map(),
    right_depths: new Map(),
  })
}

type AlphaCtx = {
  depth: number
  left_depths: Map<string, number>
  right_depths: Map<string, number>
}

function alpha(left: Exp.Exp, right: Exp.Exp, the: AlphaCtx): boolean {
  if (left.kind === "Exp.v" && right.kind === "Exp.v") {
    const left_depth = the.left_depths.get(left.name)
    const right_depth = the.right_depths.get(right.name)
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
        left_depths: new Map([...the.left_depths, [left.name, the.depth]]),
        right_depths: new Map([...the.right_depths, [right.name, the.depth]]),
      })
    )

  if (left.kind === "Exp.fn" && right.kind === "Exp.fn") {
    const next = match_pattern(left.pattern, right.pattern, the)
    if (next === undefined) return false
    return alpha(left.ret, right.ret, next)
  }

  if (left.kind === "Exp.case_fn" && right.kind === "Exp.case_fn")
    return alpha_case_fn(left, right, the)

  if (left.kind === "Exp.ap" && right.kind === "Exp.ap")
    return (
      alpha(left.target, right.target, the) && alpha(left.arg, right.arg, the)
    )

  if (left.kind === "Exp.dot" && right.kind === "Exp.dot")
    return alpha(left.target, right.target, the) && left.name === right.name

  if (left.kind === "Exp.cls" && right.kind === "Exp.cls")
    return alpha_cls(left, right, the)

  if (left.kind === "Exp.obj" && right.kind === "Exp.obj")
    return alpha_obj(left, right, the)

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

  if (left.kind === "Exp.absurd" && right.kind === "Exp.absurd") return true

  if (left.kind === "Exp.absurd_ind" && right.kind === "Exp.absurd_ind")
    return (
      alpha(left.target, right.target, the) &&
      alpha(left.motive, right.motive, the)
    )

  if (left.kind === "Exp.str" && right.kind === "Exp.str") return true

  if (left.kind === "Exp.quote" && right.kind === "Exp.quote")
    return left.str === right.str

  if (left.kind === "Exp.union" && right.kind === "Exp.union") {
    // NOTE handle associativity and commutative of union
    const left_types = union_flatten(left)
    const right_types = union_flatten(right)
    return (
      left_types.every((left_t) =>
        right_types.some((right_t) => alpha(left_t, right_t, the))
      ) &&
      right_types.every((right_t) =>
        left_types.some((left_t) => alpha(left_t, right_t, the))
      )
    )
  }

  if (left.kind === "Exp.typecons" && right.kind === "Exp.typecons")
    // NOTE datatype can only be at top level.
    return left.name === right.name

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

function alpha_case_fn(
  left: Exp.case_fn,
  right: Exp.case_fn,
  the: AlphaCtx
): boolean {
  // NOTE the order matters.
  if (left.cases.length !== right.cases.length) return false

  for (let i = 0; i < left.cases.length; i++) {
    const left_fn = left.cases[i]
    const right_fn = right.cases[i]
    if (
      !alpha(
        Exp.fn(left_fn.pattern, left_fn.ret),
        Exp.fn(right_fn.pattern, right_fn.ret),
        the
      )
    )
      return false
  }

  return true
}

function alpha_cls(left: Exp.cls, right: Exp.cls, the: AlphaCtx): boolean {
  if (left.sat.length !== right.sat.length) return false

  for (let i = 0; i < left.sat.length; i++) {
    const left_entry = left.sat[i]
    const right_entry = right.sat[i]
    if (left_entry.name !== right_entry.name) return false
    if (!alpha(left_entry.t, right_entry.t, the)) return false
    if (!alpha(left_entry.exp, right_entry.exp, the)) return false
  }
  if (left.scope.length !== right.scope.length) {
    return false
  }
  for (let i = 0; i < left.scope.length; i++) {
    const left_entry = left.scope[i]
    const right_entry = right.scope[i]
    if (left_entry.name !== right_entry.name) return false
    if (!alpha(left_entry.t, right_entry.t, the)) return false
  }
  return true
}

function alpha_obj(left: Exp.obj, right: Exp.obj, the: AlphaCtx): boolean {
  if (left.properties.size !== right.properties.size) {
    return false
  }
  for (const name of left.properties.keys()) {
    const left_exp = left.properties.get(name)
    const right_exp = right.properties.get(name)
    if (left_exp === undefined) return false
    if (right_exp === undefined) return false
    if (!alpha(left_exp, right_exp, the)) return false
  }
  return true
}

function union_flatten(union: Exp.union): Array<Exp.Exp> {
  const { left, right } = union
  const left_parts = left.kind === "Exp.union" ? union_flatten(left) : [left]
  const right_parts =
    right.kind === "Exp.union" ? union_flatten(right) : [right]
  return [...left_parts, ...right_parts]
}

function match_pattern(
  left: Pattern.Pattern,
  right: Pattern.Pattern,
  the: AlphaCtx
): undefined | AlphaCtx {
  if (left.kind === "Pattern.v" && right.kind === "Pattern.v") {
    return {
      depth: the.depth + 1,
      left_depths: new Map([...the.left_depths, [left.name, the.depth]]),
      right_depths: new Map([...the.right_depths, [right.name, the.depth]]),
    }
  } else if (
    left.kind === "Pattern.datatype" &&
    right.kind === "Pattern.datatype" &&
    left.name === right.name
  ) {
    return match_patterns(left.args, right.args, the)
  } else if (
    left.kind === "Pattern.data" &&
    right.kind === "Pattern.data" &&
    left.name === right.name &&
    left.tag === right.tag
  ) {
    return match_patterns(left.args, right.args, the)
  } else {
    return undefined
  }
}

function match_patterns(
  left: Array<Pattern.Pattern>,
  right: Array<Pattern.Pattern>,
  the: AlphaCtx
): undefined | AlphaCtx {
  if (left.length !== right.length) return undefined

  let new_alpha_ctx = the
  for (let i = 0; i < left.length; i++) {
    const next = match_pattern(left[i], right[i], new_alpha_ctx)
    if (next === undefined) return undefined
    new_alpha_ctx = next
  }

  return new_alpha_ctx
}
