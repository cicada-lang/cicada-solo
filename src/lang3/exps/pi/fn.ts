import { Evaluable } from "../../evaluable"
import { Checkable } from "../../checkable"
import { Inferable, non_inferable } from "../../inferable"
import { Exp } from "../../exp"
import { Repr } from "../../repr"
import { AlphaRepr, AlphaReprOpts } from "../../alpha-repr"
import * as Pattern from "../../pattern"
import { fn_evaluable } from "./fn-evaluable"
import { fn_checkable } from "./fn-checkable"

export type Fn = Evaluable &
  Checkable &
  Inferable &
  Repr &
  AlphaRepr & {
    kind: "Exp.fn"
    pattern: Pattern.Pattern
    ret: Exp
  }

export function Fn(pattern: Pattern.Pattern, ret: Exp): Fn {
  return {
    kind: "Exp.fn",
    pattern,
    ret,
    ...fn_evaluable(pattern, ret),
    ...fn_checkable(pattern, ret),
    ...non_inferable,
    repr: () => `(${Pattern.repr(pattern)}) => ${ret.repr()}`,
    alpha_repr: (opts) => {
      const [pattern_repr, next] = alpha_repr_pattern(pattern, opts)
      const ret_repr = ret.alpha_repr(next)
      return `(${pattern_repr}) => ${ret_repr}`
    },
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
