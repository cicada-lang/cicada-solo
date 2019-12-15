package xieyuheng.partech

import scala.collection.mutable.Set
import scala.collection.mutable.ArrayBuffer

import xieyuheng.partech.ruleDSL._

// Earley parser -- O(n^3)
// - collect parse tree by Earley's method, can not handle ambiguity.
// - ambiguity check is not decidable, thus only reported at runtime.
// - can not handle epsilon

object Earley {

  def init(words: List[Word], rule: Rule): Earley = {
    Earley(words: List[Word], rule: Rule)
  }

  case class Item(
    rule: Rule,
    choice_name: String,
    parts: List[RulePart],
    dot: Int,
    origin: Int,
    completed_by: Option[Item] = None,
  ) {

    val matters = (rule, choice_name, parts.length, dot, origin)

    override def equals(that: Any): Boolean = {
      that match {
        case that: Item => this.matters == that.matters
        case _ => false
      }
    }

    override def hashCode = matters.hashCode

    override def toString(): String = {
      var s = s"${rule.name}:${choice_name} -> "
      val indexes = 0 until parts.length
      indexes.foreach { case index =>
        val part = parts(index)
        if (dot == index) {
          s = s + "• "
        }
        s = s + s"${part} "
      }
      if (dot == parts.length) {
        s = s + "• "
      }
      s = s + s"[${origin}]"
      completed_by match {
        case Some(cause_of_completion) => s = s + s" { ${cause_of_completion} }"
        case None => {}
      }
      s
    }

  }

}

