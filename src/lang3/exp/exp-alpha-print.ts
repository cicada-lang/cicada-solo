import * as Exp from "../exp"
import * as Pattern from "../pattern"
import * as ut from "../../ut"

type AlphaPrintCtx = {
  depth: number
  depths: Map<string, number>
}

export function alpha_print(exp: Exp.Exp, the: AlphaPrintCtx): string {
  switch (exp.kind) {
    case "Exp.v": {
      const { name } = exp
      const depth = the.depths.get(name)
      if (depth === undefined) return name
      else return depth.toString()
    }
    case "Exp.pi": {
      const { name, arg_t, ret_t } = exp
      const arg_t_repr = alpha_print(arg_t, the)
      const ret_t_repr = alpha_print(arg_t, {
        depth: the.depth + 1,
        depths: new Map([...the.depths, [name, the.depth]]),
      })
      return `(${arg_t_repr}) -> ${ret_t_repr}`
    }
    case "Exp.fn": {
      const { pattern, ret } = exp
      const [pattern_repr, next] = alpha_print_pattern(pattern, the)
      const ret_repr = alpha_print(ret, next)
      return `(${pattern_repr}) => ${ret_repr}`
    }
    case "Exp.case_fn": {
      const { cases } = exp
      const parts = cases.map(({ pattern, ret }) => {
        const [pattern_repr, next] = alpha_print_pattern(pattern, the)
        const ret_repr = alpha_print(ret, next)
        return `(${pattern_repr}) => ${ret_repr}`
      })
      const s = parts.join("\n")
      return `{\n${ut.indent(s, "  ")}\n}`
    }
    case "Exp.ap": {
      const { target, arg } = exp
      return `${alpha_print(target, the)}(${alpha_print(arg, the)})`
    }
    case "Exp.cls": {
      const { sat, scope } = exp
      if (sat.length === 0 && scope.length === 0) return "Object"
      const parts = []
      let new_alpha_ctx = the
      for (const { name, t, exp } of sat) {
        const t_repr = alpha_print(t, new_alpha_ctx)
        const exp_repr = alpha_print(exp, new_alpha_ctx)
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
        const t_repr = alpha_print(t, new_alpha_ctx)
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
        .map(([name, exp]) => `${name} = ${alpha_print(exp, the)}`)
        .join("\n")
      return `{\n${ut.indent(s, "  ")}\n}`
    }
    case "Exp.dot": {
      const { target, name } = exp
      return `${alpha_print(target, the)}.${name}`
    }
    case "Exp.equal": {
      const { t, from, to } = exp
      const t_repr = alpha_print(t, the)
      const from_repr = alpha_print(from, the)
      const to_repr = alpha_print(from, the)
      return `Equal(${t_repr}, ${from_repr}, ${to_repr})`
    }
    case "Exp.same": {
      return "same"
    }
    case "Exp.replace": {
      const { target, motive, base } = exp
      const target_repr = alpha_print(target, the)
      const motive_repr = alpha_print(motive, the)
      const base_repr = alpha_print(base, the)
      return `replace(${target_repr}, ${motive_repr}, ${base_repr})`
    }
    case "Exp.absurd": {
      return "Absurd"
    }
    case "Exp.absurd_ind": {
      const { target, motive } = exp
      const target_repr = alpha_print(target, the)
      const motive_repr = alpha_print(motive, the)
      return `absurd_ind(${target_repr}, ${motive_repr})`
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
      const parts = exps.map((exp) => alpha_print(exp, the)).sort()
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
      throw new Error("TODO")
    }
    case "Exp.the": {
      const t_repr = alpha_print(exp.t, the)
      const exp_repr = alpha_print(exp.exp, the)
      return `{ ${t_repr} -- ${exp_repr} }`
    }
  }
}

function alpha_print_pattern(
  pattern: Pattern.Pattern,
  the: AlphaPrintCtx
): [string, AlphaPrintCtx] {
  switch (pattern.kind) {
    case "Pattern.v": {
      const { name } = pattern
      return [
        the.depth.toString(),
        {
          depth: the.depth + 1,
          depths: new Map([...the.depths, [name, the.depth]]),
        },
      ]
    }
    case "Pattern.datatype": {
      const { name, args } = pattern
      const [args_repr, next] = alpha_print_patterns(args, the)
      return [`${name}(${args_repr})`, next]
    }
    case "Pattern.data": {
      const { name, tag, args } = pattern
      const [args_repr, next] = alpha_print_patterns(args, the)
      return [`${name}.${tag}(${args_repr})`, next]
    }
  }
}

function alpha_print_patterns(
  patterns: Array<Pattern.Pattern>,
  the: AlphaPrintCtx
): [string, AlphaPrintCtx] {
  let new_alpha_ctx = the
  const parts = []
  for (const pattern of patterns) {
    const [repr, next] = alpha_print_pattern(pattern, new_alpha_ctx)
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
