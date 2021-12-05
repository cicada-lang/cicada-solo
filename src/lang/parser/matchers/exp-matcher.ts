import pt from "@cicada-lang/partech"
import { Exp } from "../../exp"
import * as Exps from "../../exps"
import { nat_from_number } from "../../exps/nat/nat-util"

export function pi_handler(
  body: { [key: string]: pt.Tree },
  meta: { span: pt.Span }
): Exp {
  const { bindings, ret_t } = body

  return bindings_matcher(bindings)
    .reverse()
    .reduce((result, binding) => {
      switch (binding.kind) {
        case "named": {
          return new Exps.Pi(binding.name, binding.exp, result, {
            span: pt.span_closure([binding.span, ret_t.span]),
          })
        }
        case "implicit": {
          return new Exps.ImplicitPi(binding.name, binding.exp, result, {
            span: pt.span_closure([binding.span, ret_t.span]),
          })
        }
        case "vague": {
          return new Exps.VaguePi(binding.name, binding.exp, result, {
            span: pt.span_closure([binding.span, ret_t.span]),
          })
        }
      }
    }, exp_matcher(ret_t))
}

export function fn_handler(body: { [key: string]: pt.Tree }): Exp {
  const { names, ret } = body

  return names_matcher(names)
    .reverse()
    .reduce((result, name_entry) => {
      switch (name_entry.kind) {
        case "name": {
          return new Exps.Fn(name_entry.name, result, {
            span: pt.span_closure([name_entry.span, ret.span]),
          })
        }
        case "implicit": {
          return new Exps.ImplicitFn(name_entry.name, result, {
            span: pt.span_closure([name_entry.span, ret.span]),
          })
        }
        case "vague": {
          return new Exps.VagueFn(name_entry.name, result, {
            span: pt.span_closure([name_entry.span, ret.span]),
          })
        }
      }
    }, exp_matcher(ret))
}

export function sigma_handler(
  body: { [key: string]: pt.Tree },
  meta: { span: pt.Span }
): Exp {
  const { bindings, cdr_t } = body

  return simple_bindings_matcher(bindings)
    .reverse()
    .reduce(
      (result, binding) =>
        new Exps.Sigma(binding.name, binding.exp, result, meta),
      exp_matcher(cdr_t)
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
          operator_matcher(target)
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
          }) as Exp
        ),
    "operator:nat_ind": ({ target, motive, base, step }, { span }) =>
      new Exps.NatInd(
        exp_matcher(target),
        exp_matcher(motive),
        exp_matcher(base),
        exp_matcher(step),
        { span }
      ),
    "operator:nat_rec": ({ target, base, step }, { span }) =>
      new Exps.NatRec(
        exp_matcher(target),
        exp_matcher(base),
        exp_matcher(step),
        { span }
      ),
    "operator:list_ind": ({ target, motive, base, step }, { span }) =>
      new Exps.ListInd(
        exp_matcher(target),
        exp_matcher(motive),
        exp_matcher(base),
        exp_matcher(step),
        { span }
      ),
    "operator:list_rec": ({ target, base, step }, { span }) =>
      new Exps.ListRec(
        exp_matcher(target),
        exp_matcher(base),
        exp_matcher(step),
        { span }
      ),
    "operator:vector_head": ({ target }, { span }) =>
      new Exps.VectorHead(exp_matcher(target), { span }),
    "operator:vector_tail": ({ target }, { span }) =>
      new Exps.VectorTail(exp_matcher(target), { span }),
    "operator:vector_ind": ({ length, target, motive, base, step }, { span }) =>
      new Exps.VectorInd(
        exp_matcher(length),
        exp_matcher(target),
        exp_matcher(motive),
        exp_matcher(base),
        exp_matcher(step),
        { span }
      ),
    "operator:replace": ({ target, motive, base }, { span }) =>
      new Exps.Replace(
        exp_matcher(target),
        exp_matcher(motive),
        exp_matcher(base),
        { span }
      ),
    "operator:absurd_ind": ({ target, motive }, { span }) =>
      new Exps.AbsurdInd(exp_matcher(target), exp_matcher(motive), { span }),
    "operator:either_ind": (
      { target, motive, base_left, base_right },
      { span }
    ) =>
      new Exps.EitherInd(
        exp_matcher(target),
        exp_matcher(motive),
        exp_matcher(base_left),
        exp_matcher(base_right),
        { span }
      ),
    "operator:the": ({ t, exp }, { span }) =>
      new Exps.The(exp_matcher(t), exp_matcher(exp), { span }),
    "operator:is": ({ t, exp }, { span }) =>
      new Exps.The(exp_matcher(t), exp_matcher(exp), { span }),
    "operator:induction": ({ target, motive, case_entries }, { span }) =>
      new Exps.Induction(
        exp_matcher(target),
        exp_matcher(motive),
        pt.matchers.zero_or_more_matcher(case_entries).map(case_entry_matcher),
        { span }
      ),
  })(tree)
}

