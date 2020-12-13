import * as Exp from "../exp"
import * as Pattern from "../pattern"
import * as ut from "../../ut"

type AlphaReprOpts = {
  depth: number
  depths: Map<string, number>
}

export function alpha_repr(exp: Exp.Exp, opts: AlphaReprOpts): string {
  switch (exp.kind) {
    case "Exp.v": {
      const { name } = exp
      const depth = opts.depths.get(name)
      if (depth === undefined) return name
      else return depth.toString()
    }
    case "Exp.pi": {
      return exp.alpha_repr(opts)
    }
    case "Exp.fn": {
      return exp.alpha_repr(opts)
    }
    case "Exp.case_fn": {
      return exp.alpha_repr(opts)
    }
    case "Exp.ap": {
      return exp.alpha_repr(opts)
    }
    case "Exp.cls": {
      return exp.alpha_repr(opts)
    }
    case "Exp.obj": {
      return exp.alpha_repr(opts)
    }
    case "Exp.dot": {
      return exp.alpha_repr(opts)
    }
    case "Exp.equal": {
      return exp.alpha_repr(opts)
    }
    case "Exp.same": {
      return exp.alpha_repr(opts)
    }
    case "Exp.replace": {
      return exp.alpha_repr(opts)
    }
    case "Exp.absurd": {
      return exp.alpha_repr(opts)
    }
    case "Exp.absurd_ind": {
      return exp.alpha_repr(opts)
    }
    case "Exp.str": {
      return exp.alpha_repr(opts)
    }
    case "Exp.quote": {
      return exp.alpha_repr(opts)
    }
    case "Exp.union": {
      // NOTE handle associativity and commutative of union
      const exps = union_flatten(exp)
      const parts = exps.map((exp) => alpha_repr(exp, opts)).sort()
      return `{ ${parts.join("\n")} }`
    }
    case "Exp.typecons": {
      // NOTE datatype can only be at top level.
      const { name } = exp
      return name
    }
    case "Exp.type": {
      return exp.alpha_repr(opts)
    }
    case "Exp.begin": {
      return exp.alpha_repr(opts)
    }
    case "Exp.the": {
      const t_repr = alpha_repr(exp.t, opts)
      const exp_repr = alpha_repr(exp.exp, opts)
      return `{ ${t_repr} -- ${exp_repr} }`
    }
  }
}

function union_flatten(union: Exp.union): Array<Exp.Exp> {
  const { left, right } = union
  const left_parts = left.kind === "Exp.union" ? union_flatten(left) : [left]
  const right_parts =
    right.kind === "Exp.union" ? union_flatten(right) : [right]
  return [...left_parts, ...right_parts]
}
