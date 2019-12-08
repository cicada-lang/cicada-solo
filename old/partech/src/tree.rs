use crate::rule::Rule;
// use crate::error::ErrorDuringParsing;

#[derive(Clone)]
#[derive(Debug)]
#[derive(PartialEq, Eq)]
pub enum Tree <'a> {
    Word(String),
    Node {
        rule: &'a Rule<'a>,
        choice_name: String,
        children: Vec<Tree<'a>>,
    },
}

// pub fn tree_matcher<A>(
//     tree: &Tree,
//     name: String,
//     choices: Vec<(String, fn (&Vec<Tree>) -> A)>,
// ) -> Result<A, ErrorDuringParsing> {
//     unimplemented!()
// }