export function operand_matcher(tree: pt.Tree): Exp {
  return pt.matcher<Exp>({
    "operand:pi": pi_handler,
    "operand:fn": fn_handler,
    "operand:sigma": sigma_handler,
    "operand:pair": ({ car_t, cdr_t }, { span }) =>
      new Exps.Sigma("_", exp_matcher(car_t), exp_matcher(cdr_t), { span }),
    "operand:cons": ({ car, cdr }, { span }) =>
      new Exps.Cons(exp_matcher(car), exp_matcher(cdr), { span }),
    "operand:cons_sugar": ({ exps, tail }, { span }) =>
      exps_matcher(exps)
        .reverse()
        .reduce(
          (result, exp) => new Exps.Cons(exp, result, { span }),
          exp_matcher(tail)
        ),
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
                  { span: entry.span }
                )
              : new Exps.ConsCls(
                  entry.field_name,
                  entry.field_name,
                  entry.field_t,
                  rest_t,
                  { span: entry.span }
                ),
          new Exps.NilCls({ span })
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
                    { span: entry.span }
                  )
                : new Exps.ConsCls(
                    entry.field_name,
                    entry.field_name,
                    entry.field_t,
                    rest_t,
                    { span: entry.span }
                  ),
            new Exps.NilCls({ span })
          ),
        { span }
      ),
    "operand:obj": ({ properties, last_property }, { span }) =>
      new Exps.Obj(
        [
          ...pt.matchers.zero_or_more_matcher(properties).map(property_matcher),
          property_matcher(last_property),
        ],
        { span }
      ),
    "operand:nat": (_, { span }) => new Exps.Nat({ span }),
    "operand:zero": (_, { span }) => new Exps.Zero({ span }),
    "operand:add1": ({ prev }, { span }) =>
      new Exps.Add1(exp_matcher(prev), { span }),
    "operand:number": ({ value }, { span }) => {
      const n = Number.parseInt(pt.str(value))
      if (Number.isNaN(n)) {
        throw new pt.ParsingError(
          `Expecting number, instead of: ${JSON.stringify(n)}`,
          { span }
        )
      } else {
        return nat_from_number(n, { span })
      }
    },
    "operand:list": ({ elem_t }, { span }) =>
      new Exps.List(exp_matcher(elem_t), { span }),
    "operand:nil": (_, { span }) => new Exps.Nil({ span }),
    "operand:nil_sugar": (_, { span }) => new Exps.Nil({ span }),
    "operand:li": ({ head, tail }, { span }) =>
      new Exps.Li(exp_matcher(head), exp_matcher(tail), { span }),
    "operand:li_sugar": ({ exps }, { span }) =>
      exps_matcher(exps)
        .reverse()
        .reduce(
          (list, exp) => new Exps.Li(exp, list, { span }),
          new Exps.Nil({ span })
        ),
    "operand:vector": ({ elem_t, length }, { span }) =>
      new Exps.Vector(exp_matcher(elem_t), exp_matcher(length), { span }),
    "operand:vecnil": (_, { span }) => new Exps.Vecnil({ span }),
    "operand:vec": ({ head, tail }, { span }) =>
      new Exps.Vec(exp_matcher(head), exp_matcher(tail), { span }),
    "operand:vec_sugar": ({ exps }, { span }) =>
      exps_matcher(exps)
        .reverse()
        .reduce(
          (vector, exp) => new Exps.Vec(exp, vector, { span }),
          new Exps.Vecnil({ span })
        ),
    "operand:equal": ({ t, from, to }, { span }) =>
      new Exps.Equal(exp_matcher(t), exp_matcher(from), exp_matcher(to), {
        span,
      }),
    "operand:refl": (_, { span }) => new Exps.Refl({ span }),
    "operand:same": ({ exp }, { span }) =>
      new Exps.Same(exp_matcher(exp), { span }),
    "operand:the_same": ({ t, exp }, { span }) =>
      new Exps.TheSame(exp_matcher(t), exp_matcher(exp), { span }),
    "operand:same_as_chart": ({ t, exps }, { span }) =>
      new Exps.SameAsChart(exp_matcher(t), exps_matcher(exps), { span }),
    "operand:trivial": (_, { span }) => new Exps.Trivial({ span }),
    "operand:sole": (_, { span }) => new Exps.Sole({ span }),
    "operand:absurd": (_, { span }) => new Exps.Absurd({ span }),
    "operand:str": (_, { span }) => new Exps.Str({ span }),
    "operand:quote": ({ value }, { span }) =>
      new Exps.Quote(pt.trim_boundary(pt.str(value), 1), { span }),
    "operand:todo": ({ value }, { span }) =>
      new Exps.Todo(pt.trim_boundary(pt.str(value), 1), { span }),
    "operand:either": ({ left_t, right_t }, { span }) =>
      new Exps.Either(exp_matcher(left_t), exp_matcher(right_t), { span }),
    "operand:inl": ({ left }, { span }) =>
      new Exps.Inl(exp_matcher(left), { span }),
    "operand:inr": ({ right }, { span }) =>
      new Exps.Inr(exp_matcher(right), { span }),
    "operand:type": (_, { span }) => new Exps.Type({ span }),
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
      { name, bindings, ret_t, sequence, body },
      { span }
    ) => {
      const init: Exp = sequence_matcher(sequence)
      const fn = bindings_matcher(bindings)
        .reverse()
        .reduce((result, binding) => {
          switch (binding.kind) {
            case "named": {
              return new Exps.Fn(binding.name, result, {
                span: pt.span_closure([binding.span, sequence.span]),
              })
            }
            case "implicit": {
              return new Exps.ImplicitFn(binding.name, result, {
                span: pt.span_closure([binding.span, sequence.span]),
              })
            }
            case "vague": {
              return new Exps.VagueFn(binding.name, result, {
                span: pt.span_closure([binding.span, sequence.span]),
              })
            }
          }
        }, init)

      return {
        name: pt.str(name),
        exp: new Exps.The(pi_handler({ bindings, ret_t }, { span }), fn, {
          span: pt.span_closure([bindings.span, ret_t.span, sequence.span]),
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
    "cls_entry:field_demanded": ({ name, t }, { span }) => ({
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
    "cls_entry:field_fulfilled_flower_bracket": (
      { name, t, exp },
      { span }
    ) => ({
      field_name: pt.str(name),
      field_t: exp_matcher(t),
      field: exp_matcher(exp),
      span,
    }),
    "cls_entry:method_demanded": ({ name, bindings, ret_t }, { span }) => ({
      field_name: pt.str(name),
      field_t: pi_handler({ bindings, ret_t }, { span }),
      span,
    }),
    "cls_entry:method_fulfilled": (
      { name, bindings, ret_t, sequence },
      { span }
    ) => {
      const init: Exp = sequence_matcher(sequence)
      const fn = bindings_matcher(bindings)
        .reverse()
        .reduce((result, binding) => {
          switch (binding.kind) {
            case "named": {
              return new Exps.Fn(binding.name, result, {
                span: pt.span_closure([binding.span, sequence.span]),
              })
            }
            case "implicit": {
              return new Exps.ImplicitFn(binding.name, result, {
                span: pt.span_closure([binding.span, sequence.span]),
              })
            }
            case "vague": {
              return new Exps.VagueFn(binding.name, result, {
                span: pt.span_closure([binding.span, sequence.span]),
              })
            }
          }
        }, init)

      return {
        field_name: pt.str(name),
        field_t: pi_handler({ bindings, ret_t }, { span }),
        field: fn,
        span,
      }
    },
  })(tree)
}

type Binding = {
  kind: "named" | "implicit" | "vague"
  name: string
  exp: Exp
  span: pt.Span
}

export function bindings_matcher(tree: pt.Tree): Array<Binding> {
  return pt.matcher({
    "bindings:bindings": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(binding_matcher),
      binding_matcher(last_entry),
    ],
  })(tree)
}

export function binding_matcher(tree: pt.Tree): Binding {
  return pt.matcher<Binding>({
    "binding:nameless": ({ exp }, { span }) => ({
      kind: "named",
      name: "_",
      exp: exp_matcher(exp),
      span,
    }),
    "binding:named": ({ name, exp }, { span }) => ({
      kind: "named",
      name: pt.str(name),
      exp: exp_matcher(exp),
      span,
    }),
    "binding:implicit": ({ name, exp }, { span }) => ({
      kind: "implicit",
      name: pt.str(name),
      exp: exp_matcher(exp),
      span,
    }),
    "binding:vague": ({ name, exp }, { span }) => ({
      kind: "vague",
      name: pt.str(name),
      exp: exp_matcher(exp),
      span,
    }),
  })(tree)
}

export type SimpleBinding = { name: string; exp: Exp; span: pt.Span }

export function simple_bindings_matcher(tree: pt.Tree): Array<SimpleBinding> {
  return pt.matcher({
    "simple_bindings:simple_bindings": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(simple_binding_matcher),
      simple_binding_matcher(last_entry),
    ],
  })(tree)
}

export function simple_binding_matcher(tree: pt.Tree): SimpleBinding {
  return pt.matcher<SimpleBinding>({
    "simple_binding:named": ({ name, exp }, { span }) => ({
      name: pt.str(name),
      exp: exp_matcher(exp),
      span,
    }),
  })(tree)
}

export function names_matcher(tree: pt.Tree): Array<NameEntry> {
  return pt.matcher({
    "names:names": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(name_entry_matcher),
      name_entry_matcher(last_entry),
    ],
    "names:names_bracket_separated": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(name_entry_matcher),
      name_entry_matcher(last_entry),
    ],
  })(tree)
}

