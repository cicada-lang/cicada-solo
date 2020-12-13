import * as Exp from "../exp"
import * as Pattern from "../pattern"

type AlphaCtx = {
  depth: number
  depths: Map<string, number>
}

export function prehash(exp: Exp.Exp): string {
  return alpha_prehash(exp, { depth: 0, depths: new Map() })
}

export function alpha_prehash(exp: Exp.Exp, the: AlphaCtx): string {
  switch (exp.kind) {
    case "Exp.v": {
      const { name } = exp
      const depth = the.depths.get(name)
      if (depth === undefined) return name
      else return depth.toString()
    }
    case "Exp.pi": {
      const { name, arg_t, ret_t } = exp
      const arg_t_repr = alpha_prehash(arg_t, the)
      const ret_t_repr = alpha_prehash(arg_t, {
        depth: the.depth + 1,
        depths: new Map([...the.depths, [name, the.depth]]),
      })
      return `(${arg_t_repr}) -> ${ret_t_repr}`
    }
    case "Exp.fn": {
      const { pattern, ret } = exp
      const [pattern_repr, new_alpha_ctx] = alpha_prehash_pattern(pattern, the)
      const ret_repr = alpha_prehash(ret, new_alpha_ctx)
      return `(${pattern_repr}) => ${ret_repr}`
    }
    case "Exp.case_fn": {
      const { cases } = exp
      return `TODO`
    }
    case "Exp.ap": {
      const { target, arg } = exp
      return `${alpha_prehash(target, the)}(${alpha_prehash(arg, the)})`
    }
    case "Exp.cls": {
      return `TODO`
    }
    case "Exp.obj": {
      return `TODO`
    }
    case "Exp.dot": {
      const { target, name } = exp
      return `${alpha_prehash(target, the)}.${name}`
    }
    case "Exp.equal": {
      const { t, from, to } = exp
      const t_repr = alpha_prehash(t, the)
      const from_repr = alpha_prehash(from, the)
      const to_repr = alpha_prehash(from, the)
      return `Equal(${t_repr}, ${from_repr}, ${to_repr})`
    }
    case "Exp.same": {
      return "same"
    }
    case "Exp.replace": {
      const { target, motive, base } = exp
      const target_repr = alpha_prehash(target, the)
      const motive_repr = alpha_prehash(motive, the)
      const base_repr = alpha_prehash(base, the)
      return `replace(${target_repr}, ${motive_repr}, ${base_repr})`
    }
    case "Exp.absurd": {
      return "Absurd"
    }
    case "Exp.absurd_ind": {
      const { target, motive } = exp
      const target_repr = alpha_prehash(target, the)
      const motive_repr = alpha_prehash(motive, the)
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
      return `TODO`
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
      return `TODO`
    }
    case "Exp.the": {
      const t_repr = alpha_prehash(exp.t, the)
      const exp_repr = alpha_prehash(exp.exp, the)
      return `{ ${t_repr} -- ${exp_repr} }`
    }
  }
}

function alpha_prehash_pattern(
  pattern: Pattern.Pattern,
  the: AlphaCtx
): [string, AlphaCtx] {
  switch (pattern.kind) {
    case "Pattern.v": {
      const { name } = pattern
      return [
        the.depth.toString(),
        {
          depth: the.depth + 1,
          depths: the.depths.set(name, the.depth),
        },
      ]
    }
    case "Pattern.datatype": {
      const { name, args } = pattern
      const [args_repr, next] = alpha_prehash_patterns(args, the)
      return [`${name}(${args_repr})`, next]
    }
    case "Pattern.data": {
      const { name, tag, args } = pattern
      const [args_repr, next] = alpha_prehash_patterns(args, the)
      return [`${name}.${tag}(${args_repr})`, next]
    }
  }
}

function alpha_prehash_patterns(
  patterns: Array<Pattern.Pattern>,
  the: AlphaCtx
): [string, AlphaCtx] {
  throw new Error("TODO")
}
