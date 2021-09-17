import pt from "@cicada-lang/partech"
import { Stmt } from "../../stmt"
import * as Stmts from "../../stmts"
import * as Exps from "../../exps"
import {
  exp_matcher,
  operator_matcher,
  operand_matcher,
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
        .flatMap(({ given, names }) =>
          names.map((name) => ({ given, name })).reverse()
        )
        .reduce((result, { given, name }) => {
          if (given) {
            if (!(result instanceof Exps.Fn || result instanceof Exps.FnIm)) {
              throw new Error(
                [
                  `When reducing given names,`,
                  `I expects the result to be Exps.Fn or Exps.FnIm`,
                  `  result class name: ${result.constructor.name}`,
                ].join("\n")
              )
            }
            return new Exps.FnIm(name, result)
          } else {
            return new Exps.Fn(name, result)
          }
        }, exp_matcher(ret))

      return new Stmts.Def(
        pt.str(name),
        new Exps.The(pi_handler({ bindings, ret_t }), fn)
      )
    },
    "stmt:show_operator": ({ operator }) =>
      new Stmts.Show(operator_matcher(operator)),
    "stmt:show_operand": ({ operand }) =>
      new Stmts.Show(operand_matcher(operand)),
    "stmt:class": ({ name, entries }) =>
      new Stmts.Class(
        pt.str(name),
        pt.matchers
          .zero_or_more_matcher(entries)
          .map(cls_entry_matcher)
          .reverse()
          .reduce(
            (rest_t, entry) =>
              new Exps.ClsCons(
                entry.field_name,
                entry.field_name,
                entry.field_t,
                rest_t
              ),
            new Exps.ClsNil()
          )
      ),
    "stmt:class_extends": ({ name, parent, entries }) =>
      new Stmts.ClassExtends(
        pt.str(name),
        new Exps.Ext(
          operator_matcher(parent),
          pt.matchers
            .zero_or_more_matcher(entries)
            .map(cls_entry_matcher)
            .reverse()
            .reduce(
              (rest_t, entry) =>
                new Exps.ClsCons(
                  entry.field_name,
                  entry.field_name,
                  entry.field_t,
                  rest_t
                ),
              new Exps.ClsNil()
            )
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
