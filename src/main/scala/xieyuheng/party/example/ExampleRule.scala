package xieyuheng.party.example

import xieyuheng.party._

trait ExampleRule {
  def sentences: List[String]
  def non_sentences: List[String]
  def lexer: Lexer
  def start: Rule
  def matcher: Option[Tree => _]
}
