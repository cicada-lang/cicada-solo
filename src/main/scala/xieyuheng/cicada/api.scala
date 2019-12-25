package xieyuheng.cicada

import scala.util.{ Try, Success, Failure }
import collection.immutable.ListMap

import xieyuheng.util.console._

import eval._
import check._
import infer._
import pretty._

object api {

  def run(
    top_list: List[Top],
    config: ListMap[String, List[String]],
  ): Unit = {
    try {
      top_list_check_and_eval(top_list, config)
    } catch {
      case report: Report =>
        console_print_with_color_when {
          config.get("--nocolor") == None
        } (Console.RED) {
          case () =>
            Console.println("------")
            report.message_list.foreach {
              case message =>
                Console.print(s"${message}")
                Console.println("------")
            }
        }
        System.exit(1)
    }
  }

  def top_list_check_and_eval(
    top_list: List[Top],
    config: ListMap[String, List[String]],
  ): Unit = {
    var local_env = Env()
    var local_ctx = Ctx()

    top_list.foreach {
      case TopLet(name, exp) =>
        val t = infer(local_env, local_ctx, exp)
        val value = eval(local_env, exp)
        local_ctx = local_ctx.ext(name, t)
        local_env = local_env.ext(name, value)
        if (config.get("--verbose") != None) {
          println(s"let ${name} = ${pretty_exp(exp)}")
          console_print_with_color_when {
            config.get("--nocolor") == None
          } (Console.CYAN) {
            case () =>
              println(s"let ${name} = ${pretty_value(value)} : ${pretty_value(t)}")
              println()
          }
        }

      case TopDefine(name, t_exp, exp) =>
        val t_expected = eval(local_env, t_exp)
        check(local_env, local_ctx, exp, t_expected)
        val t = infer(local_env, local_ctx, exp)
        val value = eval(local_env, exp)
        local_ctx = local_ctx.ext(name, t)
        local_env = local_env.ext(name, value)
        if (config.get("--verbose") != None) {
          println(s"define ${name} : ${pretty_exp(t_exp)} = ${pretty_exp(exp)}")
          console_print_with_color_when {
            config.get("--nocolor") == None
          } (Console.CYAN) {
            case () =>
              println(s"define ${name} : ${pretty_value(t)} = ${pretty_value(value)}")
              println()
          }
        }

      case TopKeywordRefuse(exp, t_exp) =>
        val t_expected = eval(local_env, t_exp)
        Try {
          check(local_env, local_ctx, exp, t_expected)
        } match {
          case Success(_) =>
            throw Report(List(
              s"@refuse fail\n" +
                s"should refuse the following type membership assertion\n" +
                s"@refuse ${pretty_exp(exp)} : ${pretty_exp(t_exp)}\n"
            ))
          case Failure(report) =>
            if (config.get("--verbose") != None) {
              println(s"@refuse ${pretty_exp(exp)} : ${pretty_exp(t_exp)}")
            }
        }

      case TopKeywordShow(exp) =>
        val t = infer(local_env, local_ctx, exp)
        val value = eval(local_env, exp)
        println(s"@show ${pretty_exp(exp)}")
        console_print_with_color_when {
          config.get("--nocolor") == None
        } (Console.CYAN) {
          case () =>
            println(s"@show ${pretty_value(value)} : ${pretty_value(t)}")
            println()
        }

    }
  }

}
