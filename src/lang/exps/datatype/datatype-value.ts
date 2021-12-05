import * as Exps from ".."
import { Core, evaluate } from "../../core"
import { Ctx } from "../../ctx"
import { Solution } from "../../solution"
import { expect, readback, Value } from "../../value"

export class DatatypeValue extends Value {
  type_ctor: Exps.TypeCtorValue
  args: Array<Value>

  constructor(type_ctor: Exps.TypeCtorValue, args: Array<Value>) {
    super()
    this.type_ctor = type_ctor
    this.args = args
  }

  get fixed_args(): Array<Value> {
    return this.args.slice(0, this.type_ctor.fixed_arity)
  }

  get varied_args(): Array<Value> {
    return this.args.slice(this.type_ctor.fixed_arity)
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.TypeValue) {
      let result: Core = new Exps.VarCore(this.type_ctor.name)
      let self_type = this.type_ctor.self_type()
      for (const [index, arg] of this.args.entries()) {
        const pi = expect(ctx, self_type, Exps.PiValue)
        self_type = Exps.PiValue.apply(pi, arg)
        const arg_t = readback(ctx, pi.arg_t, arg)
        result = new Exps.ApCore(result, arg_t)
      }

      return result
    }
  }

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    if (!(that instanceof Exps.DatatypeValue)) {
      return Solution.failure
    }

    // TODO `t` in the arguments is not used here.
    const self_type = this.type_ctor.self_type()
    return solution
      .unify(ctx, self_type, this.type_ctor, that.type_ctor)
      .unify_args(ctx, self_type, this.args, that.args)
  }

  build_motive_t(): Value {
    let env = this.type_ctor.env
    for (const [index, fixed_arg] of this.fixed_args.entries()) {
      const fixed_arg_name = this.type_ctor.fixed_arg_names[index]
      env = env.extend(fixed_arg_name, fixed_arg)
    }

    let datatype_core: Core = new Exps.VarCore(this.type_ctor.name)
    for (const arg_name of [...this.type_ctor.arg_names].reverse()) {
      datatype_core = new Exps.ApCore(datatype_core, new Exps.VarCore(arg_name))
    }

    let motive_core = new Exps.PiCore(
      // NOTE The use of name `_target` is ok,
      //   because it is a bound variable
      //   that does not occur in the return type.
      "_target",
      datatype_core,
      new Exps.TypeCore()
    )

    const varied_entries = Object.entries(this.type_ctor.varied)
    for (const [varied_arg_name, varied_arg_t_core] of varied_entries) {
      motive_core = new Exps.PiCore(
        varied_arg_name,
        varied_arg_t_core,
        motive_core
      )
    }

    return evaluate(env, motive_core)
  }

  build_case_t(name: string, motive: Value): Value {
    const data_ctor = this.type_ctor.get_data_ctor(name)

    let env = this.type_ctor.env
    for (const [index, fixed_arg] of this.fixed_args.entries()) {
      const fixed_arg_name = this.type_ctor.fixed_arg_names[index]
      env = env.extend(fixed_arg_name, fixed_arg)
    }

    // TODO The use of name `motive` should be fix,
    //   because in our generated core expression,
    //   it is a free variable.
    env = env.extend("motive", motive)
    const motive_core = new Exps.VarCore("motive")

    let case_t = data_ctor.build_ret_t(motive_core)

    if (data_ctor.is_direct_positive_recursive) {
      case_t = new Exps.PiCore(
        "almost",
        data_ctor.build_almost_t(motive_core),
        case_t
      )
    }

    for (const binding of [...data_ctor.bindings].reverse()) {
      case_t = this.build_pi_from_binding(case_t, binding)
    }

    // NOTE We do not add `data_ctor.type_ctor.fixed` to `case_t` as vague-pi,
    // - This must be consistent with the implementation of `InductionCore.apply`,
    //   we need to drop fixed arguments before applying the target.

    return evaluate(env, case_t)
  }

  private build_pi_from_binding(
    core: Core,
    binding: Exps.DataCtorBinding
  ): Core {
    switch (binding.kind) {
      case "plain":
        return new Exps.PiCore(binding.name, binding.arg_t, core)
      case "implicit":
        return new Exps.ImplicitPiCore(binding.name, binding.arg_t, core)
      case "vague":
        return new Exps.VaguePiCore(binding.name, binding.arg_t, core)
    }
  }
}
