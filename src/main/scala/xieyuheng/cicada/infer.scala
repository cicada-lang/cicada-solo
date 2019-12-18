package xieyuheng.cicada

import collection.immutable.ListMap

import eval._
import check._
import subtype._
import readback._
import pretty._

object infer {

  def infer(env: Env, ctx: Ctx, exp: Exp): Value = {
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
              check(env, local_ctx, exp, ValueType())
              local_ctx = local_ctx.ext(name, eval(env, exp))
          }
          check(env, local_ctx, return_type, ValueType())
          ValueType()

        case Fn(arg_type_map: ListMap[String, Exp], body: Exp) =>
          var local_ctx = ctx
          arg_type_map.foreach {
            case (name, exp) =>
              check(env, local_ctx, exp, ValueType())
              local_ctx = local_ctx.ext(name, eval(env, exp))
          }
          val return_type_value = infer(env, local_ctx, body)
          val return_type = readback(return_type_value)
          ValuePi(arg_type_map, return_type, env)

        case Cl(type_map: ListMap[String, Exp]) =>
          var local_ctx = ctx
          type_map.foreach {
            case (name, exp) =>
              check(env, local_ctx, exp, ValueType())
              local_ctx = local_ctx.ext(name, eval(env, exp))
          }
          ValueType()

        case Obj(value_map: ListMap[String, Exp]) =>
          val type_map = ListMap(value_map.map {
            case (name, exp) => (name, eval(env, exp))
          }.toList: _*)
          ValueCl(type_map)

        case Ap(target: Exp, arg_list: List[Exp]) =>
          infer(env, ctx, target) match {
            case ValuePi(arg_type_map: ListMap[String, Exp], return_type: Exp, pi_env: Env) =>
              val name_list = arg_type_map.keys.toList
              val arg_map = ListMap(name_list.zip(arg_list): _*)
              val (new_env, _new_ctx) = check_telescope(env, ctx, arg_map, arg_type_map, pi_env)
              eval(new_env, return_type)

            case ValueType() =>
              eval(env, target) match {
                case tl: ValueTl =>
                  val name_list = tl.type_map.keys.toList
                  val arg_map = ListMap(name_list.zip(arg_list): _*)
                  val (_new_env, new_ctx) = check_telescope(env, ctx, arg_map, tl.type_map, tl.env)
                  val type_map = new_ctx.type_map.filter {
                    case (name, _t) => tl.type_map.contains(name)
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
          infer(env, ctx, target) match {
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
              local_ctx = local_ctx.ext(name, eval(env, exp))
            case (name, BlockEntryDefine(_t, exp)) =>
              local_ctx = local_ctx.ext(name, eval(env, exp))
          }
          infer(env, local_ctx, body)
      }
    } catch {
      case report: Report =>
        throw report.prepend(
          s"infer fail\n" +
            s"exp: ${pretty_exp(exp)}\n")
    }
  }

}
