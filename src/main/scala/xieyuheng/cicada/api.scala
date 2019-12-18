package xieyuheng.cicada

import eval._
import check._
import infer._
import pretty._

object api {

  def run(top_list: List[Top]): Unit = {
    top_list_check_and_eval(top_list)
  }

  def top_list_check_and_eval(top_list: List[Top]): Unit = {
    var local_ctx = Ctx()
    top_list.foreach {
      case TopLet(name, exp) =>
        val infered_t = infer(local_ctx, exp)
        val value = eval(local_ctx, exp)
        val entry = CtxEntryTypeValueuePair(infered_t, value)
        local_ctx = local_ctx.ext(name, entry)
        println(s"let ${name} = ${pretty_exp(exp)}")
        println(s">>> ${name} = ${pretty_value(value)} : ${pretty_value(infered_t)}")

      case TopDefine(name, t_exp, exp) =>
        val t_expected = eval(local_ctx, t_exp)
        check(local_ctx, exp, t_expected)
        val infered_t = infer(local_ctx, exp)
        val value = eval(local_ctx, exp)
        val entry = CtxEntryTypeValueuePair(infered_t, value)
        local_ctx = local_ctx.ext(name, entry)
        println(s"define ${name} : ${pretty_exp(t_exp)} = ${pretty_exp(exp)}")
        println(s">>>>>> ${name} : ${pretty_value(infered_t)} = ${pretty_value(value)}")
    }
  }

}
