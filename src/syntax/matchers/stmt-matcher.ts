import pt from "@cicada-lang/partech"
import { Stmt } from "../../stmt"
import * as Stmts from "../../stmts"
import * as Exps from "../../exps"
import {
  exp_matcher,
  cls_entry_matcher,
  pi_handler,
  bindings_matcher,
} from "../matchers"

export function stmts_matcher(tree: pt.Tree): Array<Stmt> {
  return pt.matcher({
    "stmts:stmts": ({ stmts }) =>
      pt.matchers.zero_or_more_matcher(stmts).map(stmt_matcher),
  })(tree)
}

export function stmt_matcher(tree: pt.Tree): Stmt {
  return pt.matcher<Stmt>({
    "stmt:def": ({ name, exp }) =>
      new Stmts.Def(pt.str(name), exp_matcher(exp)),
    "stmt:def_the": ({ name, t, exp }) =>
      new Stmts.Def(
        pt.str(name),
        new Exps.The(exp_matcher(t), exp_matcher(exp))
      ),
    "stmt:def_fn": ({ name, bindings, ret_t, ret }) => {
      const fn = bindings_matcher(bindings)
        .reverse()
        .flatMap(({ names }) => names.reverse())
        .reduce((fn, name) => new Exps.Fn(name, fn), exp_matcher(ret))

      return new Stmts.Def(
        pt.str(name),
        new Exps.The(pi_handler({ bindings, ret_t }), fn)
      )
    },
    "stmt:show": ({ exp }) => new Stmts.Show(exp_matcher(exp)),
    "stmt:class": ({ name, entries }) =>
      new Stmts.Class(
        pt.str(name),
        new Exps.Cls(
          pt.matchers.zero_or_more_matcher(entries).map(cls_entry_matcher)
        )
      ),
    "stmt:class_extends": ({ name, parent_name, entries }) =>
      new Stmts.Class(
        pt.str(name),
        new Exps.Ext(
          pt.str(parent_name),
          pt.matchers.zero_or_more_matcher(entries).map(cls_entry_matcher)
        )
      ),
    "stmt:import": ({ path, entries }) => {
      return new Stmts.Import(
        pt.trim_boundary(pt.str(path), 1),
        pt.matchers.zero_or_more_matcher(entries).map(import_entry_matcher)
      )
    },
  })(tree)
}

export function import_entry_matcher(tree: pt.Tree): Stmts.ImportEntry {
  return pt.matcher({
    "import_entry:name": ({ name }) => ({ name: pt.str(name) }),
    "import_entry:name_alias": ({ name, alias }) => ({
      name: pt.str(name),
      alias: pt.str(alias),
    }),
  })(tree)
}
