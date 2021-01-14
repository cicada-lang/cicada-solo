import * as pt from "../../../partech"
import { Jo } from "../../jo"
import { Var, Let } from "../../jos"
import { JoJo, Execute } from "../../jos"
import { StrLit } from "../../jos"
import { SymLit } from "../../jos"
import { NumLit } from "../../jos"

export function jo_matcher(tree: pt.Tree.Tree): Jo {
  return pt.Tree.matcher<Jo>({
    "jo:var": ({ name }) => Var(pt.Tree.str(name)),
    "jo:let": ({ name }) => Let(pt.Tree.str(name)),
    "jo:jojo": ({ jojo }) => jojo_matcher(jojo),
    "jo:execute": (_) => Execute,
    "jo:str_lit": ({ value }) =>
      StrLit(pt.trim_boundary(pt.Tree.str(value), 1)),
    "jo:sym_lit": ({ value }) => SymLit(pt.Tree.str(value)),
    "jo:num_lit": ({ value }) => NumLit(Number.parseFloat(pt.Tree.str(value))),
  })(tree)
}

export function jos_matcher(tree: pt.Tree.Tree): Array<Jo> {
  return pt.Tree.matcher<Array<Jo>>({
    "jos:jos": ({ jos }) =>
      pt.matchers.zero_or_more_matcher(jos).map(jo_matcher),
  })(tree)
}

export function jojo_matcher(tree: pt.Tree.Tree): JoJo {
  return pt.Tree.matcher<JoJo>({
    "jojo:jojo": ({ jos }) => JoJo(jos_matcher(jos)),
  })(tree)
}
