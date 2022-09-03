import pt from "@cicada-lang/partech"
import { Exp } from "../../exp"
import * as Exps from "../../exps"

export function pi_handler(
  body: { [key: string]: pt.Tree },
  meta: { span: pt.Span },
): Exp {
  const { typings, ret_t } = body

  return typings_matcher(typings)
    .reverse()
    .reduce((result, typing) => {
      switch (typing.kind) {
        case "named": {
          return new Exps.Pi(typing.name, typing.exp, result, {
            span: pt.span_closure([typing.span, ret_t.span]),
          })
        }
        case "implicit": {
          return new Exps.ImplicitPi(typing.name, typing.exp, result, {
            span: pt.span_closure([typing.span, ret_t.span]),
          })
        }
        case "vague": {
          return new Exps.VaguePi(typing.name, typing.exp, result, {
            span: pt.span_closure([typing.span, ret_t.span]),
          })
        }
      }
    }, exp_matcher(ret_t))
}

export function fn_handler(body: { [key: string]: pt.Tree }): Exp {
  const { namings, ret } = body

  return namings_matcher(namings)
    .reverse()
    .reduce((result, naming) => {
      switch (naming.kind) {
        case "name": {
          return new Exps.Fn(naming.name, result, {
            span: pt.span_closure([naming.span, ret.span]),
          })
        }
        case "implicit": {
          return new Exps.ImplicitFn(naming.name, result, {
            span: pt.span_closure([naming.span, ret.span]),
          })
        }
        case "vague": {
          return new Exps.VagueFn(naming.name, result, {
            span: pt.span_closure([naming.span, ret.span]),
          })
        }
      }
    }, exp_matcher(ret))
}

export function sigma_handler(
  body: { [key: string]: pt.Tree },
  meta: { span: pt.Span },
): Exp {
  const { typings, cdr_t } = body

  return simple_typings_matcher(typings)
    .reverse()
    .reduce(
      (result, typing) => new Exps.Sigma(typing.name, typing.exp, result, meta),
      exp_matcher(cdr_t),
    )
}

export function exp_matcher(tree: pt.Tree): Exp {
  return pt.matcher<Exp>({
    "exp:operator": ({ operator }) => operator_matcher(operator),
    "exp:operand": ({ operand }) => operand_matcher(operand),
  })(tree)
}

export function operator_matcher(tree: pt.Tree): Exp {
  return pt.matcher<Exp>({
    "operator:var": ({ name }, { span }) =>
      new Exps.Var(pt.str(name), { span }),
    "operator:ap": ({ target, arg_entries_group }, { span }) =>
      pt.matchers
        .one_or_more_matcher(arg_entries_group)
        .map((arg_entries) => arg_entries_matcher(arg_entries))
        .reduce(
          (result, arg_entries) =>
            new Exps.MultiAp(result, arg_entries, { span }),
          operator_matcher(target),
        ),
    "operator:sequence_begin": ({ sequence }, { span }) =>
      sequence_matcher(sequence),
    "operator:car": ({ target }, { span }) =>
      new Exps.Car(exp_matcher(target), { span }),
    "operator:cdr": ({ target }, { span }) =>
      new Exps.Cdr(exp_matcher(target), { span }),
    "operator:dot_field": ({ target, name }, { span }) =>
      new Exps.Dot(operator_matcher(target), pt.str(name), { span }),
    "operator:dot_method": ({ target, name, arg_entries_group }, { span }) =>
      pt.matchers
        .one_or_more_matcher(arg_entries_group)
        .map((arg_entries) => arg_entries_matcher(arg_entries))
        .reduce(
          (result, arg_entries) =>
            new Exps.MultiAp(result, arg_entries, { span }),
          new Exps.Dot(operator_matcher(target), pt.str(name), {
            span: pt.span_closure([target.span, name.span]),
          }) as Exp,
        ),
    "operator:the": ({ t, exp }, { span }) =>
      new Exps.The(exp_matcher(t), exp_matcher(exp), { span }),
    "operator:recursion": ({ target, case_entries }, { span }) =>
      new Exps.Induction(
        exp_matcher(target),
        undefined,
        pt.matchers.zero_or_more_matcher(case_entries).map(case_entry_matcher),
        { span },
      ),
    "operator:induction": ({ target, motive, case_entries }, { span }) =>
      new Exps.Induction(
        exp_matcher(target),
        exp_matcher(motive),
        pt.matchers.zero_or_more_matcher(case_entries).map(case_entry_matcher),
        { span },
      ),
  })(tree)
}

