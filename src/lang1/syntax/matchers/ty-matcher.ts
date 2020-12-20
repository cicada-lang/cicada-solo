import { Ty } from "../../ty"
import { ArrowTy, NatTy } from "../../exps"
import * as pt from "../../../partech"

export function ty_matcher(tree: pt.Tree.Tree): Ty {
  return pt.Tree.matcher<Ty>({
    "ty:nat": () => NatTy,
    "ty:arrow": ({ arg_t, ret_t }) =>
      ArrowTy(ty_matcher(arg_t), ty_matcher(ret_t)),
  })(tree)
}
