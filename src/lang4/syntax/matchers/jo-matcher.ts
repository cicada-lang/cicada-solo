import * as pt from "../../../partech"
import { Jo } from "../../jo"
import { Var, Let } from "../../jos"
import { JoJo } from "../../jos"
import { Str, Quote } from "../../jos"
import { Type } from "../../jos"

export function jo_matcher(tree: pt.Tree.Tree): Jo {
  return pt.Tree.matcher<Jo>({
    "jo:var": ({ name }) => Var(pt.Tree.str(name)),
    "jo:let": ({ name }) => Let(pt.Tree.str(name)),
    "jo:jojo": ({ jojo }) => jojo_matcher(jojo),
    "jo:str": (_) => Str,
    "jo:quote": ({ value }) => {
      const str = pt.Tree.str(value)
      return Quote(str.slice(1, str.length - 1))
    },
    "jo:type": (_) => Type,
  })(tree)
}

export function jojo_matcher(tree: pt.Tree.Tree): JoJo {
  return pt.Tree.matcher<JoJo>({
    "jojo:jojo": ({ jos }) =>
      JoJo(pt.matchers.zero_or_more_matcher(jos).map(jo_matcher)),
  })(tree)
}
