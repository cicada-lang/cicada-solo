import pt from "@cicada-lang/partech"
import { Exp } from "../../exp"
import * as Exps from "../../exps"
import { nat_from_number } from "../../exps/nat/nat-util"
import * as ut from "../../ut"

export function pi_handler(body: { [key: string]: pt.Tree }): Exp {
  const { bindings, ret_t } = body
  let result = exp_matcher(ret_t)
  for (const { names, exp } of bindings_matcher(bindings).reverse()) {
    for (const name of names.reverse()) {
      result = new Exps.Pi(name, exp, result)
    }
  }
  return result
}

export function exp_matcher(tree: pt.Tree): Exp {
  return pt.matcher<Exp>({
    "exp:var": ({ name }) => new Exps.Var(pt.str(name)),
    "exp:pi": pi_handler,
    "exp:fn": ({ names, ret }) => {
      let result = exp_matcher(ret)
      for (const name of names_matcher(names).reverse()) {
        result = new Exps.Fn(name, result)
      }
      return result
    },
    "exp:ap": ({ target, args }) => {
      let result: Exp = new Exps.Var(pt.str(target))
      for (const arg of pt.matchers.one_or_more_matcher(args)) {
        for (const exp of exps_matcher(arg)) {
          result = new Exps.Ap(result, exp)
        }
      }
      return result
    },
    "exp:sigma": ({ name, car_t, cdr_t }) =>
      new Exps.Sigma(pt.str(name), exp_matcher(car_t), exp_matcher(cdr_t)),
    "exp:pair": ({ car_t, cdr_t }) =>
      new Exps.Sigma("_", exp_matcher(car_t), exp_matcher(cdr_t)),
    "exp:cons": ({ car, cdr }) =>
      new Exps.Cons(exp_matcher(car), exp_matcher(cdr)),
    "exp:car": ({ target }) => new Exps.Car(exp_matcher(target)),
    "exp:cdr": ({ target }) => new Exps.Cdr(exp_matcher(target)),
    "exp:cls": ({ entries }) =>
      new Exps.Cls(
        pt.matchers.zero_or_more_matcher(entries).map(cls_entry_matcher)
      ),
    "exp:ext": ({ parent_name, entries }) =>
      new Exps.Ext(
        pt.str(parent_name),
        pt.matchers.zero_or_more_matcher(entries).map(cls_entry_matcher)
      ),
    "exp:obj": ({ properties }) =>
      new Exps.Obj(
        new Map(
          pt.matchers.zero_or_more_matcher(properties).map(property_matcher)
        )
      ),
    "exp:dot_field": ({ target, name }) =>
      new Exps.Dot(exp_matcher(target), pt.str(name)),
    "exp:dot_method": ({ target, name, args }) => {
      let result: Exp = new Exps.Dot(exp_matcher(target), pt.str(name))
      for (const arg of pt.matchers.one_or_more_matcher(args)) {
        for (const exp of exps_matcher(arg)) {
          result = new Exps.Ap(result, exp)
        }
      }
      return result
    },
    "exp:nat": () => new Exps.Nat(),
    "exp:zero": () => new Exps.Zero(),
    "exp:add1": ({ prev }) => new Exps.Add1(exp_matcher(prev)),
    "exp:number": ({ value }, { span }) => {
      const n = Number.parseInt(pt.str(value))
      if (Number.isNaN(n)) {
        throw new pt.ParsingError(
          `Expecting number, instead of: ${ut.inspect(n)}`,
          { span }
        )
      } else {
        return nat_from_number(n)
      }
    },
    "exp:nat_ind": ({ target, motive, base, step }) =>
      new Exps.NatInd(
        exp_matcher(target),
        exp_matcher(motive),
        exp_matcher(base),
        exp_matcher(step)
      ),
    "exp:list": ({ elem_t }) => new Exps.List(exp_matcher(elem_t)),
    "exp:nil": () => new Exps.Nil(),
    "exp:nil_sugar": () => new Exps.Nil(),
    "exp:li": ({ head, tail }) =>
      new Exps.Li(exp_matcher(head), exp_matcher(tail)),
    "exp:li_sugar": ({ exps }) => {
      let list: Exp = new Exps.Nil()
      for (const exp of exps_matcher(exps)) {
        list = new Exps.Li(exp, list)
      }
      return list
    },
    "exp:list_ind": ({ target, motive, base, step }) =>
      new Exps.ListInd(
        exp_matcher(target),
        exp_matcher(motive),
        exp_matcher(base),
        exp_matcher(step)
      ),
    "exp:equal": ({ t, from, to }) =>
      new Exps.Equal(exp_matcher(t), exp_matcher(from), exp_matcher(to)),
    "exp:same": () => new Exps.Same(),
    "exp:replace": ({ target, motive, base }) =>
      new Exps.Replace(
        exp_matcher(target),
        exp_matcher(motive),
        exp_matcher(base)
      ),
    "exp:trivial": () => new Exps.Trivial(),
    "exp:sole": () => new Exps.Sole(),
    "exp:absurd": () => new Exps.Absurd(),
    "exp:absurd_ind": ({ target, motive }) =>
      new Exps.AbsurdInd(exp_matcher(target), exp_matcher(motive)),
    "exp:str": () => new Exps.Str(),
    "exp:quote": ({ value }) =>
      new Exps.Quote(pt.trim_boundary(pt.str(value), 1)),
    "exp:type": () => new Exps.Type(),
    "exp:let": ({ name, exp, ret }) =>
      new Exps.Let(pt.str(name), exp_matcher(exp), exp_matcher(ret)),
    "exp:the": ({ t, exp }) => new Exps.The(exp_matcher(t), exp_matcher(exp)),
  })(tree)
}

