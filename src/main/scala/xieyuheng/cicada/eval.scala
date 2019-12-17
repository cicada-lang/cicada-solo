package xieyuheng.cicada

import collection.immutable.ListMap

import infer._
import pretty._

object eval {

  def eval(ctx: Ctx, exp: Exp): Either[Err, Value] = {
    exp match {
      case Var(name: String) =>
        ctx.lookup_value(name) match {
          case Some(value) => Right(value)
          case None => Right(NeutralVar(name))
        }

      case Type() =>
        Right(ValueType())

      case Pi(arg_type_map: ListMap[String, Exp], return_type: Exp) =>
        Right(ValuePi(arg_type_map: ListMap[String, Exp], return_type: Exp, ctx: Ctx))

      case Fn(arg_type_map: ListMap[String, Exp], body: Exp) =>
        Right(ValueFn(arg_type_map: ListMap[String, Exp], body: Exp, ctx: Ctx))

      case Ap(target: Exp, arg_list: List[Exp]) =>
        for {
          value <- eval(ctx, target)
          type_list <- util.list_map_maybe_err(arg_list) { infer(ctx, _) }
          arg_list <- util.list_map_maybe_err(arg_list) { eval(ctx, _) }
          result <- value_ap(value, type_list, arg_list)
        } yield result

      case Cl(type_map: ListMap[String, Exp]) =>
        Right(ValueTl(type_map: ListMap[String, Exp], ctx: Ctx))

      case Obj(value_map: ListMap[String, Exp]) =>
        for {
          value_map <- util.list_map_map_maybe_err(value_map) {
            case (_name, exp) => eval(ctx, exp)
          }
        } yield ValueObj(value_map)

      case Dot(target: Exp, field: String) =>
        for {
          value <- eval(ctx, target)
          result <- value_dot(value, field)
        } yield result

      case Block(block_entry_map: ListMap[String, BlockEntry], body: Exp) =>
        var local_ctx = ctx
        for {
          _ <- util.list_map_foreach_maybe_err(block_entry_map) {
            case (name, BlockEntryLet(exp)) =>
              eval(local_ctx, exp).map {
                case value =>
                  infer(local_ctx, exp).map {
                    case t =>
                      val entry = CtxEntryTypeValueuePair(t, value)
                      local_ctx = local_ctx.ext(name, entry)
                  }
              }
            case (name, BlockEntryDefine(t, exp)) =>
              eval(local_ctx, exp).map {
                case value =>
                  eval(local_ctx, t).map {
                    case t =>
                      val entry = CtxEntryTypeValueuePair(t, value)
                      local_ctx = local_ctx.ext(name, entry)
                  }
              }
          }
          result <- eval(local_ctx, body)
        } yield result

    }
  }

  def value_ap(
    value: Value,
    type_list: List[Value],
    arg_list: List[Value],
  ): Either[Err, Value] = {
    value match {
      case neutral: Neutral =>
        // TODO should be Right(NeutralAp(neutral, type_list, arg_list))
        Right(NeutralAp(neutral, arg_list))
      case ValueFn(arg_type_map: ListMap[String, Exp], body: Exp, ctx: Ctx) =>
        val name_list = arg_type_map.keys.toList
        if (name_list.length != arg_type_map.size) {
          Left(Err("value_ap fail, ValueFn arity mismatch"))
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
          Left(Err("value_ap fail, ValueTl arity mismatch"))
        } else {
          val value_map = ListMap(name_list.zip(arg_list): _*)
          Right(ValueObj(value_map))
        }
      case _ => Left(Err(
        "value_ap fail, expecting ValueFn or ValueTl\n" +
          s"value: ${pretty_value(value)}\n"
      ))
    }
  }

  def value_dot(value: Value, field: String): Either[Err, Value] = {
    value match {
      case neutral: Neutral => Right(NeutralDot(neutral, field))
      case ValueObj(value_map: ListMap[String, Value]) =>
        value_map.get(field) match {
          case Some(value) => Right(value)
          case None => Left(Err(s"missing field: ${field}"))
        }
      case _ => Left(Err("value_dot fail, expecting ValueObj"))
    }
  }

}
