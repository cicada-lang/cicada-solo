import * as pt from "@cicada-lang/partech"
import { Exp } from "../../exp"
import * as Exps from "../../exps"
import { Stmt } from "../../stmt"
import * as Stmts from "../../stmts"
import {
  cls_entry_matcher,
  exp_matcher,
  operator_matcher,
  pi_handler,
  sequence_matcher,
  simple_typings_matcher,
  typings_matcher,
} from "../matchers"

export function stmts_matcher(tree: pt.Tree): Array<Stmt> {
  return pt.matcher({
    "stmts:stmts": ({ stmts }) =>
      pt.matchers.zero_or_more_matcher(stmts).map(stmt_matcher),
  })(tree)
}

export function stmt_matcher(tree: pt.Tree): Stmt {
  return pt.matcher<Stmt>({
    "stmt:let": ({ name, exp }, { span }) =>
      new Stmts.Let(pt.str(name), exp_matcher(exp), { span }),
    "stmt:let_the": ({ name, t, exp }, { span }) =>
      new Stmts.Let(
        pt.str(name),
        new Exps.The(exp_matcher(t), exp_matcher(exp), {
          span: pt.span_closure([t.span, exp.span]),
        }),
        { span },
      ),
    "stmt:check": ({ t, exp }, { span }) =>
      new Stmts.Compute(
        new Exps.The(exp_matcher(t), exp_matcher(exp), {
          span: pt.span_closure([t.span, exp.span]),
        }),
        { span },
      ),
    "stmt:let_fn": ({ name, typings, ret_t, sequence }, { span }) => {
      const init: Exp = sequence_matcher(sequence)
      const fn = typings_matcher(typings)
        .reverse()
        .reduce((result, typing) => {
          switch (typing.kind) {
            case "named": {
              return new Exps.Fn(typing.name, result, {
                span: pt.span_closure([typing.span, sequence.span]),
              })
            }
            case "implicit": {
              return new Exps.ImplicitFn(typing.name, result, {
                span: pt.span_closure([typing.span, sequence.span]),
              })
            }
            case "vague": {
              return new Exps.VagueFn(typing.name, result, {
                span: pt.span_closure([typing.span, sequence.span]),
              })
            }
          }
        }, init)

      return new Stmts.Let(
        pt.str(name),
        new Exps.The(pi_handler({ typings, ret_t }, { span }), fn, {
          span: pt.span_closure([typings.span, ret_t.span, sequence.span]),
        }),
        { span },
      )
    },
    "stmt:compute": ({ exp }, { span }) =>
      new Stmts.Compute(exp_matcher(exp), { span }),
    "stmt:class": ({ name, entries }, { span }) =>
      new Stmts.Class(
        pt.str(name),
        pt.matchers
          .zero_or_more_matcher(entries)
          .map(cls_entry_matcher)
          .reverse()
          .reduce(
            (rest_t, entry) =>
              new Exps.ConsCls(
                entry.field_name,
                entry.field_name,
                entry.field_t,
                rest_t,
                { span: entry.span },
              ),
            new Exps.NilCls({ span }),
          ),
        { span },
      ),
    "stmt:class_extends": ({ name, parent, entries }, { span }) =>
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
                new Exps.ConsCls(
                  entry.field_name,
                  entry.field_name,
                  entry.field_t,
                  rest_t,
                  { span: entry.span },
                ),
              new Exps.NilCls({ span }),
            ),
          { span },
        ),
        { span },
      ),
    "stmt:import": ({ path, entries }, { span }) => {
      return new Stmts.Import(
        pt.trim_boundary(pt.str(path), 1),
        pt.matchers.zero_or_more_matcher(entries).map(import_entry_matcher),
        { span },
      )
    },
    "stmt:datatype": ({ name, ctors }, { span }) => {
      return new Stmts.Datatype(
        pt.str(name),
        {},
        {},
        Object.fromEntries(
          pt.matchers
            .one_or_more_matcher(ctors)
            .map(ctor_matcher)
            .map(({ name, t }) => [name, t]),
        ),
        { span },
      )
    },
    "stmt:datatype_fixed": ({ name, fixed, ctors }, { span }) => {
      return new Stmts.Datatype(
        pt.str(name),
        Object.fromEntries(
          simple_typings_matcher(fixed).map(({ name, exp }) => [name, exp]),
        ),
        {},
        Object.fromEntries(
          pt.matchers
            .one_or_more_matcher(ctors)
            .map(ctor_matcher)
            .map(({ name, t }) => [name, t]),
        ),
        { span },
      )
    },
    "stmt:datatype_fixed_and_varied": (
      { name, fixed, varied, ctors },
      { span },
    ) => {
      return new Stmts.Datatype(
        pt.str(name),
        Object.fromEntries(
          simple_typings_matcher(fixed).map(({ name, exp }) => [name, exp]),
        ),
        Object.fromEntries(
          simple_typings_matcher(varied).map(({ name, exp }) => [name, exp]),
        ),
        Object.fromEntries(
          pt.matchers
            .one_or_more_matcher(ctors)
            .map(ctor_matcher)
            .map(({ name, t }) => [name, t]),
        ),
        { span },
      )
    },
    "stmt:datatype_varied": ({ name, varied, ctors }, { span }) => {
      return new Stmts.Datatype(
        pt.str(name),
        {},
        Object.fromEntries(
          simple_typings_matcher(varied).map(({ name, exp }) => [name, exp]),
        ),
        Object.fromEntries(
          pt.matchers
            .one_or_more_matcher(ctors)
            .map(ctor_matcher)
            .map(({ name, t }) => [name, t]),
        ),
        { span },
      )
    },
  })(tree)
}

export function import_entry_matcher(tree: pt.Tree): Stmts.ImportEntry {
  return pt.matcher({
    "import_entry:name": ({ name }) => ({ name: pt.str(name) }),
    "import_entry:alias": ({ name, alias }) => ({
      name: pt.str(name),
      alias: pt.str(alias),
    }),
  })(tree)
}

export function ctor_matcher(tree: pt.Tree): {
  name: string
  t: Exp
  span: pt.Span
} {
  return pt.matcher({
    "ctor:field": ({ name, t }, { span }) => ({
      name: pt.str(name),
      t: exp_matcher(t),
      span,
    }),
    "ctor:method": ({ name, typings, ret_t }, { span }) => ({
      name: pt.str(name),
      t: pi_handler({ typings, ret_t }, { span }),
      span,
    }),
  })(tree)
}
