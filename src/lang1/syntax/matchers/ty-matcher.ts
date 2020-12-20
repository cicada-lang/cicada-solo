import { Ty } from "../../ty"
import { Arrow, Nat } from "../../exps"
import * as pt from "../../../partech"

export function ty_matcher(tree: pt.Tree.Tree): Ty {
  return pt.Tree.matcher<Ty>({
    "ty:nat": () => Nat,
    "ty:arrow": ({ arg_t, ret_t }) =>
      Arrow(ty_matcher(arg_t), ty_matcher(ret_t)),
  })(tree)
}
