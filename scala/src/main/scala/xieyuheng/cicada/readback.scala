package xieyuheng.cicada

import collection.immutable.ListMap

import evaluate._

object readback {

  def readback(value: Value): Exp = {
    value match {
      case ValueType() =>
        Type()

      case ValueStrType() =>
        StrType()

      case ValueStr(str: String) =>
        Str(str: String)

      case ValuePi(telescope: Telescope, return_type: Exp) =>
        var type_map: ListMap[String, Exp] = ListMap()
        var telescope_env = telescope.env
        telescope.type_map.foreach {
          case (name, t) =>
            val t_value = evaluate(telescope_env, t)
            telescope_env = telescope_env.ext(name, t_value, NeutralVar(name))
            type_map = type_map + (name -> readback(t_value))
        }
        Pi(type_map, readback(evaluate(telescope_env, return_type)))

      case ValueFn(telescope: Telescope, body: Exp) =>
        var type_map: ListMap[String, Exp] = ListMap()
        var telescope_env = telescope.env
        telescope.type_map.foreach {
          case (name, t) =>
            val t_value = evaluate(telescope_env, t)
            telescope_env = telescope_env.ext(name, t_value, NeutralVar(name))
            type_map = type_map + (name -> readback(t_value))
        }
        Fn(type_map, readback(evaluate(telescope_env, body)))

      case ValueFnCase(cases) =>
        FnCase(cases.map {
          case (telescope, body) =>
            var type_map: ListMap[String, Exp] = ListMap()
            var telescope_env = telescope.env
            telescope.type_map.foreach {
              case (name, t) =>
                val t_value = evaluate(telescope_env, t)
                telescope_env = telescope_env.ext(name, t_value, NeutralVar(name))
                type_map = type_map + (name -> readback(t_value))
            }
            (type_map, readback(evaluate(telescope_env, body)))
        })

      case ValueCl(defined, telescope: Telescope) =>
        var type_map: ListMap[String, Exp] = ListMap()
        var telescope_env = telescope.env
        telescope.type_map.foreach {
          case (name, t) =>
            val t_value = evaluate(telescope_env, t)
            telescope_env = telescope_env.ext(name, t_value, NeutralVar(name))
            type_map = type_map + (name -> readback(t_value))
        }
        val defined_back = defined.map {
          case (name, (t, v)) =>
            (name, (readback(t), readback(v)))
        }
        Cl(defined_back, type_map)

      case ValueObj(value_map: ListMap[String, Value]) =>
        Obj(value_map.map { case (name, v) => (name, readback(v)) })

      case NeutralVar(name: String) =>
        Var(name)

      case NeutralAp(target: Neutral, args: List[Value]) =>
        Ap(readback(target), args.map(readback))

      case NeutralDot(target: Neutral, field_name: String) =>
        Dot(readback(target), field_name)
    }
  }

}
