// package xieyuheng.party.testers

// import xieyuheng.party._
// import xieyuheng.party.predefined._

// object exp extends PartechTester {

//   val description = """
//   expressions with `dot` and `case`
//   """

//   def lexer = Lexer.default

//   def sentences = List(
//     "type",
//     "n",
//     "x.prev",
//     "succ_t(prev = nat_add(x = x.prev, y = y))",

//     """
//     x case {
//       zero_t => y
//       succ_t => succ_t(prev = nat_add(x = x.prev, y = y))
//     }
//     """,

//     """
//     x case {
//       zero_t => y
//       succ_t => succ_t(prev = nat_add(x = x.prev, y = x case {
//         zero_t => y
//         succ_t => succ_t(prev = nat_add(x = x.prev, y = y))
//       }))
//     }
//     """,

//     """
//     x case {
//       zero_t => x case {
//          zero_t => y
//          succ_t => succ_t(prev = nat_add(x = x.prev, y = x case {
//            zero_t => y
//            succ_t => succ_t(prev = nat_add(x = x.prev, y = y))
//          }))
//        }
//       succ_t => succ_t(prev = nat_add(x = x.prev, y = x case {
//         zero_t => y
//         succ_t => succ_t(prev = nat_add(x = x.prev, y = y))
//       }))
//     }
//     """,
//   )

//   def non_sentences = List(
//     "x..y",
//     "x...y",
//   )

//   def preserved: List[String] = List(
//     "type", "case", "fn", "pi")

//   def identifier = identifier_with_preserved("identifier", preserved)

//   def start = exp

//   def matcher = None

//   def exp: Rule = Rule(
//     "exp", Map(
//       "type" -> List("type"),
//       "var" -> List(identifier),
//       "case" -> List(exp, "case", "{", non_empty_list(case_clause), "}"),
//       "dot" -> List(exp, ".", identifier),
//       "pi" -> List("pi", "(", non_empty_list(arg), ")", ":", exp),
//       "fn" -> List("fn", "(", non_empty_list(arg), ")", ":", exp, "=", exp),
//       "ap" -> List(exp, "(", non_empty_list(arg), ")"),
//     ))

//   def case_clause = Rule(
//     "case_clause", Map(
//       "case_clause" -> List(identifier, "=", ">", exp),
//     ))

//   def arg = Rule(
//     "arg", Map(
//       "value" -> List(identifier, "=", exp),
//       "type" ->  List(identifier, ":", exp),
//       "value_comma" -> List(identifier, "=", exp, ","),
//       "type_comma" ->  List(identifier, ":", exp, ","),
//     ))

// }
