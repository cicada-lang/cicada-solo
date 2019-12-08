use crate::rule::Rule;
use crate::tree::Tree;
use crate::token::Token;
use crate::error::ErrorDuringParsing;

pub trait Partech {
    fn parse_tokens_by_rule<'a>(
        &self, tokens: Vec<Token<'a>>, rule: &'a Rule<'a>,
    ) -> Result<Tree<'a>, ErrorDuringParsing>;
}
