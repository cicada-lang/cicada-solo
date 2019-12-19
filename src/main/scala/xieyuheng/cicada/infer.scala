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
              throw Report(List(
                s"can not find var: ${name} in ctx\n"
              ))
          }

        case Type() =>
          ValueType()

        case Pi(type_map: ListMap[String, Exp], return_type: Exp) =>
          var local_ctx = ctx
          type_map.foreach {
            case (name, exp) =>
              check(env, local_ctx, exp, ValueType())
              local_ctx = local_ctx.ext(name, eval(env, exp))
          }
          check(env, local_ctx, return_type, ValueType())
          ValueType()

        case Fn(type_map: ListMap[String, Exp], body: Exp) =>
          var local_ctx = ctx
          type_map.foreach {
            case (name, exp) =>
              check(env, local_ctx, exp, ValueType())
              local_ctx = local_ctx.ext(name, eval(env, exp))
          }
          val return_type_value = infer(env, local_ctx, body)
          val return_type = readback(return_type_value)
          ValuePi(Telescope(type_map, env), return_type)

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
          ValueClAlready(type_map)

        case Ap(target: Exp, arg_list: List[Exp]) =>
          infer(env, ctx, target) match {
            case ValuePi(Telescope(type_map: ListMap[String, Exp], pi_env: Env), return_type: Exp) =>
              val name_list = type_map.keys.toList
              val arg_map = ListMap(name_list.zip(arg_list): _*)
              val (new_env, _new_ctx) = check_telescope(env, ctx, arg_map, type_map, pi_env)
              eval(new_env, return_type)

            case ValueType() =>
              eval(env, target) match {
                case cl: ValueCl =>
                  val name_list = cl.telescope.type_map.keys.toList
                  val arg_map = ListMap(name_list.zip(arg_list): _*)
                  val (_new_env, new_ctx) =
                    check_telescope(env, ctx, arg_map, cl.telescope.type_map, cl.telescope.env)
                  val type_map = new_ctx.type_map.filter {
                    case (name, _t) => cl.telescope.type_map.contains(name)
                  }
                  // TODO apply (not partial) a class to its args get a type
                  // we are already returning type here instead of object
                  // this is not enough, since arg_map is known now, we can
                  ValueClAlready(type_map)

                case t =>
                  throw Report(List(
                    s"expecting ValueCl but found: ${t}\n"
                  ))
              }

            case t =>
              throw Report(List(
                s"expecting ValuePi type but found: ${t}\n"
              ))
          }

        case Dot(target: Exp, field: String) =>
          infer(env, ctx, target) match {
            case ValueClAlready(type_map: ListMap[String, Value]) =>
              type_map.get(field) match {
                case Some(t) => t
                case None =>
                  throw Report(List(
                    s"infer fail, can not find field in dot: ${field}\n"
                  ))
              }
            case t =>
              throw Report(List(
                s"expecting ValueClAlready but found: ${t}\n"
              ))
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
            s"exp: ${pretty_exp(exp)}\n"
        )
    }
  }

}
