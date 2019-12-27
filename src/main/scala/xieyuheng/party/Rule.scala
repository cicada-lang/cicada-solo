package xieyuheng.party

case class Rule(name: String, choices: Map[String, List[Symbol]])

sealed trait Symbol {

  def non_terminal_p(): Boolean = {
    this match {
      case SymbolWord(word: String) =>
        false
      case SymbolWordPred(word_pred: WordPred) =>
        false
      case SymbolRule(rule: Rule) =>
        true
      case SymbolFn(fn) =>
        true
      case SymbolAp(fn, args: List[Symbol]) =>
        true
    }
  }

  def non_terminal_to_rule(): Rule = {
    this match {
      case SymbolWord(word: String) =>
        throw new Error(s"non_terminal_to_rule can not handle: ${this}")
      case SymbolWordPred(word_pred: WordPred) =>
        throw new Error(s"non_terminal_to_rule can not handle: ${this}")
      case SymbolRule(rule: Rule) =>
        rule
      case SymbolFn(fn) =>
        fn()
      case SymbolAp(fn, args: List[Symbol]) =>
        fn(args)
    }
  }

  def terminal_p(): Boolean = {
    !this.non_terminal_p()
  }

  def terminal_match(word: String): Boolean = {
    this match {
      case SymbolWord(word2: String) =>
        word == word2
      case SymbolWordPred(word_pred: WordPred) =>
        word_pred.pred(word)
      case SymbolRule(rule: Rule) =>
        throw new Error(s"terminal_match can not handle: ${this}")
      case SymbolFn(fn) =>
        throw new Error(s"terminal_match can not handle: ${this}")
      case SymbolAp(fn, args: List[Symbol]) =>
        throw new Error(s"terminal_match can not handle: ${this}")
    }
  }

  def repr(): String = {
    this match {
      case SymbolWord(word: String) =>
        val doublequote = '"'
        s"${doublequote}${word}${doublequote}"
      case SymbolWordPred(word_pred: WordPred) =>
        s"?${word_pred.name}"
      case SymbolRule(rule: Rule) =>
        s"${rule.name}"
      case SymbolFn(fn) =>
        val rule = fn()
        s"${rule.name}"
      case SymbolAp(fn, args: List[Symbol]) =>
        val rule = fn(args)
        s"${rule.name}"
    }
  }

}

final case class SymbolWord(word: String) extends Symbol
final case class SymbolWordPred(word_pred: WordPred) extends Symbol
final case class SymbolRule(rule: Rule) extends Symbol
final case class SymbolFn(fn: () => Rule) extends Symbol
final case class SymbolAp(fn: List[Symbol] => Rule, args: List[Symbol]) extends Symbol

case class WordPred(name: String, pred: String => Boolean) {

  val matters = name

  override def equals(that: Any): Boolean = {
    that match {
      case that: WordPred => this.matters == that.matters
      case _ => false
    }
  }

  override def hashCode = matters.hashCode

}
