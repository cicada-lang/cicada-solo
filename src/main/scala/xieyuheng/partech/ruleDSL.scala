package xieyuheng.partech

object ruleDSL {

  implicit def SymbolWord_from_word(word: String): SymbolWord = {
    SymbolWord(word)
  }

  implicit def SymbolFn_from_fn(fn: () => Rule): SymbolFn = {
    SymbolFn(fn)
  }

  implicit def SymbolWordPred_from_word_pred(word_pred: WordPred): SymbolWordPred = {
    SymbolWordPred(word_pred)
  }

  def $ (fn: List[Symbol] => Rule, args: Symbol*): SymbolAp = {
    SymbolAp(fn, args.toList)
  }

}
