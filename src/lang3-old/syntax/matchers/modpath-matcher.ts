import * as Modpath from "../../modpath"
import * as pt from "../../../partech"

export function modpath_matcher(tree: pt.Tree.Tree): Modpath.Modpath {
  return pt.Tree.matcher<Modpath.Modpath>({
    "modpath:modpath": ({ prefix, name }) => ({
      prefix: pt.matchers
        .zero_or_more_matcher(prefix)
        .map(modpath_entry_matcher),
      name: pt.Tree.str(name),
    }),
  })(tree)
}

export function modpath_entry_matcher(tree: pt.Tree.Tree): string {
  return pt.Tree.matcher<string>({
    "modpath_entry:modpath_entry": ({ name }) => pt.Tree.str(name),
  })(tree)
}
