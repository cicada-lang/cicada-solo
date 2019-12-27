package xieyuheng.cicada

import collection.immutable.ListMap

import eval._
import pretty._

object util {

  def telescope_force(
    telescope: Telescope,
    name_list: List[String],
  ): ListMap[String, Value] = {
    var local_env = telescope.env
    ListMap(telescope.type_map.toList.zipWithIndex.map {
      case ((name, exp), i) =>
        local_env = local_env.ext(name, NeutralVar(name_list(i)))
        val value = eval(local_env, exp)
        (name_list(i), value)
    }.toList: _*)
  }

  def telescope_force_with_return(
    telescope: Telescope,
    name_list: List[String],
    exp: Exp,
  ): (ListMap[String, Value], Value) = {
    // println(s"telescope_force_with_return begin")
    // println(s"name_list: ${name_list}")
    var local_env = telescope.env
    val value_map = ListMap(telescope.type_map.toList.zipWithIndex.map {
      case ((name, exp), i) =>
        val value = eval(local_env, exp)
        (name_list(i), value)
    }.toList: _*)
    // println(s"exp = ${pretty_exp(exp)}")
    val value = eval(local_env, exp)
    // println(s"telescope_force_with_return end")
    (value_map, value)
  }


  //   def telescope_force(
  //     telescope: Telescope,
  //     name_list: List[String],
  //   ): ListMap[String, Value] = {
  //     val type_map = telescope.type_map
  //     val env = telescope.env
  //     val full_var_map = ListMap(type_map.keys.toList.zip(name_list): _*)
  //     ListMap(type_map.toList.zipWithIndex.map {
  //       case ((_name, exp), i) =>
  //         val value = eval(env, util.exp_subst_var_map(exp, full_var_map.take(i)))
  //         (name_list(i), value)
  //     }.toList: _*)
  //   }

  // def telescope_force_with_return(
  //   telescope: Telescope,
  //   name_list: List[String],
  //   exp: Exp,
  // ): (ListMap[String, Value], Value) = {
  //   val type_map = telescope.type_map
  //   val env = telescope.env
  //   val full_var_map = ListMap(type_map.keys.toList.zip(name_list): _*)
  //   val value_map = ListMap(type_map.toList.zipWithIndex.map {
  //     case ((_name, exp), i) =>
  //       val value = eval(env, util.exp_subst_var_map(exp, full_var_map.take(i)))
  //       (name_list(i), value)
  //   }.toList: _*)
  //   val value = eval(env, util.exp_subst_var_map(exp, full_var_map))
  //   (value_map, value)
  // }

  //   def exp_subst_var_map(exp: Exp, var_map: ListMap[String, String]): Exp = {
  //     exp match {
  //       case Var(name: String) =>
  //         var_map.get(name) match {
  //           case Some(new_name) => Var(new_name)
  //           case None => exp
  //         }

  //       case Type() =>
  //         exp

  //       case StrType() =>
  //         exp

  //       case Str(str: String) =>
  //         exp

  //       case Pi(type_map: ListMap[String, Exp], return_type: Exp) =>
  //         val new_type_map = type_map.map {
  //           case (name, exp) =>
  //             (name, exp_subst_var_map(exp, var_map))
  //         }
  //         val new_return_type = exp_subst_var_map(return_type, var_map);
  //         Pi(type_map, new_return_type)

  //       case Fn(type_map: ListMap[String, Exp], body: Exp) =>
  //         val new_type_map = type_map.map {
  //           case (name, exp) =>
  //             (name, exp_subst_var_map(exp, var_map))
  //         }
  //         val new_body = exp_subst_var_map(body, var_map);
  //         Fn(type_map, new_body)

  //       case Ap(target: Exp, arg_list: List[Exp]) =>
  //         val new_target = exp_subst_var_map(target, var_map)
  //         val new_arg_list = arg_list.map {
  //           case exp =>
  //             exp_subst_var_map(exp, var_map)
  //         }
  //         Ap(new_target, new_arg_list)

  //       case Cl(defined, type_map: ListMap[String, Exp]) =>
  //         val new_defined = defined.map {
  //           case (name, (t, exp)) =>
  //             (name, (exp_subst_var_map(t, var_map), exp_subst_var_map(exp, var_map)))
  //         }
  //         val new_type_map = type_map.map {
  //           case (name, exp) =>
  //             (name, exp_subst_var_map(exp, var_map))
  //         }
  //         Cl(new_defined, new_type_map)

  //       case Obj(value_map: ListMap[String, Exp]) =>
  //         val new_value_map = value_map.map {
  //           case (name, exp) =>
  //             (name, exp_subst_var_map(exp, var_map))
  //         }
  //         Obj(new_value_map)

  //       case Dot(target: Exp, field: String) =>
  //         val new_target = exp_subst_var_map(target, var_map)
  //         Dot(new_target, field)

  //       case Union(type_list: List[Exp]) =>
  //         Union(type_list.map { exp_subst_var_map(_, var_map) })

  //       case Switch(name: String, cases: List[(Exp, Exp)]) =>
  //         Switch(name, cases.map {
  //           case (t, v) => (exp_subst_var_map(t, var_map), exp_subst_var_map(v, var_map))
  //         })

  //       case Block(block_entry_map: ListMap[String, BlockEntry], body: Exp) =>
  //         val new_block_entry_map = block_entry_map.map {
  //           case (name, BlockEntryLet(exp)) =>
  //             (name, BlockEntryLet(exp_subst_var_map(exp, var_map)))
  //           case (name, BlockEntryDefine(t, exp)) =>
  //             (name, BlockEntryDefine(exp_subst_var_map(t, var_map), exp_subst_var_map(exp, var_map)))
  //         }
  //         val new_body = exp_subst_var_map(body, var_map)
  //         Block(new_block_entry_map, new_body)
  //     }
  //   }

}
