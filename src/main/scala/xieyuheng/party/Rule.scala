package xieyuheng.party

case class Rule(name: String, choices: Map[String, List[Symbol]])

sealed trait Symbol
final case class SymbolWord(word: String) extends Symbol
final case class SymbolRule(rule: Rule) extends Symbol
final case class SymbolFn(fn: () => Rule) extends Symbol
final case class SymbolAp(fn: List[Symbol] => Rule, args: List[Symbol]) extends Symbol
final case class SymbolWordPred(word_pred: WordPred) extends Symbol

case class WordPred(name: String, pred: String => Boolean)