export function operand_matcher(tree: pt.Tree): Exp {
  return pt.matcher<Exp>({
    "operand:pi": pi_handler,
    "operand:pi_forall": pi_handler,
    "operand:fn": fn_handler,
    "operand:fn_function": fn_handler,
    "operand:sigma_exists": sigma_handler,
    "operand:cons": ({ car, cdr }, { span }) =>
      new Exps.Cons(exp_matcher(car), exp_matcher(cdr), { span }),
    "operand:cls": ({ entries }, { span }) =>
      pt.matchers
        .zero_or_more_matcher(entries)
        .map(cls_entry_matcher)
        .reverse()
        .reduce(
          (rest_t, entry) =>
            entry.field
              ? new Exps.FulfilledCls(
                  entry.field_name,
                  entry.field_name,
                  entry.field_t,
                  entry.field,
                  rest_t,
                  { span: entry.span },
                )
              : new Exps.ConsCls(
                  entry.field_name,
                  entry.field_name,
                  entry.field_t,
                  rest_t,
                  { span: entry.span },
                ),
          new Exps.NilCls({ span }),
        ),
    "operand:ext": ({ parent, entries }, { span }) =>
      new Exps.Ext(
        operator_matcher(parent),
        pt.matchers
          .zero_or_more_matcher(entries)
          .map(cls_entry_matcher)
          .reverse()
          .reduce(
            (rest_t, entry) =>
              entry.field
                ? new Exps.FulfilledCls(
                    entry.field_name,
                    entry.field_name,
                    entry.field_t,
                    entry.field,
                    rest_t,
                    { span: entry.span },
                  )
                : new Exps.ConsCls(
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
    "operand:obj": ({ properties, last_property }, { span }) =>
      new Exps.Obj(
        [
          ...pt.matchers.zero_or_more_matcher(properties).map(property_matcher),
          property_matcher(last_property),
        ],
        { span },
      ),
    "operand:same_as_chart": ({ t, exps }, { span }) =>
      new Exps.SameAsChart(exp_matcher(t), exps_matcher(exps), { span }),
    "operand:quote": ({ value }, { span }) =>
      new Exps.Quote(pt.trim_boundary(pt.str(value), 1), { span }),
  })(tree)
}

export function sequence_matcher(tree: pt.Tree): Exps.Begin {
  return pt.matcher({
    "sequence:sequence": ({ entries, ret }, { span }) => {
      let result = exp_matcher(ret)
      for (const { name, exp, span } of pt.matchers
        .zero_or_more_matcher(entries)
        .map(sequence_entry_matcher)
        .reverse()) {
        result = new Exps.Let(name, exp, result, { span })
      }
      return new Exps.Begin(result, { span })
    },
  })(tree)
}

export function sequence_entry_matcher(tree: pt.Tree): {
  name: string
  exp: Exp
  span: pt.Span
} {
  return pt.matcher({
    "sequence_entry:let": ({ name, exp, ret }, { span }) => ({
      name: pt.str(name),
      exp: exp_matcher(exp),
      span,
    }),
    "sequence_entry:let_the": ({ name, t, exp, ret }, { span }) => ({
      name: pt.str(name),
      exp: new Exps.The(exp_matcher(t), exp_matcher(exp), {
        span: pt.span_closure([t.span, exp.span]),
      }),
      span,
    }),
    "sequence_entry:check": ({ t, exp, ret }, { span }) => ({
      name: "_",
      exp: new Exps.The(exp_matcher(t), exp_matcher(exp), {
        span: pt.span_closure([t.span, exp.span]),
      }),
      span,
    }),
    "sequence_entry:let_fn": (
      { name, typings, ret_t, sequence, body },
      { span },
    ) => {
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

      return {
        name: pt.str(name),
        exp: new Exps.The(pi_handler({ typings, ret_t }, { span }), fn, {
          span: pt.span_closure([typings.span, ret_t.span, sequence.span]),
        }),
        span,
      }
    },
  })(tree)
}

export function cls_entry_matcher(tree: pt.Tree): {
  field_name: string
  field_t: Exp
  field?: Exp
  span: pt.Span
} {
  return pt.matcher({
    "cls_entry:field_abstract": ({ name, t }, { span }) => ({
      field_name: pt.str(name),
      field_t: exp_matcher(t),
      span,
    }),
    "cls_entry:field_fulfilled": ({ name, t, exp }, { span }) => ({
      field_name: pt.str(name),
      field_t: exp_matcher(t),
      field: exp_matcher(exp),
      span,
    }),
    "cls_entry:method_abstract": ({ name, typings, ret_t }, { span }) => ({
      field_name: pt.str(name),
      field_t: pi_handler({ typings, ret_t }, { span }),
      span,
    }),
    "cls_entry:method_fulfilled": (
      { name, typings, ret_t, sequence },
      { span },
    ) => {
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

      return {
        field_name: pt.str(name),
        field_t: pi_handler({ typings, ret_t }, { span }),
        field: fn,
        span,
      }
    },
  })(tree)
}

type Typing = {
  kind: "named" | "implicit" | "vague"
  name: string
  exp: Exp
  span: pt.Span
}

export function typings_matcher(tree: pt.Tree): Array<Typing> {
  return pt.matcher({
    "typings:typings": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(typing_matcher),
      typing_matcher(last_entry),
    ],
  })(tree)
}

export function typing_matcher(tree: pt.Tree): Typing {
  return pt.matcher<Typing>({
    "typing:nameless": ({ exp }, { span }) => ({
      kind: "named",
      name: "_",
      exp: exp_matcher(exp),
      span,
    }),
    "typing:named": ({ name, exp }, { span }) => ({
      kind: "named",
      name: pt.str(name),
      exp: exp_matcher(exp),
      span,
    }),
    "typing:implicit": ({ name, exp }, { span }) => ({
      kind: "implicit",
      name: pt.str(name),
      exp: exp_matcher(exp),
      span,
    }),
    "typing:vague": ({ name, exp }, { span }) => ({
      kind: "vague",
      name: pt.str(name),
      exp: exp_matcher(exp),
      span,
    }),
  })(tree)
}

export type SimpleTyping = { name: string; exp: Exp; span: pt.Span }

export function simple_typings_matcher(tree: pt.Tree): Array<SimpleTyping> {
  return pt.matcher({
    "simple_typings:simple_typings": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(simple_typing_matcher),
      simple_typing_matcher(last_entry),
    ],
  })(tree)
}

export function simple_typing_matcher(tree: pt.Tree): SimpleTyping {
  return pt.matcher<SimpleTyping>({
    "simple_typing:named": ({ name, exp }, { span }) => ({
      name: pt.str(name),
      exp: exp_matcher(exp),
      span,
    }),
  })(tree)
}

export function namings_matcher(tree: pt.Tree): Array<Naming> {
  return pt.matcher({
    "namings:namings": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(naming_matcher),
      naming_matcher(last_entry),
    ],
    "namings:namings_bracket_separated": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(naming_matcher),
      naming_matcher(last_entry),
    ],
  })(tree)
}

