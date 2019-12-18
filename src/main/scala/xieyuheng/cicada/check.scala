package xieyuheng.cicada

import collection.immutable.ListMap

import eval._
import infer._
import subtype._
import pretty._

object check {

  def check(ctx: Ctx, exp: Exp, t: Value): Unit = {
    try {
      exp match {
        case Obj(value_map: ListMap[String, Exp]) =>
          t match {
            case tl: ValueTl =>
              check_telescope(ctx, value_map, tl.type_map, tl.ctx)

            case _ =>
              throw Report(List(s"expecting class type but found: ${t}"))
          }

        case _ =>
          val s = infer(ctx, exp)
          subtype(ctx, s, t)
      }
    } catch {
      case report: Report =>
        throw report.prepend(
          s"check fail\n" +
            s"exp: ${pretty_exp(exp)}\n" +
            s"t: ${pretty_value(t)}\n")
    }
  }

  def check_telescope(
    ctx: Ctx,
    arg_exp_map: ListMap[String, Exp],
    type_map: ListMap[String, Exp],
    init_telescope_ctx: Ctx,
  ): (Ctx, Ctx) = {
    var local_ctx = ctx
    var telescope_ctx = init_telescope_ctx
    type_map.foreach {
      case (name, t_exp) =>
        val t_value = eval(telescope_ctx, t_exp)
        val v_exp = arg_exp_map.get(name) match {
          case Some(v_exp) => v_exp
          case None =>
            throw Report(List(
              s"check_telescope fail, can not find a field of object in class, field: ${name}"
            ))
        }
        check(local_ctx, v_exp, t_value)
        val v_value = eval(ctx, v_exp) // NOTE using the old `ctx` instead of `local_ctx`
        val entry = CtxEntryTypeValueuePair(t_value, v_value)
        local_ctx = local_ctx.ext(name, entry)
        telescope_ctx = telescope_ctx.ext(name, entry)
    }
    (local_ctx, telescope_ctx)
  }

}
