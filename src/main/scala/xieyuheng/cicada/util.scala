package xieyuheng.cicada

import collection.immutable.ListMap

import eval._

object util {

  def force_telescope(
    name_list: List[String],
    exp_map: ListMap[String, Exp],
    env: Env,
  ): ListMap[String, Value] = {
    val full_var_map = ListMap(exp_map.keys.toList.zip(name_list): _*)
    ListMap(exp_map.toList.zipWithIndex.map {
      case ((_name, exp), i) =>
        val value = eval(env, util.exp_subst_var_map(exp, full_var_map.take(i)))
        (name_list(i), value)
    }.toList: _*)
  }

  def force_telescope_with_return(
    name_list: List[String],
    exp_map: ListMap[String, Exp],
    exp: Exp,
    env: Env,
  ): (ListMap[String, Value], Value) = {
    val full_var_map = ListMap(exp_map.keys.toList.zip(name_list): _*)
    val value_map = ListMap(exp_map.toList.zipWithIndex.map {
      case ((_name, exp), i) =>
        val value = eval(env, util.exp_subst_var_map(exp, full_var_map.take(i)))
        (name_list(i), value)
    }.toList: _*)
    val value = eval(env, util.exp_subst_var_map(exp, full_var_map))
    (value_map, value)
  }

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

      case Obj(value_map: ListMap[String, Exp]) =>
        val new_value_map = ListMap(value_map.map {
          case (name, exp) =>
            (name, exp_subst_var_map(exp, var_map))
        }.toList: _*)
        Obj(new_value_map)

      case Dot(target: Exp, field: String) =>
        val new_target = exp_subst_var_map(target, var_map)
        Dot(new_target, field)

      case Block(block_entry_map: ListMap[String, BlockEntry], body: Exp) =>
        val new_block_entry_map = ListMap(block_entry_map.map {
          case (name, BlockEntryLet(exp)) =>
            (name, BlockEntryLet(exp_subst_var_map(exp, var_map)))
          case (name, BlockEntryDefine(t, exp)) =>
            (name, BlockEntryDefine(exp_subst_var_map(t, var_map), exp_subst_var_map(exp, var_map)))
        }.toList: _*)
        val new_body = exp_subst_var_map(body, var_map)
        Block(new_block_entry_map, new_body)
    }
  }

}
