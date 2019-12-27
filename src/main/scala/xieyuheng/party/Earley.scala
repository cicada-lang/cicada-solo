package xieyuheng.party

import scala.util.{ Try, Success, Failure }
import scala.collection.mutable.Set
import scala.collection.mutable.ArrayBuffer

case class Earley() extends Partech {

  def parse_tokens_by_rule(tokens: List[Token], rule: Rule): Tree = {
    val parsing = Parsing(tokens, rule)
    parsing.unique_tree()
  }

  def recognize(tokens: List[Token], rule: Rule): Boolean = {
    val parsing = Parsing(tokens, rule)
    parsing.recognize()
  }

  case class Item(
    rule: Rule,
    choice_name: String,
    symbols: List[Symbol],
    dot: Int,
    origin: Int,
    cause: Option[Item],
  ) {

    def repr(): String = {
      var s = s"${this.rule.name}:${this.choice_name} -> "
      this.symbols.zipWithIndex.foreach {
        case (symbol, i) =>
          val symbol = this.symbols(i)
          if (this.dot == i) {
            s = s + "• "
          }
          s = s + s"${symbol.repr()} "
      }
      if (this.dot == this.symbols.length) {
        s = s + "• "
      }
      s = s + "#" + this.origin.toString()
      this.cause.foreach {
        case cause_item =>
          s = s + s" { ${cause_item.repr()} }"
      }
      s
    }

  }

  case class Parsing(tokens: List[Token], rule: Rule) {

    val start: Rule = Rule("$", Map("$" -> List(SymbolRule(rule))))
    var chart: ArrayBuffer[Set[Item]] = ArrayBuffer.fill(tokens.length + 1)(Set())
    var finished_p = false

    def run(debug_p: Boolean = false): Unit = {
      if (!this.finished_p) {
        this.add_rule_to_chart(this.start, 0)
        if (debug_p) {
          println(s"begin:")
          println(s"${this.repr()}")
        }
        val indexex = 0 until tokens.length
        indexex.foreach {
          case i =>
            this.predict(i)
            if (debug_p) {
              println(s"predict:")
              println(s"${this.repr()}")
            }
            this.scan(i)
            if (debug_p) {
              println(s"scan:")
              println(s"${this.repr()}")
            }
            this.complete(i)
            if (debug_p) {
              println(s"complete:")
              println(s"${this.repr()}")
            }
        }
      }
      this.finished_p = true
    }

    def predict(i: Int): Unit = {
      this.apply_to_item_until_no_effect(i) {
        case item =>
          if (item.dot < item.symbols.length) {
            val symbol = item.symbols(item.dot)
            if (symbol.non_terminal_p()) {
              val rule = symbol.non_terminal_to_rule()
              this.add_rule_to_chart(rule, i)
            }
          }
      }
    }

    def scan(i: Int): Unit = {
      this.chart(i).foreach {
        case item =>
          if (item.dot < item.symbols.length) {
            val symbol = item.symbols(item.dot)
            if (symbol.terminal_p()) {
              val word = this.tokens(i).word
              if (symbol.terminal_match(word)) {
                var symbols = item.symbols
                symbols = symbols.updated(item.dot, SymbolWord(word))
                this.chart(i+1).add(item.copy(
                  dot = item.dot + 1,
                  symbols = symbols,
                ))
              }
            }
          }
      }
    }

    def complete(i: Int): Unit = {
      this.apply_to_item_until_no_effect(i + 1) {
        case cause_item =>
          if (cause_item.dot == cause_item.symbols.length) {
            this.chart(cause_item.origin).foreach {
              case origin_item =>
                if (origin_item.dot < origin_item.symbols.length) {
                  val symbol = origin_item.symbols(origin_item.dot)
                  if (symbol.non_terminal_p()) {
                    val rule = symbol.non_terminal_to_rule()
                    if (rule == cause_item.rule) {
                      this.chart(i+1).add(origin_item.copy(
                        dot = origin_item.dot + 1,
                        cause = Some(cause_item),
                      ))
                    }
                  }
                }
            }
          }
      }
    }

    def add_rule_to_chart(rule: Rule, i: Int): Unit = {
      rule.choices.foreach {
        case (choice_name, symbols) =>
          this.chart(i).add(Item(
            rule,
            choice_name,
            symbols,
            dot = 0,
            origin = i,
            cause = None,
          ))
      }
    }

    def apply_to_item_until_no_effect(i: Int)(f: Item => Unit): Unit = {
      var before_size: Option[Int] = Some(this.chart(i).size)
      var after_size: Option[Int] = None
      while (before_size != after_size) {
        before_size = Some(this.chart(i).size)
        this.chart(i).foreach { f(_) }
        after_size = Some(this.chart(i).size)
      }
    }

    def unique_tree(debug_p: Boolean = false): Tree = {
      this.run(debug_p)
      val completed_starts = this.completed_starts()
      if (completed_starts.length == 1) {
        val item = completed_starts(0)
        val node = this.collect_node(item)
        node.children(0)
      } else {
        throw ErrorDuringParsing("", Span(0, 0))
      }
    }

    def recognize(debug_p: Boolean = false): Boolean = {
      Try {
        this.run(debug_p)
      } match {
        case Success(()) =>
          this.completed_starts().length > 0
        case Failure(_error) =>
          false
      }
    }

    def completed_starts(): List[Item] = {
      val i = this.tokens.length
      val items = this.chart(i)
      items.toList.filter {
        case item =>
          item.rule == this.start &&
          item.dot == item.symbols.length &&
          item.origin == 0
      }
    }

    def collect_node(item: Item): Node = {
      item.cause match {
        case Some(cause_item) =>
          val (new_item, children) = this.collect_children(item)
          val item_list = this.chart(cause_item.origin).toList
          val prev_item_list = item_list.filter {
            case prev_item =>
              prev_item.dot == new_item.dot - 1 &&
              prev_item.rule == new_item.rule &&
              prev_item.choice_name == new_item.choice_name
          }
          if (prev_item_list.length == 1) {
            val prev_item = prev_item_list(0)
            val node = this.collect_node(prev_item)
            val mid = this.collect_node(cause_item)
            node.copy(children = node.children ++ List(mid) ++ children)
          } else {
            throw new Error("TODO")
          }
        case None =>
          val (_new_item, children) = this.collect_children(item)
          Node(item.rule, item.choice_name, children)
      }
    }

    def collect_children(item: Item): (Item, List[Tree]) = {
      val n = count_words_before_dot(item)
      val children: List[Tree] =
        item.symbols
          .slice(item.dot - n, item.dot)
          .map {
            case SymbolWord(word) =>
              Leaf(Token(word, Span(0, 0)))
            case _ =>
              throw new Error("TODO")
          }
      (item.copy(dot = item.dot - n), children)
    }

    def count_words_before_dot(item: Item): Int = {
      val symbols = item.symbols
      var n = 0
      var cursor = item.dot
      var continue_p = true
      while (cursor > 0 && continue_p) {
        val symbol = symbols(cursor - 1)
        if (symbol.isInstanceOf[SymbolWord]) {
          n = n + 1
          cursor = cursor - 1
        } else if (symbol.non_terminal_p()) {
          continue_p = false
        } else {
          throw new Error("TODO")
        }
      }
      n
    }

    def repr(): String = {
      var s = ""
      val indexex = 0 until this.tokens.length
      indexex.foreach {
        case i =>
          val items = this.chart(i)
          val doublequote = '"'
          s = s + s"#${i}: ${doublequote}${this.tokens(i).word}${doublequote}:\n"
          items.foreach {
            case item =>
              s = s + " "
              s = s + item.repr()
              s = s + "\n"
          }
      }
      val i = this.tokens.length
      val items = this.chart(i)
      s = s + s"#${i}: END:\n"
      items.foreach {
        case item =>
          s = s + " "
          s = s + item.repr()
          s = s + "\n"
      }
      s
    }

  }

}
