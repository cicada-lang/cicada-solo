package xieyuheng.cicada

import collection.immutable.ListMap

import infer._
import pretty._

object eval {

  def eval(ctx: Ctx, exp: Exp): Value = {
    exp match {
      case Var(name: String) =>
        ctx.lookup_value(name) match {
          case Some(value) => value
          case None => NeutralVar(name)
        }

      case Type() =>
        ValueType()

      case Pi(arg_type_map: ListMap[String, Exp], return_type: Exp) =>
        ValuePi(arg_type_map: ListMap[String, Exp], return_type: Exp, ctx: Ctx)

      case Fn(arg_type_map: ListMap[String, Exp], body: Exp) =>
        ValueFn(arg_type_map: ListMap[String, Exp], body: Exp, ctx: Ctx)

      case Ap(target: Exp, arg_list: List[Exp]) =>
        value_apply(
          eval(ctx, target),
          arg_list.map { infer(ctx, _) },
          arg_list.map { eval(ctx, _) })

      case Cl(type_map: ListMap[String, Exp]) =>
        ValueTl(type_map: ListMap[String, Exp], ctx: Ctx)

      case Obj(value_map: ListMap[String, Exp]) =>
        ValueObj(ListMap(value_map.map {
          case (name, exp) => (name, eval(ctx, exp))
        }.toList: _*))

      case Dot(target: Exp, field: String) =>
        value_dot(eval(ctx, target), field)

      case Block(block_entry_map: ListMap[String, BlockEntry], body: Exp) =>
        var local_ctx = ctx
        block_entry_map.foreach {
          case (name, BlockEntryLet(exp)) =>
            val value = eval(local_ctx, exp)
            val t = infer(local_ctx, exp)
            val entry = CtxEntryTypeValueuePair(t, value)
            local_ctx = local_ctx.ext(name, entry)

          case (name, BlockEntryDefine(t_exp, exp)) =>
            val value = eval(local_ctx, exp)
            val t = eval(local_ctx, t_exp)
            val entry = CtxEntryTypeValueuePair(t, value)
            local_ctx = local_ctx.ext(name, entry)
        }
        eval(local_ctx, body)
    }
  }

  def value_apply(
    value: Value,
    type_list: List[Value],
    arg_list: List[Value],
  ): Value = {
    value match {
      case neutral: Neutral =>
        // TODO should be NeutralAp(neutral, type_list, arg_list)
        // the structure of NeutralAp need to be changed
        NeutralAp(neutral, arg_list)

      case ValueFn(arg_type_map: ListMap[String, Exp], body: Exp, ctx: Ctx) =>
        val name_list = arg_type_map.keys.toList
        if (name_list.length != arg_type_map.size) {
          throw Report(List("value_apply fail, ValueFn arity mismatch"))
        } else {
          var local_ctx = ctx
          name_list.zipWithIndex.foreach {
            case (name, index) =>
              val entry = CtxEntryTypeValueuePair(type_list(index), arg_list(index))
              local_ctx = local_ctx.ext(name, entry)
          }
          eval(local_ctx, body)
        }

      case ValueTl(type_map: ListMap[String, Exp], ctx: Ctx) =>
        val name_list = type_map.keys.toList
        if (name_list.length != type_map.size) {
          throw Report(List("value_apply fail, ValueTl arity mismatch"))
        } else {
          val value_map = ListMap(name_list.zip(arg_list): _*)
          ValueObj(value_map)
        }

      case _ =>
        throw Report(List(
          "value_apply fail, expecting ValueFn or ValueTl\n" +
            s"value: ${pretty_value(value)}\n"
        ))
    }
  }

  def value_dot(value: Value, field: String): Value = {
    value match {
      case neutral: Neutral =>
        NeutralDot(neutral, field)
      case ValueObj(value_map: ListMap[String, Value]) =>
        value_map.get(field) match {
          case Some(value) => value
          case None =>
            throw Report(List(s"missing field: ${field}"))
        }
      case _ =>
        throw Report(List("value_dot fail, expecting ValueObj"))
    }
  }

}
