package xieyuheng.cicada

import scala.util.{ Try, Success, Failure }

import eval._
import check._
import infer._
import pretty._

object api {

  def run(top_list: List[Top]): Unit = {
    top_list_check_and_eval(top_list)
  }

  def top_list_check_and_eval(top_list: List[Top]): Unit = {
    var local_env = Env()
    var local_ctx = Ctx()
    top_list.foreach {
      case TopLet(name, exp) =>
        val t = infer(local_env, local_ctx, exp)
        val value = eval(local_env, exp)
        local_ctx = local_ctx.ext(name, t)
        local_env = local_env.ext(name, value)
        println(s"let ${name} = ${pretty_exp(exp)}")
        println(s">>> ${name} = ${pretty_value(value)} : ${pretty_value(t)}")

      case TopDefine(name, t_exp, exp) =>
        val t_expected = eval(local_env, t_exp)
        check(local_env, local_ctx, exp, t_expected)
        val t = infer(local_env, local_ctx, exp)
        val value = eval(local_env, exp)
        local_ctx = local_ctx.ext(name, t)
        local_env = local_env.ext(name, value)
        println(s"define ${name} : ${pretty_exp(t_exp)} = ${pretty_exp(exp)}")
        println(s">>>>>> ${name} : ${pretty_value(t)} = ${pretty_value(value)}")

      case TopKeywordRefuse(name, t_exp, exp) =>
        val t_expected = eval(local_env, t_exp)
        Try {
          check(local_env, local_ctx, exp, t_expected)
        } match {
          case Success(_) =>
            throw Report(List(
              s"@refuse fail\n" +
                s"should refuse the following definition\n" +
                s"@refuse ${name} : ${pretty_exp(t_exp)} = ${pretty_exp(exp)}\n"
            ))
          case Failure(report) =>
            println(s"@refuse ${name} : ${pretty_exp(t_exp)} = ${pretty_exp(exp)}")
        }
    }
  }

}
