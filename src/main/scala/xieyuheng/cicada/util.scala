package xieyuheng.cicada

import collection.immutable.ListMap

import eval._

object util {

  // about list_map and error

  def list_map_foreach_maybe_err[K, A]
    (list_map: ListMap[K, A])
    (f: (K, A) => Either[Err, Unit])
      : Either[Err, Unit] = {
    val init_result: Either[Err, Unit] = Right(())
    list_map.foldLeft(init_result) {
      case (result, (k, a)) =>
        result match {
          case Right(_ok) =>
            f(k, a) match {
              case Right(ok) => Right(ok)
              case Left(err) => Left(err)
            }
          case Left(err) => Left(err)
        }
    }
  }

  def list_map_map_maybe_err[K, A, B]
    (list_map: ListMap[K, A])
    (f: (K, A) => Either[Err, B])
      : Either[Err, ListMap[K, B]] = {
    val init_result: Either[Err, ListMap[K, B]] = Right(ListMap.empty)
    list_map.foldLeft(init_result) {
      case (result, (k, a)) =>
        result match {
          case Right(list_map) =>
            f(k, a) match {
              case Right(b) => Right(list_map + (k -> b))
              case Left(err) => Left(err)
            }
          case Left(err) => Left(err)
        }
    }
  }

  def list_map_map_entry_with_index_maybe_err[K, A, B]
    (list_map: ListMap[K, A])
    (f: (Int, K, A) => Either[Err, (K, B)])
      : Either[Err, ListMap[K, B]] = {
    val init_result: Either[Err, ListMap[K, B]] = Right(ListMap.empty)
    var i = 0
    list_map.foldLeft(init_result) {
      case (result, (k, a)) =>
        i = i + 1
        result match {
          case Right(list_map) =>
            f(i - 1, k, a) match {
              case Right((k, b)) => Right(list_map + (k -> b))
              case Left(err) => Left(err)
            }
          case Left(err) => Left(err)
        }
    }
  }

  // about list and error

  def list_map_maybe_err[A, B]
    (list: List[A])
    (f: A => Either[Err, B])
      : Either[Err, List[B]] = {
    val init: Either[Err, List[B]] = Right(List.empty)
    list.foldLeft(init) {
      case (result, a) =>
        result match {
          case Right(list) =>
            f(a) match {
              case Right(b) => Right(list :+ b)
              case Left(err) => Left(err)
            }
          case Left(err) => Left(err)
        }
    }
  }

  def list_foreach_maybe_err[A]
    (list: List[A])
    (f: A => Either[Err, Unit])
      : Either[Err, Unit] = {
    val init: Either[Err, Unit] = Right(())
    list.foldLeft(init) {
      case (result, a) =>
        result match {
          case Right(_ok) =>
            f(a) match {
              case Right(_ok) => Right(())
              case Left(err) => Left(err)
            }
          case Left(err) => Left(err)
        }
    }
  }

  // about val

  def force_telescope(
    name_list: List[String],
    exp_map: ListMap[String, Exp],
    env: Env,
  ): Either[Err, ListMap[String, Val]] = {
    val full_var_map = ListMap(exp_map.keys.toList.zip(name_list): _*)
    for {
      value_map <- util.list_map_map_entry_with_index_maybe_err(exp_map) {
        case (i, _name, exp) =>
          eval(env, util.exp_subst_var_map(exp, full_var_map.take(i)))
            .map { case value => (name_list(i), value) }
      }
    } yield value_map
  }

  def force_telescope_with_extra_exp(
    name_list: List[String],
    exp_map: ListMap[String, Exp],
    exp: Exp,
    env: Env,
  ): Either[Err, (ListMap[String, Val], Val)] = {
    val full_var_map = ListMap(exp_map.keys.toList.zip(name_list): _*)
    for {
      value_map <- util.list_map_map_entry_with_index_maybe_err(exp_map) {
        case (i, _name, exp) =>
          eval(env, util.exp_subst_var_map(exp, full_var_map.take(i)))
            .map { case value => (name_list(i), value) }
      }
      value <- eval(env, util.exp_subst_var_map(exp, full_var_map))
    } yield (value_map, value)
  }

  // about exp

  def exp_subst_var_map(exp: Exp, var_map: ListMap[String, String]): Exp = {
    exp match {
      case Var(name: String) =>
        var_map.get(name) match {
          case Some(new_name) => Var(new_name)
          case None => exp
        }

      case Type() =>
        exp

      case Pi(arg_type_map: ListMap[String, Exp], return_type: Exp) =>
        val new_arg_type_map = ListMap(arg_type_map.map {
          case (name, exp) =>
            (name, exp_subst_var_map(exp, var_map))
        }.toList: _*)
        val new_return_type = exp_subst_var_map(return_type, var_map);
        Pi(arg_type_map, new_return_type)

      case Fn(arg_type_map: ListMap[String, Exp], body: Exp) =>
        val new_arg_type_map = ListMap(arg_type_map.map {
          case (name, exp) =>
            (name, exp_subst_var_map(exp, var_map))
        }.toList: _*)
        val new_body = exp_subst_var_map(body, var_map);
        Fn(arg_type_map, new_body)

      case Ap(target: Exp, arg_list: List[Exp]) =>
        val new_target = exp_subst_var_map(target, var_map)
        val new_arg_list = arg_list.map {
          case exp =>
            exp_subst_var_map(exp, var_map)
        }
        Ap(new_target, new_arg_list)

      case Cl(type_map: ListMap[String, Exp]) =>
        val new_type_map = ListMap(type_map.map {
          case (name, exp) =>
            (name, exp_subst_var_map(exp, var_map))
        }.toList: _*)
        Cl(new_type_map)

      case Obj(val_map: ListMap[String, Exp]) =>
        val new_val_map = ListMap(val_map.map {
          case (name, exp) =>
            (name, exp_subst_var_map(exp, var_map))
        }.toList: _*)
        Obj(new_val_map)

      case Dot(target: Exp, field: String) =>
        val new_target = exp_subst_var_map(target, var_map)
        Dot(new_target, field)

      case Block(block_entry_map: ListMap[String, BlockEntry], body: Exp) =>
        val new_block_entry_map = ListMap(block_entry_map.map {
          case (name, BlockLet(exp)) =>
            (name, BlockLet(exp_subst_var_map(exp, var_map)))
          case (name, BlockDefine(t, exp)) =>
            (name, BlockDefine(exp_subst_var_map(t, var_map), exp_subst_var_map(exp, var_map)))
        }.toList: _*)
        val new_body = exp_subst_var_map(body, var_map)
        Block(new_block_entry_map, new_body)
    }
  }

}
