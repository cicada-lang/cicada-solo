package xieyuheng.cicada

import scala.util.{ Try, Success, Failure }
import collection.immutable.ListMap

import xieyuheng.util.console._

import evaluate._
import check._
import infer._
import pretty._
import equivalent._

object api {

  def run(
    top_list: List[Top],
    config: ListMap[String, List[String]],
  ): Unit = {
    try {
      top_list_check_and_evaluate(top_list, config)
    } catch {
      case report: ErrorReport =>
        report_print(report, config)
        System.exit(1)
    }
  }

  def report_print(
    report: ErrorReport,
    config: ListMap[String, List[String]],
  ): Unit = {
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
  }

  def top_list_check_and_evaluate(
    top_list: List[Top],
    config: ListMap[String, List[String]],
  ): Unit = {
    var local_env = Env(ListMap())

    top_list.foreach {
      case TopLet(name, exp) =>
        local_env.lookup_value(name) match {
          case Some(value) =>
            throw ErrorReport(List(
              s"name: ${name} is already defined to value: ${pretty_value(value)}\n"
            ))
          case None => ()
        }
        val t = infer(local_env, exp)
        val value = evaluate(local_env, exp)
        local_env = local_env.ext(name, t, value)
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
        local_env.lookup_value(name) match {
          case Some(value) =>
            throw ErrorReport(List(
              s"name: ${name} is already defined to value: ${pretty_value(value)}\n"
            ))
          case None => ()
        }
        val t_expected = evaluate(local_env, t_exp)
        check(local_env, exp, t_expected)
        local_env = local_env.ext_rec(name, t_exp, exp, local_env)
        val value = evaluate(local_env, exp)
        if (config.get("--verbose") != None) {
          println(s"define ${name} : ${pretty_exp(t_exp)} = ${pretty_exp(exp)}")
          console_print_with_color_when {
            config.get("--nocolor") == None
          } (Console.CYAN) {
            case () =>
              println(s"define ${name} : ${pretty_exp(t_exp)} = ${pretty_value(value)}")
              println()
          }
        }

      case TopKeywordRefuse(exp, t_exp) =>
        val t_expected = evaluate(local_env, t_exp)
        Try {
          check(local_env, exp, t_expected)
          println("@refuse")
          println(s"v: ${pretty_value(evaluate(local_env, exp))}")
          println(s"t_expected: ${pretty_value(t_expected)}")
          println("@refuse raw Value")
          println(s"v: ${evaluate(local_env, exp)}")
          println(s"t_expected: ${t_expected}")
        } match {
          case Success(()) =>
            throw ErrorReport(List(
              s"should refuse the following type membership assertion\n" +
                s"@refuse ${pretty_exp(exp)} : ${pretty_exp(t_exp)}\n"
            ))
          case Failure(_report: ErrorReport) =>
            if (config.get("--verbose") != None) {
              println(s"@refuse ${pretty_exp(exp)} : ${pretty_exp(t_exp)}")
            }
          case Failure(error) =>
            throw error
        }

      case TopKeywordAccept(exp, t_exp) =>
        val t_expected = evaluate(local_env, t_exp)
        Try {
          check(local_env, exp, t_expected)
        } match {
          case Success(()) =>
            if (config.get("--verbose") != None) {
              println(s"@accept ${pretty_exp(exp)} : ${pretty_exp(t_exp)}")
            }
          case Failure(report: ErrorReport) =>
            report_print(report, config)
            throw ErrorReport(List(
              s"should accept the following type membership assertion\n" +
                s"@accept ${pretty_exp(exp)} : ${pretty_exp(t_exp)}\n"
            ))
          case Failure(error) =>
            throw error
        }

      case TopKeywordShow(exp) =>
        val t = infer(local_env, exp)
        val value = evaluate(local_env, exp)
        println(s"@show ${pretty_exp(exp)}")
        console_print_with_color_when {
          config.get("--nocolor") == None
        } (Console.CYAN) {
          case () =>
            println(s"@show ${pretty_value(value)} : ${pretty_value(t)}")
            println()
        }

      case TopKeywordEq(rhs: Exp, lhs: Exp) =>
        infer(local_env, rhs)
        infer(local_env, lhs)
        Try {
          equivalent(evaluate(local_env, rhs), evaluate(local_env, lhs))
        } match {
          case Success(()) =>
            if (config.get("--verbose") != None) {
              println(s"@eq ${pretty_exp(rhs)} = ${pretty_exp(lhs)}")
            }
          case Failure(report: ErrorReport) =>
            report_print(report, config)
            throw ErrorReport(List(
              s"should accept the following equivalent assertion\n" +
                s"@eq ${pretty_exp(rhs)} = ${pretty_exp(lhs)}\n"
            ))
          case Failure(error) =>
            throw error
        }

    }
  }

}
