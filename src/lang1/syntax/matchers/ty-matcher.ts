import * as Ty from "../../ty"
import * as pt from "../../../partech"

export function ty_matcher(tree: pt.Tree.Tree): Ty.Ty {
  return pt.Tree.matcher<Ty.Ty>({
    "ty:nat": () => Ty.nat,
    "ty:arrow": ({ arg_t, ret_t }) =>
      Ty.arrow(ty_matcher(arg_t), ty_matcher(ret_t)),
  })(tree)
}
