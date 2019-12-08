use crate::rule::Rule;
use crate::lexer::Lexer;
use crate::tree::Tree;
use crate::partech::Partech;
use crate::error::ErrorDuringParsing;

pub struct Parser <'a> {
    rule: &'a Rule<'a>,
    lexer: &'a dyn Lexer,
    partech: &'a dyn Partech,
}

impl <'a> Parser <'a> {
    pub fn parse(&self, text: &'a str) -> Result<Tree<'a>, ErrorDuringParsing> {
        let tokens = self.lexer.lex(text)?;
        self.partech.parse_tokens_by_rule(tokens, self.rule)
    }
}