export function cls_entry_matcher(
  tree: pt.Tree
): { name: string; t: Exp; exp?: Exp } {
  return pt.matcher({
    "cls_entry:field_demanded": ({ name, t }) => ({
      name: pt.str(name),
      t: exp_matcher(t),
    }),
    "cls_entry:field_fulfilled": ({ name, t, exp }) => ({
      name: pt.str(name),
      t: exp_matcher(t),
      exp: exp_matcher(exp),
    }),
    "cls_entry:method_demanded": ({ name, bindings, ret_t }) => ({
      name: pt.str(name),
      t: pi_handler({ bindings, ret_t }),
    }),
    "cls_entry:method_fulfilled": ({ name, bindings, ret_t, ret }) => {
      let fn = exp_matcher(ret)
      for (const { names } of bindings_matcher(bindings).reverse()) {
        for (const name of names.reverse()) {
          fn = new Exps.Fn(name, fn)
        }
      }

      return {
        name: pt.str(name),
        t: pi_handler({ bindings, ret_t }),
        exp: fn,
      }
    },
  })(tree)
}

export function bindings_matcher(
  tree: pt.Tree
): Array<{ names: Array<string>; exp: Exp }> {
  return pt.matcher({
    "bindings:bindings": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(binding_entry_matcher),
      binding_entry_matcher(last_entry),
    ],
  })(tree)
}

export function binding_entry_matcher(
  tree: pt.Tree
): { names: Array<string>; exp: Exp } {
  return pt.matcher({
    "binding_entry:nameless": ({ exp }) => ({
      names: ["_"],
      exp: exp_matcher(exp),
    }),
    "binding_entry:named": ({ name, exp }) => ({
      names: [pt.str(name)],
      exp: exp_matcher(exp),
    }),
    "binding_entry:multi_named": ({ names, exp }) => ({
      names: pt.matchers.one_or_more_matcher(names).map(pt.str),
      exp: exp_matcher(exp),
    }),
  })(tree)
}

export function names_matcher(tree: pt.Tree): Array<string> {
  return pt.matcher({
    "names:names": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(pt.str),
      pt.str(last_entry),
    ],
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

export function property_matcher(tree: pt.Tree): [string, Exp] {
  return pt.matcher<[string, Exp]>({
    "property:field": ({ name, exp }) => [pt.str(name), exp_matcher(exp)],
    "property:method": ({ name, bindings, ret_t }) => [
      pt.str(name),
      pi_handler({ bindings, ret_t }),
    ],
  })(tree)
}