type NameEntry = {
  kind: "name" | "implicit" | "vague"
  name: string
  span: pt.Span
}

export function name_entry_matcher(tree: pt.Tree): NameEntry {
  return pt.matcher<NameEntry>({
    "name_entry:name_entry": ({ name }, { span }) => ({
      kind: "name",
      name: pt.str(name),
      span,
    }),
    "name_entry:implicit_name_entry": ({ name }, { span }) => ({
      kind: "implicit",
      name: pt.str(name),
      span,
    }),
    "name_entry:vague_name_entry": ({ name }, { span }) => ({
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
    "property:method": ({ name, names, sequence }, { span }) => {
      const init: Exp = sequence_matcher(sequence)
      const result = names_matcher(names)
        .reverse()
        .reduce((result, name_entry) => {
          switch (name_entry.kind) {
            case "name": {
              return new Exps.Fn(name_entry.name, result, {
                span: pt.span_closure([name_entry.span, sequence.span]),
              })
            }
            case "implicit": {
              return new Exps.ImplicitFn(name_entry.name, result, {
                span: pt.span_closure([name_entry.span, sequence.span]),
              })
            }
            case "vague": {
              return new Exps.VagueFn(name_entry.name, result, {
                span: pt.span_closure([name_entry.span, sequence.span]),
              })
            }
          }
        }, init)

      return new Exps.FieldProp(pt.str(name), result)
    },
    "property:spread": ({ exp }) => new Exps.SpreadProp(exp_matcher(exp)),
  })(tree)
}
