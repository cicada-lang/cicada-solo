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
      const { name, arg_t, ret_t } = exp
      const arg_t_repr = alpha_repr(arg_t, opts)
      const ret_t_repr = alpha_repr(arg_t, {
        depth: opts.depth + 1,
        depths: new Map([...opts.depths, [name, opts.depth]]),
      })
      return `(${arg_t_repr}) -> ${ret_t_repr}`
    }
    case "Exp.fn": {
      const { pattern, ret } = exp
      const [pattern_repr, next] = alpha_repr_pattern(pattern, opts)
      const ret_repr = alpha_repr(ret, next)
      return `(${pattern_repr}) => ${ret_repr}`
    }
    case "Exp.case_fn": {
      const { cases } = exp
      const parts = cases.map(({ pattern, ret }) => {
        const [pattern_repr, next] = alpha_repr_pattern(pattern, opts)
        const ret_repr = alpha_repr(ret, next)
        return `(${pattern_repr}) => ${ret_repr}`
      })
      const s = parts.join("\n")
      return `{\n${ut.indent(s, "  ")}\n}`
    }
    case "Exp.ap": {
      const { target, arg } = exp
      return `${alpha_repr(target, opts)}(${alpha_repr(arg, opts)})`
    }
    case "Exp.cls": {
      const { sat, scope } = exp
      if (sat.length === 0 && scope.length === 0) return "Object"
      const parts = []
      let new_alpha_ctx = opts
      for (const { name, t, exp } of sat) {
        const t_repr = alpha_repr(t, new_alpha_ctx)
        const exp_repr = alpha_repr(exp, new_alpha_ctx)
        parts.push(`${name} : ${t_repr} = ${exp_repr}`)
        new_alpha_ctx = {
          depth: new_alpha_ctx.depth + 1,
          depths: new Map([
            ...new_alpha_ctx.depths,
            [name, new_alpha_ctx.depth],
          ]),
        }
      }
      for (const { name, t } of scope) {
        const t_repr = alpha_repr(t, new_alpha_ctx)
        parts.push(`${name} : ${t_repr}`)
        new_alpha_ctx = {
          depth: new_alpha_ctx.depth + 1,
          depths: new Map([
            ...new_alpha_ctx.depths,
            [name, new_alpha_ctx.depth],
          ]),
        }
      }
      let s = parts.join("\n")
      return `{\n${ut.indent(s, "  ")}\n}`
    }
    case "Exp.obj": {
      const { properties } = exp
      const s = Array.from(properties)
        .map(([name, exp]) => `${name} = ${alpha_repr(exp, opts)}`)
        .join("\n")
      return `{\n${ut.indent(s, "  ")}\n}`
    }
    case "Exp.dot": {
      const { target, name } = exp
      return `${alpha_repr(target, opts)}.${name}`
    }
    case "Exp.equal": {
      const { t, from, to } = exp
      const t_repr = alpha_repr(t, opts)
      const from_repr = alpha_repr(from, opts)
      const to_repr = alpha_repr(from, opts)
      return `Equal(${t_repr}, ${from_repr}, ${to_repr})`
    }
    case "Exp.same": {
      return "same"
    }
    case "Exp.replace": {
      const { target, motive, base } = exp
      const target_repr = alpha_repr(target, opts)
      const motive_repr = alpha_repr(motive, opts)
      const base_repr = alpha_repr(base, opts)
      return `replace(${target_repr}, ${motive_repr}, ${base_repr})`
    }
    case "Exp.absurd": {
      return exp.alpha_repr(opts)
    }
    case "Exp.absurd_ind": {
      return exp.alpha_repr(opts)
    }
    case "Exp.str": {
      return "String"
    }
    case "Exp.quote": {
      const { str } = exp
      return `"${str}"`
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
      return "Type"
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

function alpha_repr_pattern(
  pattern: Pattern.Pattern,
  opts: AlphaReprOpts
): [string, AlphaReprOpts] {
  switch (pattern.kind) {
    case "Pattern.v": {
      const { name } = pattern
      return [
        opts.depth.toString(),
        {
          depth: opts.depth + 1,
          depths: new Map([...opts.depths, [name, opts.depth]]),
        },
      ]
    }
    case "Pattern.datatype": {
      const { name, args } = pattern
      const [args_repr, next] = alpha_repr_patterns(args, opts)
      return [`${name}(${args_repr})`, next]
    }
    case "Pattern.data": {
      const { name, tag, args } = pattern
      const [args_repr, next] = alpha_repr_patterns(args, opts)
      return [`${name}.${tag}(${args_repr})`, next]
    }
  }
}

function alpha_repr_patterns(
  patterns: Array<Pattern.Pattern>,
  opts: AlphaReprOpts
): [string, AlphaReprOpts] {
  let new_alpha_ctx = opts
  const parts = []
  for (const pattern of patterns) {
    const [repr, next] = alpha_repr_pattern(pattern, new_alpha_ctx)
    new_alpha_ctx = next
    parts.push(repr)
  }

  return [parts.join(", "), new_alpha_ctx]
}

function union_flatten(union: Exp.union): Array<Exp.Exp> {
  const { left, right } = union
  const left_parts = left.kind === "Exp.union" ? union_flatten(left) : [left]
  const right_parts =
    right.kind === "Exp.union" ? union_flatten(right) : [right]
  return [...left_parts, ...right_parts]
}
