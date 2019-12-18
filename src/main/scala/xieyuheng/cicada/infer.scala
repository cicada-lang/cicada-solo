package xieyuheng.cicada

import collection.immutable.ListMap

import eval._
import check._
import subtype._
import readback._
import pretty._

object infer {

  def infer(ctx: Ctx, exp: Exp): Value = {
    try {
      exp match {
        case Var(name: String) =>
          ctx.lookup_type(name) match {
            case Some(t) => t
            case None =>
              throw Report(List(s"can not find var: ${name} in ctx"))
          }

        case Type() =>
          ValueType()

        case Pi(arg_type_map: ListMap[String, Exp], return_type: Exp) =>
          var local_ctx = ctx
          arg_type_map.foreach {
            case (name, exp) =>
              check(local_ctx, exp, ValueType())
              val infered_t = infer(local_ctx, exp)
              val value = eval(local_ctx, exp)
              val entry = CtxEntryTypeValueuePair(infered_t, value)
              local_ctx = local_ctx.ext(name, entry)
          }
          check(local_ctx, return_type, ValueType())
          ValueType()

        case Fn(arg_type_map: ListMap[String, Exp], body: Exp) =>
          var local_ctx = ctx
          arg_type_map.foreach {
            case (name, exp) =>
              check(local_ctx, exp, ValueType())
              val infered_t = infer(local_ctx, exp)
              val value = eval(local_ctx, exp)
              val entry = CtxEntryTypeValueuePair(infered_t, value)
              local_ctx = local_ctx.ext(name, entry)
          }
          val return_type_value = infer(local_ctx, body)
          val return_type = readback(return_type_value)
          ValuePi(arg_type_map, return_type, ctx)

        case Cl(type_map: ListMap[String, Exp]) =>
          var local_ctx = ctx
          type_map.foreach {
            case (name, exp) =>
              check(local_ctx, exp, ValueType())
              val infered_t = infer(local_ctx, exp)
              val value = eval(local_ctx, exp)
              val entry = CtxEntryTypeValueuePair(infered_t, value)
              local_ctx = local_ctx.ext(name, entry)
          }
          ValueType()

        case Obj(value_map: ListMap[String, Exp]) =>
          val type_map = ListMap(value_map.map {
            case (name, exp) => (name, eval(ctx, exp))
          }.toList: _*)
          ValueCl(type_map)

        case Ap(target: Exp, arg_list: List[Exp]) =>
          infer(ctx, target) match {
            case ValuePi(arg_type_map: ListMap[String, Exp], return_type: Exp, pi_ctx: Ctx) =>
              val name_list = arg_type_map.keys.toList
              val arg_map = ListMap(name_list.zip(arg_list): _*)
              val (new_ctx, _new_ctx) = check_telescope(ctx, arg_map, arg_type_map, pi_ctx)
              eval(new_ctx, return_type)

            case ValueType() =>
              eval(ctx, target) match {
                case tl: ValueTl =>
                  val name_list = tl.type_map.keys.toList
                  val arg_map = ListMap(name_list.zip(arg_list): _*)
                  val (_new_ctx, new_ctx) = check_telescope(ctx, arg_map, tl.type_map, tl.ctx)
                  val type_map = new_ctx.map.filter {
                    case (name, _entry) => tl.type_map.contains(name)
                  }.map {
                    case (name, CtxEntryTypeValueuePair(t, _value)) => (name, t)
                  }
                  // TODO apply (not partial) a class to its args get a type
                  // we are already returning type here instead of object
                  // this is not enough, since arg_map is known now, we can
                  ValueCl(type_map)

                case t =>
                  throw Report(List(s"expecting ValueTl but found: ${t}"))
              }

            case t =>
              throw Report(List(s"expecting ValuePi type but found: ${t}"))
          }

        case Dot(target: Exp, field: String) =>
          infer(ctx, target) match {
            case ValueCl(type_map: ListMap[String, Value]) =>
              type_map.get(field) match {
                case Some(t) => t
                case None =>
                  throw Report(List(s"infer fail, can not find field in dot: ${field}"))
              }
            case t =>
              throw Report(List(s"expecting ValueCl but found: ${t}"))
          }

        case Block(block_entry_map: ListMap[String, BlockEntry], body: Exp) =>
          var local_ctx = ctx
          block_entry_map.foreach {
            case (name, BlockEntryLet(exp)) =>
              val infered_t = infer(local_ctx, exp)
              val value = eval(local_ctx, exp)
              val entry = CtxEntryTypeValueuePair(infered_t, value)
              local_ctx = local_ctx.ext(name, entry)
            case (name, BlockEntryDefine(expected_t_exp, exp)) =>
              check(local_ctx, expected_t_exp, ValueType())
              val expected_t = eval(local_ctx, expected_t_exp)
              check(local_ctx, exp, expected_t)
              val infered_t = infer(local_ctx, exp)
              val value = eval(local_ctx, exp)
              val entry = CtxEntryTypeValueuePair(infered_t, value)
              local_ctx = local_ctx.ext(name, entry)
          }
          infer(local_ctx, body)
      }
    } catch {
      case report: Report =>
        throw report.prepend(
          s"infer fail\n" +
            s"exp: ${pretty_exp(exp)}\n")
    }
  }

}
