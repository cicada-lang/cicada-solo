package xieyuheng.cicada

import eval._
import check._
import infer._
import pretty._

object api {

  def run(top_list: List[Top]): Either[Err, Unit] = {
    top_list_check_and_eval(top_list)
    // top_list_only_eval(top_list)
  }

  def top_list_only_eval(top_list: List[Top]): Either[Err, Unit] = {
    var local_env = Env()
    for {
      _ <- util.list_foreach_maybe_err(top_list) {
        case TopLet(name, exp) =>
          for {
            value <- eval(local_env, exp)
            _ = {
              local_env = local_env.ext(name, value)
              println(s"let ${name} = ${pretty_exp(exp)}")
              println(s">>> ${name} = ${pretty_value(value)}")
            }
          } yield ()
        case TopDefine(name, t_exp, exp) =>
          for {
            t <- eval(local_env, t_exp)
            value <- eval(local_env, exp)
            _ = {
              local_env = local_env.ext(name, value)
              println(s"define ${name} : ${pretty_exp(t_exp)} = ${pretty_exp(exp)}")
              println(s">>>>>> ${name} : ${pretty_value(t)} = ${pretty_value(value)}")
            }
          } yield ()
      }
    } yield ()
  }

  def top_list_check_and_eval(top_list: List[Top]): Either[Err, Unit] = {
    var local_env = Env()
    var local_ctx = Ctx()
    for {
      _ <- util.list_foreach_maybe_err(top_list) {
        case TopLet(name, exp) =>
          for {
            t <- infer(local_env, local_ctx, exp)
            value <- eval(local_env, exp)
            _ = {
              local_ctx = local_ctx.ext(name, t)
              local_env = local_env.ext(name, value)
              println(s"let ${name} = ${pretty_exp(exp)}")
              println(s">>> ${name} = ${pretty_value(value)} : ${pretty_value(t)}")
            }
          } yield ()

        case TopDefine(name, t_exp, exp) =>
          for {
            t_expected <- eval(local_env, t_exp)
            _ <- check(local_env, local_ctx, exp, t_expected)
            t <- infer(local_env, local_ctx, exp)
            value <- eval(local_env, exp)
            _ = {
              local_env = local_env.ext(name, value)
              println(s"define ${name} : ${pretty_exp(t_exp)} = ${pretty_exp(exp)}")
              println(s">>>>>> ${name} : ${pretty_value(t)} = ${pretty_value(value)}")
            }
          } yield ()
      }

    } yield ()
  }

}
