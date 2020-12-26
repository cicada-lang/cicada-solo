import * as pt from "../../../partech"
import { Jo } from "../../jo"
import { Var, Let } from "../../jos"
import { Arrow, JoJo } from "../../jos"
import { Str, StrLit } from "../../jos"
import { Sym, SymLit } from "../../jos"
import { Type } from "../../jos"

export function jo_matcher(tree: pt.Tree.Tree): Jo {
  return pt.Tree.matcher<Jo>({
    "jo:var": ({ name }) => Var(pt.Tree.str(name)),
    "jo:let": ({ name }) => Let(pt.Tree.str(name)),
    "jo:arrow": ({ pre, post }) => Arrow(jojo_matcher(pre), jojo_matcher(post)),
    "jo:jojo": ({ jojo }) => jojo_matcher(jojo),
    "jo:str": (_) => Str,
    "jo:str_lit": ({ value }) => {
      const str = pt.Tree.str(value)
      return StrLit(str.slice(1, str.length - 1))
    },
    "jo:sym": (_) => Sym,
    "jo:sym_lit": ({ symbol }) => SymLit(pt.Tree.str(symbol)),
    "jo:type": (_) => Type,
  })(tree)
}

export function jojo_matcher(tree: pt.Tree.Tree): JoJo {
  return pt.Tree.matcher<JoJo>({
    "jojo:jojo": ({ jos }) =>
      JoJo(pt.matchers.zero_or_more_matcher(jos).map(jo_matcher)),
  })(tree)
}