case class Earley(words: List[Word], rule: Rule) {
  import Earley._

  val start = Rule("$Earley", Map("start" -> List(rule)))

  var active: ArrayBuffer[Set[Item]] = ArrayBuffer.fill(words.length + 1)(Set())
  var completed: ArrayBuffer[Set[Item]] = ArrayBuffer.fill(words.length + 1)(Set())

  def predict(index: Int): Unit = {
    val itemset = active(index)

    var before_size: Option[Int] = Some(itemset.size)
    var after_size: Option[Int] = None

    while (before_size != after_size) {
      before_size = Some(itemset.size)
      itemset.foreach { case item =>
        predict_item(item, index)
      }
      after_size = Some(itemset.size)
    }
  }

  def predict_item(item: Item, index: Int): Unit = {
    item.parts(item.dot) match {
      case RulePartRule(rule_gen) =>
        val rule = rule_gen()
        expend_rule(rule, index)
      case _ => {}
    }
  }

  def expend_rule(rule: Rule, index: Int): Unit = {
    rule.choices.foreach { case (choice_name, parts) =>
      active(index) += Item(rule, choice_name, parts, 0, index)
    }
  }

  def scan(index: Int): Unit = {
    active(index).foreach { case item =>
      scan_item(item, index)
    }
  }

  def scan_item(item: Item, index: Int): Unit = {
    item.parts(item.dot) match {
      case RulePartStr(str) =>
        if (str == words(index).str) {
          item_forward(item, index)
        }
      case RulePartPred(word_pred) =>
        if (word_pred.pred(words(index).str)) {
          val new_parts = item.parts.patch(item.dot, List(RulePartStr(words(index).str)), 1)
          item_forward(item.copy(parts = new_parts), index)
        }
      case _ => {}
    }
  }

  def item_forward(item: Item, index: Int): Unit = {
    val itemset = if (item.dot + 1 == item.parts.length) {
      completed(index + 1)
    } else {
      active(index + 1)
    }
    itemset += item.copy(dot = item.dot + 1)
  }

  def complete(index: Int): Unit = {
    val itemset = completed(index + 1)

    var before_size: Option[Int] = Some(itemset.size)
    var after_size: Option[Int] = None

    while (before_size != after_size) {
      before_size = Some(itemset.size)
      itemset.foreach { case item =>
        complete_item(item, index)
      }
      after_size = Some(itemset.size)
    }
  }

  def complete_item(cause_of_completion: Item, index: Int): Unit = {
    val rule = cause_of_completion.rule
    val itemset = active(cause_of_completion.origin)
    itemset.foreach { case item =>
      item.parts(item.dot) match {
        case RulePartRule(rule_gen) =>
          if (rule == rule_gen()) {
            item_forward(item.copy(completed_by = Some(cause_of_completion)), index)
          }
        case _ => {}
      }
    }
  }

  def run(): Unit = {
    expend_rule(start, 0)
    val indexes = 0 until words.length
    indexes.foreach { case index =>
      predict(index)
      scan(index)
      complete(index)
    }
  }

  def report(): Unit = {
    val text = words.map(_.str).mkString(" ")

    println(s"text: ${text}")

    println()

    val indexes = 0 until words.length

    indexes.foreach { case index =>
      println(s"#${index}: ${words(index)}")
      println("- active:")
      active(index).foreach { case item => println(s"  ${item}") }
      println("- completed:")
      completed(index).foreach { case item => println(s"  ${item}") }
      println()
    }

    {
      val index = words.length

      println(s"#END:")
      println("- active:")
      active(index).foreach { case item => println(s"  ${item}") }
      println("- completed:")
      completed(index).foreach { case item => println(s"  ${item}") }
      println()
    }
  }

  run()

  val completed_starts: List[Item] = {
    val index = words.length
    completed(index).filter { case item =>
      item.rule == start &&
      item.dot == item.parts.length &&
      item.origin == 0
    }.toList
  }

  val recognize: Boolean = completed_starts.length > 0

  def parse(): Either[ErrMsg, Tree] = {
    if (completed_starts.length == 0) {
      Left(ErrMsg("Earley.parse",
        s"fail to recognize",
        Span(0, 0)))
    } else if (completed_starts.length > 1) {
      Left(ErrMsg("Earley.parse",
        s"grammar is ambiguous, found ${completed_starts.length} parse trees",
        Span(0, 0)))
    } else {
      val startItem = completed_starts(0)
      collect_node(startItem).flatMap { case tree =>
        if (tree.children.length != 1) {
          Left(ErrMsg("Earley.parse",
            s"collected multiple nodes under start, number of nodes: ${tree.children.length}",
            Span(0, 0)))
        } else {
          Right(tree.children(0))
        }
      }
    }
  }

  def collect_node(item: Item): Either[ErrMsg, Node] = {
    item.completed_by match {
      case Some(cause_of_completion) =>
        for {
          pair <- collect_children(item)
          (newItem, children) = pair

          itemset = active(cause_of_completion.origin) ++ completed(cause_of_completion.origin)

          prevList = itemset.filter { case prev =>
            prev.dot == newItem.dot - 1 &&
            prev.rule == newItem.rule &&
            prev.choice_name == newItem.choice_name
          }.toList

          result <- {
            if (prevList.length == 0) {
              val msg = {
                s"newItem: ${newItem}" ::
                s"cause_of_completion: ${cause_of_completion}" ::
                s"itemset:" ::
                itemset.map { case item => s"  ${item}"}.toList
              }.mkString("\n")
              Left(ErrMsg("Earley.parse", msg, Span(0, 0)))
            } else {
              if (prevList.length > 1) {
                val msg = {
                  s"many trees: ${prevList.length}" ::
                  s"prevList:" ::
                  prevList.map { case item => s"  ${item}"} ++
                  s"newItem: ${newItem}" ::
                  s"cause_of_completion: ${cause_of_completion}" ::
                  s"itemset:" ::
                  itemset.map { case item => s"  ${item}"}.toList
                }.mkString("\n")
                Left(ErrMsg("Earley.parse", msg, Span(0, 0)))
              } else {
                val prev = prevList(0)
                for {
                  node <- collect_node(prev)
                  mid <- collect_node(cause_of_completion)
                } yield node.copy(
                  children = (node.children :+ mid) ++ children)
              }
            }
          }

        } yield result

      case None =>
        for {
          pair <- collect_children(item)
          (_newItem, children) = pair
        } yield Node(item.rule, item.choice_name, children)
    }
  }

  def collect_children(item: Item): Either[ErrMsg, (Item, List[Tree])] = {
    import scala.annotation.tailrec

    @tailrec
    def count_str_before_dot(n: Int, parts: List[RulePart], dot: Int): Int = {
      if (dot == 0) {
        n
      } else {
        parts(dot - 1) match {
          case RulePartStr(str) =>
            count_str_before_dot(n + 1, parts, dot - 1)
          case RulePartRule(rule_gen) =>
            n
          case RulePartPred(word_pred) =>
            throw new Exception()
        }
      }
    }

    val n = count_str_before_dot(0, item.parts, item.dot)

    val children: List[Tree] = item.parts.slice(item.dot - n, item.dot).map {
      case RulePartStr(str) => Leaf(str)
      case RulePartRule(rule_gen) =>
        throw new Exception()
      case RulePartPred(word_pred) =>
        throw new Exception()
    }

    Right((item.copy(dot = item.dot - n), children))
  }
}