type Naming = {
  kind: "name" | "implicit" | "vague"
  name: string
  span: pt.Span
}

export function naming_matcher(tree: pt.Tree): Naming {
  return pt.matcher<Naming>({
    "naming:naming": ({ name }, { span }) => ({
      kind: "name",
      name: pt.str(name),
      span,
    }),
    "naming:implicit_naming": ({ name }, { span }) => ({
      kind: "implicit",
      name: pt.str(name),
      span,
    }),
    "naming:vague_naming": ({ name }, { span }) => ({
      kind: "vague",
      name: pt.str(name),
      span,
    }),
  })(tree)
}

export function exps_matcher(tree: pt.Tree): Array<Exp> {
  return pt.matcher({
    "exps:exps": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(exp_matcher),
      exp_matcher(last_entry),
    ],
  })(tree)
}

export function arg_entries_matcher(tree: pt.Tree): Array<Exps.ArgEntry> {
  return pt.matcher({
    "arg_entries:arg_entries": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(arg_entry_matcher),
      arg_entry_matcher(last_entry),
    ],
  })(tree)
}

export function arg_entry_matcher(tree: pt.Tree): Exps.ArgEntry {
  return pt.matcher<Exps.ArgEntry>({
    "arg_entry:plain": ({ arg }) => ({
      kind: "plain",
      exp: exp_matcher(arg),
    }),
    "arg_entry:implicit": ({ arg }) => ({
      kind: "implicit",
      exp: exp_matcher(arg),
    }),
    "arg_entry:vague": ({ arg }) => ({
      kind: "vague",
      exp: exp_matcher(arg),
    }),
  })(tree)
}

export function case_entry_matcher(tree: pt.Tree): Exps.CaseEntry {
  return pt.matcher<Exps.CaseEntry>({
    "case_entry:normal": ({ name, exp }) => ({
      nullary: false,
      name: pt.str(name),
      exp: exp_matcher(exp),
    }),
    "case_entry:nullary": ({ name, exp }) => ({
      nullary: true,
      name: pt.str(name),
      exp: exp_matcher(exp),
    }),
  })(tree)
}

export function property_matcher(tree: pt.Tree): Exps.Prop {
  return pt.matcher<Exps.Prop>({
    "property:field_shorthand": ({ name }) =>
      new Exps.FieldShorthandProp(pt.str(name)),
    "property:field": ({ name, exp }) =>
      new Exps.FieldProp(pt.str(name), exp_matcher(exp)),
    "property:method": ({ name, namings, sequence }, { span }) => {
      const init: Exp = sequence_matcher(sequence)
      const result = namings_matcher(namings)
        .reverse()
        .reduce((result, naming) => {
          switch (naming.kind) {
            case "name": {
              return new Exps.Fn(naming.name, result, {
                span: pt.span_closure([naming.span, sequence.span]),
              })
            }
            case "implicit": {
              return new Exps.ImplicitFn(naming.name, result, {
                span: pt.span_closure([naming.span, sequence.span]),
              })
            }
            case "vague": {
              return new Exps.VagueFn(naming.name, result, {
                span: pt.span_closure([naming.span, sequence.span]),
              })
            }
          }
        }, init)

      return new Exps.FieldProp(pt.str(name), result)
    },
    "property:spread": ({ exp }) => new Exps.SpreadProp(exp_matcher(exp)),
  })(tree)
}
